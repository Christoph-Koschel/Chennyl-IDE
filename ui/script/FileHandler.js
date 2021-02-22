const fs = require("fs");

const loadFileToEditor = (file, editor) => {
    // editor.innerHTML = fs.readFileSync(file);
    fs.readFile(file, (err, data) => {
        if(err) throw err;
        editor.setValue(data.toString());
    })
    // editor.setValue(fs.readFileSync(file));
}

const preloadFile = (file, tablist) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(err);
            return resolve(data.toString(), new FileTab(file, tablist));
        });
    });
}

const FileHandler = {
    loadFileToEditor,
    preloadFile
};

module.exports = FileHandler;