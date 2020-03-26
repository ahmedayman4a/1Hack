const remote = require('electron').remote;
const { ipcRenderer } = require('electron');

const win = remote.getCurrentWindow();

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
       ipcRenderer.send('App-Loaded',"Im ready");
    }
};

window.onscroll = function() {handleWindowControls()};
window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    var oldMinimizeButton = document.getElementById("minimize-button");
    var oldCloseButton = document.getElementById("close-button");
    if (!oldMinimizeButton || !oldCloseButton){
        var wrapper = document.querySelector("header .wrap");
        wrapper.setAttribute("style","margin: 0;width: 100%; max-width: unset;")
        var ulELement = wrapper.querySelector(".contents ul.icons");
        if(!oldMinimizeButton){
            //Creates li inside it minimize div inside it minimize image
            var minimizeLi = createMinimizeButton();
            ulELement.append(minimizeLi);
        }

        if(!oldCloseButton){
            var closeLi = createCloseButton();
            ulELement.append(closeLi);
        }
    }
    

    function createCloseButton() {
        var closeLi = document.createElement("li");
        var closeButton = document.createElement("div");
        closeButton.id = "close-button";
        closeButton.setAttribute("style", "grid-column: 1;grid-row: 1 / span 1;display: flex;justify-content: center;align-items: center;width: 2.2857em;height: 2.2857em;padding: .2143em;");
        closeLi.append(closeButton);
        var closeButtonImg = document.createElement("img");
        closeButtonImg.src = "https://gist.githack.com/ahmedayman4a/0b62b14c35a5fc9704bc108752e6664c/raw/560c941023cc6e63dc0e44fae41eaac08b587549/CloseButton.svg";
        closeButtonImg.style.width = "20px";
        closeButtonImg.style.height = "2.4em";
        closeButtonImg.id = "close-button-img";
        closeButton.append(closeButtonImg);
        closeButtonImg.onmouseover = function () {
            closeButtonImg.src = "https://gistcdn.githack.com/ahmedayman4a/e9f65e8d50567f0b17d45e088ca1aa5f/raw/40c89533a4b4ffacee7443653decde9e680f80c4/CloseButtonHover.svg";
        };
        closeButtonImg.onmouseout = function () {
            closeButtonImg.src = "https://gistcdn.githack.com/ahmedayman4a/0b62b14c35a5fc9704bc108752e6664c/raw/560c941023cc6e63dc0e44fae41eaac08b587549/CloseButton.svg";
        };
        closeButtonImg.addEventListener("click", event => {
            win.close();
        });
        return closeLi;
    }

    function createMinimizeButton() {
        var minimizeLi = document.createElement("li");
        var minimizeButton = document.createElement("div");
        minimizeButton.id = "minimize-button";
        minimizeButton.setAttribute("style", "grid-column: 2;grid-row: 1 / span 1;display: flex;justify-content: center;align-items: center; width: 2.2857em;height: 2.2857em;padding: .2143em;");
        minimizeLi.append(minimizeButton);
        var minimizeButtonImg = document.createElement("img");
        minimizeButtonImg.src = "https://gistcdn.githack.com/ahmedayman4a/074be8247cd40c0de52ec6220a8603dd/raw/1d0827511c1ff0fb8476d4e16c3cc37ef11ffd50/minimizeButton.svg";
        minimizeButtonImg.style.width = "20px";
        minimizeButtonImg.style.height = "20px";
        minimizeButtonImg.id = "minimize-button-img";
        minimizeButton.append(minimizeButtonImg);
        minimizeButtonImg.onmouseover = function () {
            minimizeButtonImg.src = "https://gistcdn.githack.com/ahmedayman4a/6da51cffdf4fd891819a20118b88fb0b/raw/17f3cf9dfd56daedc6c6ced87a0a73b4e9f9434d/minimizeButtonHover.svg";
        };
        minimizeButtonImg.onmouseout = function () {
            minimizeButtonImg.src = "https://gistcdn.githack.com/ahmedayman4a/074be8247cd40c0de52ec6220a8603dd/raw/1d0827511c1ff0fb8476d4e16c3cc37ef11ffd50/minimizeButton.svg";
        };
        minimizeButtonImg.addEventListener("click", event => {
            win.minimize();
        });
        return minimizeLi;
    }
}