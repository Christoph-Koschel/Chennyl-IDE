const {ipcRenderer} = require("electron");

window.addEventListener("load", () => {
    const searchParams = new URLSearchParams(window.location.search);
    document.getElementById("text").innerHTML = searchParams.get("message");
    document.getElementById("yes").addEventListener("click", () => {
        ipcRenderer.send("close-confirm", {
            id: searchParams.get("id"),
            status: 1
        });
    });

    document.getElementById("no").addEventListener("click", () => {
        ipcRenderer.send("close-confirm", {
            id: searchParams.get("id"),
            status: 0
        });
    });
});
