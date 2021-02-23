class Tab {
    constructor(name, file, click, close) {
        this.name = name;
        this.file = file;
        this.click = click;
        this.close = close;
        this.unsaved = false;

        this.closeButton = document.createElement("span");
        this.closeButton.classList.add("closeButton");
        this.closeButton.innerHTML = "&#10005;";
        this.closeButton.addEventListener("click", close);

        this.nameElement = document.createElement("span");
        this.nameElement.classList.add("name");
        this.nameElement.innerText = this.name;

        this.dom = document.createElement("li");
        this.dom.addEventListener("click", click);

        this.dom.appendChild(this.nameElement);
        this.dom.appendChild(this.closeButton);
    }

    setClick(click) {
        this.dom.removeEventListener("click", this.click)
        this.click = click;
        this.dom.addEventListener("click", this.click)
    }

    setClose(close) {
        this.closeButton.removeEventListener("click", this.close)
        this.close = close;
        this.closeButton.addEventListener("click", this.close)
    }

    getDOM() {
        return this.dom;
    }

    getFile() {
        return this.file;
    }

    getNameElement() {
        return this.nameElement;
    }

    getName() {
        return this.name;
    }

    setUnsaved(unsaved) {
        this.unsaved = unsaved;
        this._checkUnsaved();
    }

    getUnsaved() {
        return this.unsaved;
    }

    _checkUnsaved() {
        if (this.unsaved) {
            this.nameElement.innerText = `*${this.name}`;
        } else {
            this.nameElement.innerText = this.name;
        }
    }

    setFile(file) {
        this.file = file;
    }

    setFile(name) {
        this.name = name;
    }
}

class FileTab extends Tab {
    constructor(file, tablist) {
        super(path.parse(file).base, file, null, null);
        this.dom.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                tablist.setActive(this);
            } else if (e.button === 1) {
                this._remove(tablist);
            } else if (e.button === 2) {
                console.log("context menu");
            }
            // TDOO context menu
        });
        this.closeButton.addEventListener("mousedown", (e) => {
            if (e.button === 0)
                this._remove(tablist);
        });
    }

    _remove(tablist) {
        if (this.unsaved) {
            const result = dialog.showMessageBox(null, {
                type: 'question',
                buttons: ['Yes', 'No', 'Cancel'],
                defaultId: 0,
                title: 'Unsaved Changes',
                message: 'The file has unsaved changes!',
                detail: 'Do you want to save the file?'
            });
            console.log(result);
            return;
        }
        tablist.removeTab(this);
    }
}

class Tablist {
    constructor(root,...tabs) {
        this.root = root;
        this.tabs = tabs;

        this.dom = document.createElement("ul");
        this.tabs.forEach(tab => {
            this.dom.appendChild(tab);
        });
        this.root.appendChild(this.dom);

        this.lastActive = 0;
        this.active = 0;

        this.activeChangeListeners = [];

        this.update();
    }

    addTab(...tabs) {
        this.tabs.push(...tabs);
        this.active = this.tabs.length - 1;
        this.update();
    }

    removeTab(...tabs) {
        tabs.forEach(tab => {
            let index = this.tabs.indexOf(tab);
            delete this.tabs[index];
            if (index === this.active && this.tabs.length > 0) {
                if (index > 0) {
                    this.active = index - 1;
                } else if (index < this.tabs.length - 2) {
                    this.active = index + 1;
                } else {
                    this.active = -1;
                }
            }
        });
        this.update();
    }

    setActive(tab) {
        if (typeof (tab) === "number") {
            this.active = tab;
        } else {
            this.active = this.tabs.indexOf(tab);
        }
        this.update();
    }

    getActiveIndex() {
        return this.active;
    }

    getActive() {
        return this.tabs[this.active];
    }

    onActiveChange(listener) {
        this.activeChangeListeners.push(listener);
        if (this.tabs.length > 0)
            listener(this.tabs[this.active], this.tabs[this.lastActive]);
        return {
            unsubscribe: () => {
                delete this.activeChangeListeners[this.activeChangeListeners.indexOf(listener)];
            }
        }
    }

    update() {
        this.dom.innerHTML = "";
        if (this.lastActive !== this.active && this.tabs.length > 0) {
            this.lastActive = this.active;
            this.activeChangeListeners.forEach(listener => listener(this.tabs[this.active], this.tabs[this.lastActive]));
        }
        this.tabs.forEach(tab => {
            if (tab === this.tabs[this.active])
                tab.getDOM().classList.add("active")
            else
                tab.getDOM().classList.remove("active");
            this.dom.appendChild(tab.getDOM());
        });
    }
}

const Tabbing = {
    Tab,
    FileTab,
    Tablist,
};

module.exports = Tabbing;
