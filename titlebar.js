const fs = require("fs");
const {Color, Themebar, Titlebar} = require('custom-electron-titlebar');

global.__root = __dirname;

const windowOptions = JSON.parse(fs.readFileSync(__root + "\\ui\\window.json", "utf8"));

window.addEventListener('DOMContentLoaded', () => {
    let titlebar = new Titlebar({
        backgroundColor: Color.fromHex(windowOptions.titlebar.background),
        iconsTheme: (process.platform === "darwin") ? Themebar.mac : Themebar.win
    });

    titlebar.updateTitle("");
    titlebar.updateMenu(null);
});
