const {BrowserWindow, app} = require("electron");
const {SlideMessage} = require("chennyl-ide-module/message");
// Darwin == MacOs
const fs = require("fs");

global.__root = __dirname;
global.path = require("path");

app.on("ready", () => {
    const windowOptions = JSON.parse(fs.readFileSync(path.join(__root, "ui", "window.json"), "utf8"));
    console.log(windowOptions);
    let win = new BrowserWindow({
        width: windowOptions.width,
        height: windowOptions.height,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__root, "titlebar.js"),
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadFile(path.join(__root, "ui", "index.html")).then(() => {
        if (process.argv[2] === "-d") {
            win.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });

    SlideMessage.on("message", (event, args) => {
        console.log("new Message");
        win.webContents.send("slideMessage", args);
    });
});

setTimeout(() => {
    const message = new SlideMessage("Hallo wie gehts","info");
    message.show();
},5*1000);
