const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('controls', {
  minimize: () => { ipcRenderer.invoke("minimize")},
  maximize: () => {ipcRenderer.invoke("maximize")},
  close: () => {ipcRenderer.invoke("close")},
  // we can also expose variables, not just functions
})