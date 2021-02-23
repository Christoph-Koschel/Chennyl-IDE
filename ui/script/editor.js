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
        lineWrapping: true,
    });

    codeMirror.setSize("100%", "100%");

    window.codeMirror = codeMirror;
});