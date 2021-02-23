window.addEventListener("load",() => {
    ipcRenderer.on("slideMessage",(event, args) => {
        const div = document.createElement("div");
        div.classList.add("messageNotification");

        const p = document.createElement("p");
        p.innerHTML = args.message;

        const a = document.createElement("a");
        a.addEventListener("click",function () {
            const parent = this.parentElement;
            parent.remove();
        });
        a.innerHTML = "Close";

        div.appendChild(p);
        div.appendChild(a);
        document.body.appendChild(div);
    });
});
