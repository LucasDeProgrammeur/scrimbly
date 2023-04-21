const sqlite3 = require('sqlite3');


class DataHandler {
  
    constructor () {
        this.db = new sqlite3.Database("./scrimblydb.db");
    }

    getAll () {
        this.db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
          });
        
          return new Promise((resolve, reject) => {
            this.db.all("SELECT noteName, noteHTML FROM notes", (err, data) => {
              if (err) {
                reject(err);
              }
             resolve(data);
            });
          })
    }

    updateName(newNoteName, oldNoteName) {
      this.db.run(`UPDATE notes SET noteName = '${newNoteName}' WHERE noteName = '${oldNoteName}'`);
    }

    getAllNoteNames() {
      this.db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
      });

      return new Promise((resolve, reject) => {
        this.db.all("SELECT id, noteName FROM notes", (err, data) => {
          if (err) {
            reject(err);
          }
         resolve(data.map(e => e["noteName"]));
         
        });
      })
    }

    clearDb() {
      this.db.run("DELETE FROM notes");
    }

    getOneByName(noteName) {
      this.db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {
      });
    
      return new Promise((resolve, reject) => {
        this.db.get(`SELECT noteName, noteHTML FROM notes WHERE noteName = '${noteName}'`, (err, data) => {
          if (err) {
            
            reject(err);
          }

         resolve(data);
        });
      })
      
    }

    saveOne(noteName, noteHTML) {
      return new Promise((resolve, reject) => {
        this.db.exec(`UPDATE notes SET noteHTML = '${noteHTML}' WHERE noteName = '${noteName}'`, (err) => {
          if (err) {
            reject(err);
          }
        })
        resolve();
    
      })
    }

    deleteOneByName(noteName) {
      this.db.run(`DELETE FROM notes WHERE noteName = '${noteName}'`);
    }

    insert(noteName, noteHTML) {
      this.db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)", (callback) => {

      });
      let queryString = `INSERT INTO notes (noteName, noteHTML) VALUES ('${noteName}', '${noteHTML}')`;
      
      this.db.exec(queryString);
    }
    
    closeDb () {
      this.db.close();
    }
    
}

module.exports = DataHandler;