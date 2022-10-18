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
    let path = await ipcRenderer.invoke("fileOpenExport");
    fs.writeFileSync(
      path.filePaths[0] + "\\export.txt",
      localStorage.getItem("data") || JSON.stringify(defaultData)
    );
  },
  import: async () => {
    let path = await ipcRenderer.invoke("fileOpenImport")
    let text = fs.readFileSync(path.filePaths[0])
    localStorage.setItem("data", text)
  }
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("controlsProperties", {
  isMaximized: async () => {
   return awaitipcRenderer.invoke("isMaximized");
  }
})
