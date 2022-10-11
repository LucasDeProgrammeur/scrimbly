import { ipcRenderer} from "electron";

const closeApp = () => {
    ipcRenderer.send("closeApp")
}

export default closeApp;