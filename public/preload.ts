
const sqlite3 = require('sqlite3');
const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const defaultData = { notes: [] };
const DataHandler = require("./DataHandler.js");

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
    let exportText = await ipcRenderer.invoke("getAll");
    fs.writeFileSync(
      path.filePaths[0] + `\\export-${date.getTime().toString()}.txt`,
  
      JSON.stringify(exportText)
    );
  },
  import: async () => {
    let path = await ipcRenderer.invoke("fileOpenImport");

    try {
     
      let importData = await JSON.parse(fs.readFileSync(path.filePaths[0]));
      importData.map((e) => {
        ipcRenderer.invoke("insert", [e.noteName, e.noteHTML]);
      })
    } catch (e) {
      console.log(e);
      alert("Unable to import this file.");
    }
  },
});

contextBridge.exposeInMainWorld("controlsProperties", {
  isMaximized: async () => {
    return await ipcRenderer.invoke("isMaximized");
  },
});

contextBridge.exposeInMainWorld("dbConnection", {
  insert: (name, value) => {
      return ipcRenderer.invoke("insert", [name, value]);
  },
  getAll: () => {
    return ipcRenderer.invoke("getAll");
  },
  getAllNoteNames: () => {
    return ipcRenderer.invoke("getAllNoteNames");
  },
  getOneByName: (noteName) => {
    return ipcRenderer.invoke("getOneByName", [noteName]);
  },
  clearDb: () => {
    return ipcRenderer.invoke("clearDb");
  },
  updateName: (newNoteName, oldNoteName) => {
    return ipcRenderer.invoke("updateName", [newNoteName, oldNoteName]);
  },
  deleteOneByName: (noteName) => {
    ipcRenderer.invoke("deleteOneByName", [noteName]);
  },
  saveOne: (noteName, noteHTML) => {
    return ipcRenderer.invoke("saveOne", [noteName, noteHTML])
  }
});