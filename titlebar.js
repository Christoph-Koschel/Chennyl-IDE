const fs = require("fs");
const {Menu, MenuItem} = require("electron").remote;
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
        },
        {
            label: "File"
        },
        {
            label: "Directory"
        }
    ]
}));
menu.append(new MenuItem({
    label: "File",
    submenu: [
        {
            label: "Open"
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
