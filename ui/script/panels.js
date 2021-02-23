function updateEditorSize() {
    // region resize height
    let winHeight = window.innerHeight;

    const workHeader = document.getElementsByClassName("workHeader")[0];
    const workHeaderStyle = window.getComputedStyle(workHeader);
    let workHeaderHeight = parseFloat(workHeaderStyle.height);
    workHeaderHeight += parseFloat(workHeaderStyle.marginTop);
    workHeaderHeight += parseFloat(workHeaderStyle.marginBottom);
    workHeaderHeight += parseFloat(workHeaderStyle.paddingTop);
    workHeaderHeight += parseFloat(workHeaderStyle.paddingBottom);

    const titleBar = document.getElementsByClassName("titlebar")[0];
    let titleBarHeight = parseFloat(titleBar.style.height);

    const tabBar = document.getElementsByClassName("editorNavbar")[0];
    const tabBarStyle = window.getComputedStyle(tabBar);
    let tabBarHeight = parseFloat(tabBarStyle.height);
    tabBarHeight += parseFloat(tabBarStyle.marginTop);
    tabBarHeight += parseFloat(tabBarStyle.marginBottom);
    tabBarHeight += parseFloat(tabBarStyle.paddingTop);
    tabBarHeight += parseFloat(tabBarStyle.paddingBottom);

    const editorHeight = winHeight - workHeaderHeight - tabBarHeight - titleBarHeight;
    //endregion

    // region resize with
    const winWidth = window.innerWidth;

    const siteBar = document.getElementsByClassName("workSiteBar")[0];
    const siteBarStyle = window.getComputedStyle(siteBar);
    let siteBarWidth = parseFloat(siteBarStyle.width);
    siteBarWidth += parseFloat(siteBarStyle.marginLeft);
    siteBarWidth += parseFloat(siteBarStyle.marginRight);
    siteBarWidth += parseFloat(siteBarStyle.paddingLeft);
    siteBarWidth += parseFloat(siteBarStyle.paddingRight);

    let siteMenuWith = (SiteMenu.isHide()) ? 0 : (() => {
        const siteMenu = document.getElementsByClassName("workLeft")[0];
        const siteMenuStyle = window.getComputedStyle(siteMenu);
        let siteMenuWith = parseFloat(siteMenuStyle.width);
        siteMenuWith += parseFloat(siteMenuStyle.paddingLeft);
        siteMenuWith += parseFloat(siteMenuStyle.paddingRight);
        siteMenuWith += parseFloat(siteMenuStyle.marginLeft);
        return siteMenuWith + parseFloat(siteMenuStyle.marginRight);
    })();

    const editorWith = winWidth - siteBarWidth - siteMenuWith;
    // endregion

    document.getElementsByClassName("CodeMirror-scroll")[0].style.minHeight = editorHeight.toString() + "px";
    document.getElementsByClassName("CodeMirror-scroll")[0].style.minWidth = editorWith.toString() + "px";
    window.codeMirror.setSize(editorWith.toString() + "px", editorHeight.toString() + "px");
}

class SiteMenu {
    static __init__() {
        if (document.getElementsByClassName("workLeft")[0] === undefined) {
            throw new Error("Can not init before DOM content loaded");
        } else {
            this.menu = document.getElementsByClassName("workLeft")[0];
        }

        if (document.getElementsByClassName("workMiddle")[0] === undefined) {
            throw new Error("Can not init before DOM content loaded");
        } else {
            this.writer = document.getElementsByClassName("workMiddle")[0];
        }
    }

    static open() {
        if (this.menu === undefined || this.writer === undefined) {
            SiteMenu.__init__();
        }

        this.menu.style.display = "unset";
        this.writer.style.marginLeft = "0";
        updateEditorSize();
        this.hide = false;
    }

    static close() {
        if (this.menu === undefined || this.writer === undefined) {
            SiteMenu.__init__();
        }

        this.menu.style.display = "none";
        this.writer.style.marginLeft = "-250px";
        updateEditorSize();
        this.hide = true;
    }

    static isHide() {
        return (this.hide) ? this.hide : false;
    }
}

window.addEventListener("load", () => {
    window.addEventListener("resize", updateEditorSize);

    document.getElementsByClassName("siteBarLink")[0].addEventListener("click", function () {
        console.log(SiteMenu.isHide());
        if (SiteMenu.isHide()) {
            SiteMenu.open();
            this.classList.add("active");
        } else {

            SiteMenu.close();
            this.classList.remove("active");
        }
    });

    (() => {
        document.getElementsByClassName("window-close-bg")[0].remove();
        let div1 = document.createElement("div");
        div1.classList.add("window-close-bg");
        div1.classList.add("window-icon-bg");
        div1.title = "Close";

        let div2 = document.createElement("div");
        div2.classList.add("window-icon");
        div2.classList.add("window-close");
        div2.addEventListener("click", () => {
            document.getElementById("closeButton").click();
        });
        div1.appendChild(div2);
        document.getElementsByClassName("window-controls-container")[0].appendChild(div1);
    })()

    document.getElementById('closeButton').addEventListener('click', () => {
        remote.getCurrentWindow().close();
    });

    updateEditorSize();
});


