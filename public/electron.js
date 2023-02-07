const path = require("path");
const sqlite3 = require('sqlite3');

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
let db = new sqlite3.Database("./scrimblydb.db");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.ts')
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize();
})

ipcMain.handle('maximize', () => {
  BrowserWindow.getFocusedWindow().maximize();
})

ipcMain.handle('close', () => {
  BrowserWindow.getFocusedWindow().close();
})

ipcMain.handle('restore', () => {
  BrowserWindow.getFocusedWindow().restore();
})

ipcMain.handle('isMaximized', () => {
  return BrowserWindow.getFocusedWindow().isMaximized();
})

ipcMain.handle('updateName', (e, args) => {
  let newNoteName = args[0];
  let oldNoteName = args[1];
  db.run(`UPDATE notes SET noteName = '${newNoteName}' WHERE noteName = '${oldNoteName}'`);
})

ipcMain.handle('getAll', () => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
    console.log(callback);
  });

  return new Promise((resolve, reject) => {
    db.all("SELECT noteName, noteHTML FROM notes", (err, data) => {
      if (err) {
        reject(err);
      }
     resolve(data);
    });
  })
  

});

ipcMain.handle('getAllNoteNames', () => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
    console.log(callback);
  });

  return new Promise((resolve, reject) => {
    db.all("SELECT id, noteName FROM notes", (err, data) => {
      if (err) {
        reject(err);
      }
     resolve(data);
    });
  })
  

});

ipcMain.handle("clearDb", () => {
  db.run("DELETE FROM notes");
})


ipcMain.handle('getOneByName', (e, args) => {
  let noteName = args[0];
  console.log("GET ONE BY NAME");
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
    console.log(callback);
  });

  return new Promise((resolve, reject) => {
    db.get(`SELECT noteName, noteHTML FROM notes WHERE noteName = '${noteName}'`, (err, data) => {
      if (err) {
        
        reject(err);
      }
      console.log(data);
     resolve(data);
    });
  })
  

});

ipcMain.handle("saveOne", (e, args) => {
  let noteName = args[0];
  let noteHTML = args[1];
  return new Promise((resolve, reject) => {
    db.exec(`UPDATE notes SET noteHTML = '${noteHTML}' WHERE noteName = '${noteName}'`, (err) => {
      if (err) {
        reject(err);
      }
    })
    resolve();

  })
  
})

ipcMain.handle("deleteOneByName", (e, args) => {
  let noteName = args[0];
  db.run(`DELETE FROM notes WHERE noteName = '${noteName}'`);
})

ipcMain.handle("insert", (e, args) => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
    console.log(callback);
  });
  let queryString = `INSERT INTO notes (noteName, noteHTML) VALUES ('${args[0]}', '${args[1]}')`;
  console.log(queryString);
  db.exec(queryString, (callback) => {
    console.log(callback);
  });
});



ipcMain.handle('fileOpenExport', () => {
  return dialog.showOpenDialog({properties: ['openDirectory']});
})

ipcMain.handle('fileOpenImport', () => {
  return dialog.showOpenDialog({properties: ['openFile']});
})


app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
