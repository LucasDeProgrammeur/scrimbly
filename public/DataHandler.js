

class DataHandler {
  constructor() {
    this.db = require('better-sqlite3')('scrimblydb.db', {});
  }

   getAll() {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)',
      (callback) => {},
    )


    return new Promise((resolve, reject) => {
      let stmt = this.db.prepare('SELECT noteName, noteHTML FROM notes')
      resolve(stmt.all());
    })
  }

   updateName(newNoteName, oldNoteName) {
    let stmt = this.db.prepare(
      `UPDATE notes SET noteName = ? WHERE noteName = ?`
    )

    stmt.run([newNoteName, oldNoteName])
  }

  getAllNoteNames() {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)',
      (callback) => {},
    )

    return new Promise((resolve, reject) => {
      let stmt = this.db.prepare('SELECT id, noteName FROM notes')
      resolve(stmt.all().map(e => e.noteName));
    })
  }

   clearDb() {
    this.db.run('DELETE FROM notes')
  }

  getOneByName(noteName) {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)'
    )
    const stmt = this.db.prepare(`SELECT noteName, noteHTML FROM notes WHERE noteName = ?`)
    return new Promise((resolve, reject) => {
      resolve(stmt.get([noteName]))
    })

  }

   async noteExists(noteName) {
    try {
      let result = await this.getOneByName(noteName)
      if (result) {
        return true
      }
    } catch {
      return false
    }
  }

   saveOne(noteName, noteHTML) {
    return new Promise((resolve, reject) => {
      let stmt = this.db.prepare(`UPDATE notes SET noteHTML = ? WHERE noteName = ?`,)
      stmt.run([noteHTML, noteName])
      resolve()
    })
  }

   deleteOneByName(noteName) {
    let stmt = this.db.prepare(`DELETE FROM notes WHERE noteName = ?`)
    stmt.run([noteName])
  }

   async insert(noteName, noteHTML) {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, noteName TEXT, noteHTML TEXT)'
    )
    let queryString = this.db.prepare(`INSERT INTO notes (noteName, noteHTML) VALUES (?, ?)`).bind(noteName, noteHTML);
    let queryStringIfExists = this.db.prepare(`UPDATE notes SET noteHTML = ? WHERE noteName = ?`).bind(noteHTML, noteName)

    let exists = await this.noteExists(noteName)

    if (exists) {
      queryStringIfExists.run()
      return
    }

    queryString.run()
  }

  closeDb() {
    this.db.close()
  }
}

module.exports = DataHandler
