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
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10
        }, {
            url: ["onehack.us"],
            invert: ["header .title a img","#back-button img","#forward-button img"]
        });
        handleWindowControls();
        bindShortcuts();
        ipcRenderer.send('app-loaded', "Im ready");

    }
};

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
    var controlsContainer = document.getElementById("controls-container");
    if (!controlsContainer) {
        var wrapper = document.querySelector("header .wrap");
        wrapper.setAttribute("style", "max-width: unset; margin: 0;width: 100%;");
        controlsContainer = createControlsContainer();
    }

    function createControlsContainer() {
        var header = document.querySelector("header .wrap .contents.clearfix");
        var container = document.createElement("div");
        container.id = "controls-container";
        container.setAttribute("style", "margin-right: 8px; display: flex; justify-content: center;");
        container.append(createBackButton());
        container.append(createForwardButton());
        header.prepend(container);
        return container;
    }

    function createForwardButton() {
        var forwardDiv = document.createElement("div");
        forwardDiv.id = "forward-button";
        forwardDiv.setAttribute("style", "display: flex;justify-content: center;align-items: center;width: 2.2857em;height: 2.2857em;padding: .2143em;");

        var forwardImg = document.createElement("img");
        forwardImg.src = "https://gistcdn.githack.com/ahmedayman4a/dc96efbee546ad1579d9b80d3470cf04/raw/8aab981aa8505ca389eb3746e69c7598e25b8d7d/Forward.svg";
        forwardImg.style.width = "2em";
        forwardImg.style.height = "2em";
        forwardImg.id = "forward-button-img";
        forwardDiv.append(forwardImg);
        forwardImg.onmouseover = function () {
            forwardImg.src = "https://gistcdn.githack.com/ahmedayman4a/56a1e7611248596525335532b1d1b8f8/raw/584d257915f5278c2318882ab7dcd121095663b9/ForwardOnHover.svg";
        };
        forwardImg.onmouseout = function () {
            forwardImg.src = "https://gistcdn.githack.com/ahmedayman4a/dc96efbee546ad1579d9b80d3470cf04/raw/8aab981aa8505ca389eb3746e69c7598e25b8d7d/Forward.svg";
        };
        forwardImg.addEventListener("click", event => {
            win.webContents.goForward();
        });
        return forwardDiv;
    }

    function createBackButton() {
        var backDiv = document.createElement("div");
        backDiv.id = "back-button";
        backDiv.setAttribute("style", "display: flex;justify-content: center;align-items: center; width: 2.2857em;height: 2.2857em;padding: .2143em;");

        var backImg = document.createElement("img");
        backImg.src = "https://gistcdn.githack.com/ahmedayman4a/07f4bdb4637d9545396d4985daed696d/raw/c224cb85ca13af933111f82a5540f61d2bc3c0e9/Back.svg";
        backImg.style.width = "2em";
        backImg.style.height = "2em";
        backImg.id = "back-button-img";
        backDiv.append(backImg);
        backImg.onmouseover = function () {
            backImg.src = "https://gistcdn.githack.com/ahmedayman4a/06645a0ee356b9e6227fbb15cf5d3117/raw/47d6d206c78ae4b67697660bf642e38fa4db007c/BackOnHover.svg";
        };
        backImg.onmouseout = function () {
            backImg.src = "https://gistcdn.githack.com/ahmedayman4a/07f4bdb4637d9545396d4985daed696d/raw/c224cb85ca13af933111f82a5540f61d2bc3c0e9/Back.svg";
        };
        backImg.addEventListener("click", event => {
            win.webContents.goBack();
        });
        return backDiv;
    }
}