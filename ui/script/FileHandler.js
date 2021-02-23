const loadFileToEditor = (file, editor) => {
    document.getElementById("editorContainer").classList.remove("hide");
    editor.setOption("mode", LANGUAGES[path.extname(file)]);

    editor.setValue("");

    let readStream = fs.createReadStream(file, {
        flag: 'r',
        highWaterMark: CHUNK_SIZE,
    });

    readStream.on("data", (chunk) => {
        let buffer = Buffer.from(chunk);
        editor.setValue(editor.getValue() + buffer.toString(fs.statSync(file).encoding));
    });

    readStream = null;
}

const resetEditor = (editor) => {
    editor.setValue("");
    document.getElementById("editorContainer").classList.add("hide");
}

const saveFile = (file, editor) => {
    return new Promise((resolve, reject) => {

        if(!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
            fs.writeFileSync(file, "");
        }

        let writer = fs.createWriteStream(file, {
            flag: 'w',
            highWaterMark: CHUNK_SIZE,
        });

        writer.on("close", () => {
            resolve();
        });

        writer.on("error", (err) => {
            reject(err);
        })

        writer.write(editor.getValue());

        writer.close();
    });
}

class FileTree {
    constructor(path, name = null) {
        this.path = path;
        this.name = name;
        this.items = [];
    }

    build = () => {
        this.items = FileTree.readDir(this.path);
    }

    renderUnorderedList = (callback) => {
        return FileTree.renderUnorderedList(this.items, callback);
    }

    static renderUnorderedList(files, callback) {
        var ulElement = document.createElement("ol");

        files.map((file, i) => {
            var liElement = document.createElement("li");

            var spanElement = document.createElement("span");
            spanElement.classList.add("file-span");
            spanElement.classList.add("noSelect");
            spanElement.setAttribute("data-filePath", file.path);

            spanElement.addEventListener("click", () => {
                var allSpans = document.querySelectorAll(".file-span");
                allSpans.forEach(span => {
                    if (span === spanElement) {
                        span.classList.add("active");
                    } else if (!pressedKeys[17]) {
                        span.classList.remove("active");
                    }
                });
            });

            var expandButton = document.createElement("i");
            expandButton.classList.add("expand-button");
            expandButton.classList.add("fas");
            expandButton.classList.add("fa-chevron-down");
            expandButton.style.color = "#eeeeee";
            /* expandButton.addEventListener("click", () => {
                console.log("expand");
            }); */
            // expandButton.setAttribute("", "");

            liElement.appendChild(spanElement);

            spanElement.innerHTML = `<span>${file.name}</span>`;
            if (file.items.length > 0 || fs.statSync(file.path).isDirectory()) {
                spanElement.innerHTML = `${expandButton.outerHTML}<i class="fas fa-folder"></i>${liElement.innerHTML}`;

                var nextPart =  FileTree.renderUnorderedList(file.items, callback);

                spanElement.addEventListener("dblclick", () => {
                    console.log("expanding");
                    nextPart.classList.toggle("hide");
                    if(nextPart.classList.contains("hide")) {
                        spanElement.querySelector(".expand-button").className =
                            spanElement.querySelector(".expand-button").className.replace("down", "right");
                    } else {
                        spanElement.querySelector(".expand-button").className =
                            spanElement.querySelector(".expand-button").className.replace("right", "down");
                    }
                });

                spanElement.addEventListener("contextmenu", (e) => {
                    const menu = Menu.buildFromTemplate([
                        {
                            label: 'New',
                            submenu: [
                                {
                                    label: "File",
                                    click: () => console.log("creating new file") // TODO Create file
                                },
                                {
                                    label: "Directory",
                                    click: () => console.log("creating directory") // TODO Create directory
                                }
                            ]
                        },
                        {
                            label: "Delete",
                            click: () => {
                                fs.rmdirSync(file.path, { recursive: true });
                            }
                        }
                    ]);
                    menu.popup({
                        window: remote.getCurrentWindow(),
                        x: e.pageX,
                        y: e.pageY,
                    });
                });

                liElement.appendChild(nextPart);
            } else {
                spanElement.addEventListener("dblclick", () => {
                    console.log("opening file");
                    callback(file.path, file.name);
                });
                spanElement.innerHTML = `<i class="fas fa-file"></i>${liElement.innerHTML}`
            }

            ulElement.appendChild(liElement);
        });
        return ulElement;
    }


    static readDir(pathToRead) {
        var fileArray = [];

        fs.readdirSync(pathToRead).forEach(file => {
            var fileInfo = new FileTree(path.join(pathToRead, file), path.parse(file).base);

            var stat = fs.statSync(fileInfo.path);

            if (stat.isDirectory()) {
                fileInfo.items = FileTree.readDir(fileInfo.path);
            }

            fileArray.push(fileInfo);
        });
        return fileArray;
    }
}

const FileHandler = {
    loadFileToEditor,
    FileTree,
};

const buildFileTree = (tree, tablist, root) => {
    root.innerHTML = "";
    tree.build();

    let mainFileList = tree.renderUnorderedList((path, name) => {
        let tab = new FileTab(path, tablist);
        tablist.addTab(tab);
    });
    mainFileList.classList.add("mainUl");

    root.appendChild(mainFileList);
}

document.addEventListener("DOMContentLoaded", () => {
    resetEditor(window.codeMirror);

    const tablist = new Tabbing.Tablist(document.querySelector(".workMiddleTopBar"));

    tablist.onActiveChange((active, lastActive) => {
        if(active) {
            loadFileToEditor(active.getFile(), window.codeMirror);
        } else {
            resetEditor(window.codeMirror);
        }
    });

    ipcRenderer.on("open-file", (event, args) => {
        args.forEach(file => {
            let tab = new Tabbing.FileTab(file, tablist);
            tablist.addTab(tab);
        });
    });

    window.codeMirror.on("keydown", (cm, event) => {
        if(event.ctrlKey) {
            if(event.keyCode === 83) {
                saveFile(tablist.getActive().getFile(), window.codeMirror)
                    .then(() => {
                        tablist.getActive().setUnsaved(false);
                    })
                    .catch((err) => {
                        SlideMessage(err.toString(), "error");
                    });
            }
            return;
        }

        if(fs.readFileSync(tablist.getActive().getFile()) !== window.codeMirror.getValue()) {
            tablist.getActive().setUnsaved(true);
        } else {
            tablist.getActive().setUnsaved(false);
        }
    });

    var fileTree = new FileTree("C:\\Users\\matte\\Downloads\\V1.0.0");
    buildFileTree(fileTree, tablist, document.getElementById("leftSideBar"));
});

module.exports = FileHandler;