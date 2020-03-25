const { app, BrowserWindow,ipcMain  } = require('electron');
const path = require('path');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    center:true,
    resizable: false,
    show:false,
    frame:false,
    icon:path.join(__dirname,'img/icon.png'),
    backgroundColor: '#2e2c29',
    webPreferences: {
        preload:path.join(__dirname,'renderer.js')
    }
  });

  // and load the home page of the app.
  mainWindow.loadURL('https://onehack.us');

/*
  mainWindow.once("ready-to-show",()=>{
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.webContents.send('PageChanged',"Page has changed");
  });
  */
  //when ready maximize and show. This reduces flashing
  
  ipcMain.on('App-Loaded', ()=>{
    mainWindow.maximize();
    mainWindow.show();
  });

  var handleRedirect = (e, url) => {
    mainWindow.webContents.send('PageChanged',"Page has changed");
    if(url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    }
  }
  
  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

