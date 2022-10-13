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
  export: async () => {
    let path = await ipcRenderer.invoke("fileOpen");
    console.log(path.filePaths[0])
    fs.writeFileSync(
      path.filePaths[0] + "\\export.txt",
      localStorage.getItem("data") || JSON.stringify(defaultData)
    );
  },
  // we can also expose variables, not just functions
});
