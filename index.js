const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeTheme
} = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');
const store = new Store();

nativeTheme.themeSource = "system";
contextMenu({
  prepend: (defaultActions, params, mainWindow) => [{
      label: 'Back',
      click: () => {
        mainWindow.webContents.goBack();
      }
    },
    {
      label: 'Forward',
      click: () => {
        mainWindow.webContents.goForward();
      }
    },
    {
      label: 'Refresh (F5)',
      click: () => {
        mainWindow.reload();
      }
    },
    {
      label: 'Enable Dark Mode',
      visible: !nativeTheme.shouldUseDarkColors,
      click: () => {
        setDarkTheme();
      }
    },
    {
      label: 'Disable Dark Mode',
      visible: nativeTheme.shouldUseDarkColors,
      click: () => {
        setLightTheme();
      }
    }
  ]
});
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let isQuiting;
let tray;
let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();
// Allow only one instance of the app
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show()
      mainWindow.focus()
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      center: true,
      show: false,
      fullscreen: false,
      fullscreenable: false,
      maximizable: true,
      title: "1Hack | Tutorials For Free, Guides, Articles & Community Forum - A place where everyone can share knowledge with each other",
      icon: path.join(__dirname, 'img/icon.png'),
      backgroundColor: '#2e2c29',
      webPreferences: {
        enableBlinkFeatures: 'BackForwardCache',
        preload: path.join(__dirname, 'renderer.js')
      }
    });
    mainWindow.setMenu(null);
    mainWindow.on('page-title-updated', function (e, title) {
      if (title.startsWith("OneHack.Us")) {
        mainWindow.setTitle("1Hack | Tutorials For Free, Guides, Articles & Community Forum - A place where everyone can share knowledge with each other");
        e.preventDefault();
      }
    });

    // and load the home page of the app.
    mainWindow.loadURL('https://onehack.us');

    //when ready maximize and show. This reduces flashing

    ipcMain.on('app-loaded', () => {
      if(store.has("theme")){
        if(store.get("theme") == "dark"){
          setDarkTheme();
        }else if(store.get("theme") == "light"){
          setLightTheme();
        }
      }else{
        if (nativeTheme.shouldUseDarkColors) {
          setDarkTheme();
        } else {
          setLightTheme();
        }
      }
      

      mainWindow.show();
      mainWindow.maximize();
      
    });

    ipcMain.once('app-loaded', () => {
      createTray();
    });
    //Open all links with target=_blank in the default browser

    mainWindow.webContents.on('new-window', (e, url) => {
      if (url != mainWindow.webContents.getURL()) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
      }
    });

    mainWindow.webContents.on('will-navigate', (e, url) => {
      mainWindow.webContents.send('Page-Changed', "Page has changed");
      if (url != mainWindow.webContents.getURL()) {
        e.preventDefault();
      }
    });

    mainWindow.on('close', function (event) {
      if (!isQuiting) {
        event.preventDefault();
        mainWindow.hide();
        event.returnValue = false;
      }
    });
  });
}

app.on('before-quit', function () {
  isQuiting = true;
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    isQuiting = true;
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
  mainWindow.show();
  mainWindow.focus();
});

function setLightTheme() {
  store.set("theme", "light");
  mainWindow.webContents.send('set-theme', "light");
  ipcMain.once('finished-set-theme',()=>{
    nativeTheme.themeSource = "light";
  });
}

function setDarkTheme() {
  store.set("theme", "dark");
  mainWindow.webContents.send('set-theme', "dark");
  ipcMain.once('finished-set-theme',()=>{
    nativeTheme.themeSource = "dark";
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'img/icon2.png'));
  tray.setIgnoreDoubleClickEvents(true);
  tray.setContextMenu(Menu.buildFromTemplate([{
      label: 'Show App',
      click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ]));
  tray.setToolTip('1Hack - Together WE Learn');
}