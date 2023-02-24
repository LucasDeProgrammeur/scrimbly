
const sqlite3 = require('sqlite3');
const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const defaultData = { notes: [] };
// let remote = require("electron").remote;
// let dialog = remote.require("electron").dialog;
const DataHandler = require("./DataHandler.js");
// let db = new sqlite3.Database(":memory:");


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
      // let currentData = JSON.parse(
      //   localStorage.getItem("data") || `{"notes": []}`
      // );

      // currentData.notes = currentData.notes.filter(
      //   (note) => text.notes.findIndex((e) => e.name === note.name) === -1
      // );
      // localStorage.setItem(
      //   "data",
      //   JSON.stringify({ notes: [...text.notes, ...currentData.notes] })
      // );
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

contextBridge.exposeInMainWorld("dbConnection", {
  // initialize: async () => {
  //   await db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
  //     console.log("DB message: " + callback?.message);
  //   });
  // },
  insert: (name, value) => {
      return ipcRenderer.invoke("insert", [name, value]);
  },
  // view: () => {
  //     db.each("SELECT * FROM notes", (err, row) => {
  //       if(row) {
  //         console.log(row);
  //       }
  //       if (err) {
  //         console.log(err);
  //       }
  //     });
  // },
  // drop: async () => {
  //   await db.run("DROP TABLE IF EXISTS notes");
  // },
  // alter: () => {
  //   db.run()
  // },
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