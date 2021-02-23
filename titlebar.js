const fs = require("fs");
const {remote} = require("electron");
const {Menu, MenuItem} = remote;
const {Color, Themebar, Titlebar} = require('custom-electron-titlebar');

global.__root = __dirname;
global.path = require("path");

const windowOptions = JSON.parse(fs.readFileSync(path.join(__root, "ui", "window.json"), "utf8"));
const menu = new Menu();

menu.append(new MenuItem({
    label: "New",
    submenu: [
        {
            label: "Project"
        }
    ]
}));
menu.append(new MenuItem({
    label: "File",
    submenu: [
        {
            label: "Open",
            click: () => ipcRenderer.send("titlebar-button", "open")
        }
    ]
}));

window.addEventListener('DOMContentLoaded', () => {
    console.log(path.join(__root, "ui", "assets", "icon", "icon.svg"));
    let titlebar = new Titlebar({
        backgroundColor: Color.fromHex(windowOptions.titlebar.background),
        iconsTheme: (process.platform === "darwin") ? Themebar.mac : Themebar.win,
        icon: "./assets/icon/icon.svg"
    });
    titlebar.updateMenu(menu);
});
