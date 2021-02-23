const {ConfirmWindow, SlideMessage} = require("chennyl-ide-module/message");
const {ipcMain, BrowserWindow} = require("electron");


SlideMessage.on("message", (event, args) => {
    console.log("new slide message");
    win.webContents.send("slideMessage", args);
});


const extWin = [];

ConfirmWindow.on("message", (event) => {
    console.log("new confirm message");
    let winID = extWin.length;
    extWin.push({
        window: new BrowserWindow({
            width: 350,
            height: 150,
            closable: false,
            frame: false,
            parent: win,
            resizable: false,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        }),
        event: event
    });
    const searchParams = new URLSearchParams();
    searchParams.set("id",winID.toString());
    searchParams.set("message", event.message);
    searchParams.set("type", event.type);

    extWin[winID].window.loadFile(path.join(__root, "confirm", "index.html"), {
        search: searchParams.toString()
    }).then(() => {
        if (process.argv[2] === "-d") {
            extWin[winID].window.webContents.openDevTools({
                mode: "undocked"
            });
        }
    });
});

ipcMain.on("close-confirm",(event, args) => {
    let currentWin = extWin[args.id];
    currentWin.event.emit("change",{
        status: args.status,
        message: currentWin.event.message,
        type: currentWin.event.type
    });
    currentWin.window.setClosable(true);
    currentWin.window.close();
    delete extWin[args.id];
});

