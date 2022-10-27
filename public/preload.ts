const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const defaultData = { notes: [] };
// let remote = require("electron").remote;
// let dialog = remote.require("electron").dialog;

contextBridge.exposeInMainWorld("controls", {
  minimize: () => {
    ipcRenderer.invoke("minimize");
  },
  maximize: () => {
    ipcRenderer.invoke("maximize");
  },
  close: () => {
    ipcRenderer.invoke("close");
  },
  restore: () => {
    ipcRenderer.invoke("restore");
  },
  export: async () => {
    let date = new Date();
    let path = await ipcRenderer.invoke("fileOpenExport");
    fs.writeFileSync(
      path.filePaths[0] + `\\export-${date.getTime().toString()}.txt`,
      localStorage.getItem("data") || JSON.stringify(defaultData)
    );
  },
  import: async () => {
    let path = await ipcRenderer.invoke("fileOpenImport");

    try {
      let text = JSON.parse(fs.readFileSync(path.filePaths[0]));
      let currentData = JSON.parse(
        localStorage.getItem("data") || `{"notes": []}`
      );

      currentData.notes = currentData.notes.filter(
        (note) => text.notes.findIndex((e) => e.name === note.name) === -1
      );
      localStorage.setItem(
        "data",
        JSON.stringify({ notes: [...text.notes, ...currentData.notes] })
      );
    } catch (e) {
      console.log(e);
      alert("Unable to import this file.");
    }
  },
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("controlsProperties", {
  isMaximized: async () => {
    return await ipcRenderer.invoke("isMaximized");
  },
});
