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

    setTimeout(() => {
        console.log("send message ...");
        let message = new ConfirmWindow("hallo", "info");
        message.on("change",(event) => {
            console.log(event.status);
            console.log(event.status === ConfirmWindow.YES);
        });
        message.show();
        console.log("sended")
    },5*1000);
});
