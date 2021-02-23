const LANGUAGES = {
    ".js": "javascript",
    ".html": "html",
    ".xml": "xml",
    ".svg": "xml",
    ".sql": "sql"
};

const CHUNK_SIZE = 115200;

var pressedKeys = {};
window.addEventListener("keydown", (e) => pressedKeys[e.keyCode] = true);
window.addEventListener("keyup", (e) => pressedKeys[e.keyCode] = false);

const fs = require("fs");
const path = require("path");
const {ipcRenderer, dialog, remote} = require("electron");
const {Menu} = require("electron").remote;
const {SlideMessage, ConfirmWindow} = require("chennyl-ide-module/message");
