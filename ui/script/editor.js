document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById("editorContainer");
    const codeMirror = CodeMirror(editor, {
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        theme: "darcula",
        styleActiveLine: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
        },
        autoHint: true,
    });
    codeMirror.setSize("100%", "100%", true);

    /* .on("keyup", (cm, event) => {
        if(!cm.state.completionActive && event.keyCode !== 13 && event.keyCode !== 27) {
            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
        }
    }); */

    window.codeMirror = codeMirror;
});