const {BrowserWindow, app, nativeTheme} = require("electron");
// Darwin == MacOs
const fs = require("fs");
const path = require("path");

global.__root = __dirname;


app.on("ready", () => {
    const windowOptions = JSON.parse(fs.readFileSync(__root + "\\ui\\window.json", "utf8"));
    console.log(windowOptions);
    let win = new BrowserWindow({
        width: windowOptions.width,
        height: windowOptions.height,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: __root + "\\titlebar.js",
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadFile(__root + "\\ui\\index.html").then(() => {
        if (process.argv[2] === "-d") {
            win.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });
});
