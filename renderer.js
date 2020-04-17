const remote = require('electron').remote;
const {
    ipcRenderer
} = require('electron');
var Mousetrap = require('mousetrap');
const DarkReader = require('darkreader');
const win = remote.getCurrentWindow();


// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
        bindShortcuts();
        ipcRenderer.send('app-loaded', "Im ready");

    }
};
ipcRenderer.on('set-theme', (e,theme) => {
    if(theme=="dark"){
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10
        }, {
            url: ["onehack.us"],
            invert: ["header .title a img","#backSvg","#forwardSvg"]
        });
    }else if(theme=="light"){
        DarkReader.disable();
    }
    ipcRenderer.send('finished-set-theme');
  });
window.onscroll = function () {
    handleWindowControls();
};


function bindShortcuts() {
    Mousetrap.bind(['command+r', 'ctrl+r', 'f5'], () => {
        win.reload();

        return false // prevents default behavior and stops event from bubbling
    })
}

function handleWindowControls() {
    var oldBackDiv = document.getElementById("back-button");
    var oldForwardDiv = document.getElementById("forward-button");
    if (!oldBackDiv || !oldForwardDiv){
        var wrapper = document.querySelector("header .wrap");
        wrapper.setAttribute("style","margin: 0;width: 100%; max-width: unset;")
        var ulELement = wrapper.querySelector(".contents ul.icons");
        if(!oldBackDiv){
            var backLi = createBackButton();
            ulELement.append(backLi);
        }

        if(!oldForwardDiv){
            var forwardLi = createForwardButton();
            ulELement.append(forwardLi);
        }
    }

    function createForwardButton() {
        var forwardLi = document.createElement("li");
        var forwardDiv = document.createElement("div");
        forwardDiv.id = "forward-button";
        forwardDiv.setAttribute("style", "margin-right: 10px; display: flex;justify-content: center;align-items: center;width: 2.2857em;height: 2.2857em;padding: .2143em;");
        forwardLi.append(forwardDiv);
        var forwardSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        forwardSvg.innerHTML = '<path id="forwardmouseout" d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.833 256-256S397.167 0 256 0zm0 490.667c-129.396 0-234.667-105.27-234.667-234.667S126.604 21.333 256 21.333 490.667 126.604 490.667 256 385.396 490.667 256 490.667zm-35.125-359.542c-4.167-4.167-10.917-4.167-15.083 0s-4.167 10.917 0 15.083L315.583 256l-109.8 109.792c-4.167 4.167-4.167 10.917 0 15.083 2.083 2.083 4.813 3.125 7.542 3.125s5.458-1.042 7.542-3.125L338.2 263.542c4.167-4.167 4.167-10.917 0-15.083L220.875 131.125z"/> <path id="forwardmouseover" display="none" d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.833 256-256S397.167 0 256 0zm82.208 263.542L220.875 380.875c-2.042 2.042-4.77 3.125-7.542 3.125-1.375 0-2.77-.27-4.083-.813-3.98-1.646-6.583-5.542-6.583-9.854v-32a10.66 10.66 0 0 1 3.125-7.542l77.79-77.79-77.792-77.792a10.66 10.66 0 0 1-3.125-7.542v-32a10.67 10.67 0 0 1 6.583-9.854c3.98-1.604 8.583-.73 11.625 2.313l117.333 117.333c4.168 4.167 4.168 10.917.001 15.084z"/>';
        forwardSvg.setAttribute("style", "width: 2em; height: 2em;");
        forwardSvg.setAttribute("viewBox", "0 0 512 512");
        forwardSvg.id="forwardSvg";
        forwardDiv.append(forwardSvg);
        forwardSvg.onmouseover = function () {
            document.getElementById("forwardmouseover").setAttribute("display","unset");
            document.getElementById("forwardmouseout").setAttribute("display","none");
            };
        forwardSvg.onmouseout = function () {
            document.getElementById("forwardmouseover").setAttribute("display","none");
            document.getElementById("forwardmouseout").setAttribute("display","unset");
        };
        forwardSvg.addEventListener("click", event => {
            win.webContents.goForward();
        });
        return forwardLi;
    }

    function createBackButton() {
        var backLi = document.createElement("li");
        var backDiv = document.createElement("div");
        backDiv.id = "back-button";
        backDiv.setAttribute("style", "display: flex;justify-content: center;align-items: center; width: 2.2857em;height: 2.2857em;padding: .2143em;");
        backLi.append(backDiv);
        var backSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        backSvg.innerHTML = '<path id="backmouseout" d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.833 256-256S397.167 0 256 0zm0 490.667c-129.396 0-234.667-105.27-234.667-234.667S126.604 21.333 256 21.333 490.667 126.604 490.667 256 385.396 490.667 256 490.667zm50.208-359.542c-4.167-4.167-10.917-4.167-15.083 0L173.792 248.458c-4.167 4.167-4.167 10.917 0 15.083l117.333 117.333c2.083 2.083 4.813 3.125 7.542 3.125s5.458-1.042 7.542-3.125c4.167-4.167 4.167-10.917 0-15.083L196.417 256 306.2 146.208c4.166-4.166 4.166-10.916-.001-15.083z"/> <path id="backmouseover" display="none" d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.833 256-256S397.167 0 256 0zm53.333 170.667a10.66 10.66 0 0 1-3.125 7.542L228.417 256l77.792 77.792a10.66 10.66 0 0 1 3.125 7.542v32a10.67 10.67 0 0 1-6.583 9.854c-3.98 1.604-8.583.73-11.625-2.313L173.792 263.542c-4.167-4.167-4.167-10.917 0-15.083l117.333-117.333c2.042-2.042 4.77-3.125 7.542-3.125 1.375 0 2.77.27 4.083.813 3.98 1.646 6.583 5.542 6.583 9.854v32z"/>';
        backSvg.setAttribute("style", "width: 2em; height: 2em;");
        backSvg.setAttribute("viewBox", "0 0 512 512");
        backSvg.id="backSvg";
        backDiv.append(backSvg);
        backSvg.onmouseover = function () {
            document.getElementById("backmouseover").setAttribute("display","unset");
            document.getElementById("backmouseout").setAttribute("display","none");
        };
        backSvg.onmouseout = function () {
            document.getElementById("backmouseover").setAttribute("display","none");
            document.getElementById("backmouseout").setAttribute("display","unset");
        };
        backSvg.addEventListener("click", event => {
            win.webContents.goBack();
        });
        return backLi;
    }
}