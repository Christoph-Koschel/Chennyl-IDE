const {BrowserWindow, app, ipcMain, dialog} = require("electron");
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
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
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

    /* win.webContents.on("dom-ready", () => {
        win.webContents.send("open-file", [ path.join(__root, "titlebar.js"), path.join(__root, "main.js") ]);
    }) */

    ipcMain.on("titlebar-button", (event, args) => {
        // win.webContents.send("titlebar-button", args);
        if(args === "open") {
            dialog.showOpenDialog({ properties: ['openFile'] })
                .then(result => {
                    win.webContents.send("open-file", result.filePaths);
                });
        }
    });

    SlideMessage.on("message", (event, args) => {
        console.log("new Message");
        win.webContents.send("slideMessage", args);
    });
});
