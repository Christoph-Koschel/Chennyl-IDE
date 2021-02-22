const loadFile = (tab) => {
    FileHandler.loadFileToEditor(tab.getFile(), window.codeMirror);
}

document.addEventListener("DOMContentLoaded", () => {
    let tablist = new Tabbing.Tablist(document.querySelector(".workMiddleTopBar"));

    tablist.onActiveChange((active, activeBefore) => {
        console.log(active);
        loadFile(active);
    });

    tablist.addTab(new FileTab(path.join(global.__root, "titlebar.js"), tablist));
    tablist.addTab(new FileTab(path.join(global.__root, "main.js"), tablist));

    tablist.setActive(0);
});