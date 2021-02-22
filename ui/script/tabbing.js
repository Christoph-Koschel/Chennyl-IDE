const path = require('path');

class Tab {
    constructor(name, file, click, close) {
        this.name = name;
        this.file = file;
        this.click = click;
        this.close = close;

        this.closeButton = document.createElement("span");
        this.closeButton.innerHTML = "&#10005;";
        this.closeButton.addEventListener("click", close);

        this.dom = document.createElement("li");
        this.dom.innerText = this.name;
        this.dom.addEventListener("click", click);

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

    getName() {
        return this.name;
    }

    updateFile(file) {
        this.file = file;
    }

    updateName(name) {
        this.name = name;
    }
}

class FileTab extends Tab {
    constructor(file, tablist) {
        super(path.parse(file).base, file, null, null);
        this.dom.addEventListener("mousedown", (e) => {
            if(e.button === 0)
                tablist.setActive(this);
            else if(e.button === 1)
                tablist.removeTab(this);
            else if(e.button === 2)
                console.log("context menu");
                // TDOO context menu
        });
        this.closeButton.addEventListener("mousedown", (e) => {
            if(e.button === 0)
                tablist.removeTab(this);
        });
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
        this.update();
    }

    removeTab(...tabs) {
        tabs.forEach(tab => {
            let index = this.tabs.indexOf(tab);
            delete this.tabs[index];
            if(index === this.active && this.tabs.length > 0)
                if(index > 0) {
                    this.active--;
                } else if(index < this.tabs.length - 2) {
                    this.active++;
                } else {
                    this.active = -1;
                }
        });
        this.update();
    }

    setActive(tab) {
        if(typeof(tab) === "number") {
            this.active = tab;
        } else {
            this.active = this.tabs.indexOf(tab);
        }
        this.update();
    }

    onActiveChange(listener) {
        this.activeChangeListeners.push(listener);
        return {
            unsubscribe: () => {
                delete this.activeChangeListeners[this.activeChangeListeners.indexOf(listener)];
            }
        }
    }

    update() {
        this.dom.innerHTML = "";
        if(this.lastActive !== this.active) {
            this.activeChangeListeners.forEach(listener => listener(this.tabs[this.active], this.tabs[this.lastActive]));
            this.lastActive = this.active;
        }
        this.tabs.forEach(tab => {
            if(tab === this.tabs[this.active])
                tab.getDOM().classList.add("active")
            else
                tab.getDOM().classList.remove("active");
            this.dom.appendChild(tab.getDOM());
        });
    }

    setActive(active) {
        this.active = active;
        this.update();
    }
}

const Tabbing = {
    Tab,
    FileTab,
    Tablist,
};

module.exports = Tabbing;