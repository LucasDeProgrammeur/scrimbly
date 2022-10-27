const defaultData = { notes: [] };

const saveNewNote = (noteName: string) => {
  let storage = getData();
  storage.notes.push({ name: noteName, content: "<div><br></div>" });
  localStorage.setItem("data", JSON.stringify(storage));
};

const resetData = () => {
  localStorage.setItem("data", JSON.stringify(defaultData));
};

const getData = () => {
  return JSON.parse(
    localStorage.getItem("data") || JSON.stringify(defaultData)
  );
};

const removeNote = (noteName: string) => {
  let data = getData();
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  noteIndex !== -1 && data.notes.splice(noteIndex, 1);
  localStorage.setItem("data", JSON.stringify(data));
  return data;
};

const getNoteContentByName = (noteName: string) => {
  if (noteName === "") return;
  let data = getData();
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  if (noteIndex !== -1) return data.notes[noteIndex].content || "";
  return false;
};

const saveSpecificNote = (noteName: string, content: string) => {
  let data = getData();
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  if (noteIndex === -1) {
    saveNewNote(noteName);
    return;
  }
  data.notes[noteIndex].content = content;
  localStorage.setItem("data", JSON.stringify(data));
};

const editNoteName = (noteName: string, newName: string) => {
  let data = getData();
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  if (noteIndex === -1) {
    throw new Error("This note was not found: " +noteName)
  }

  data.notes[noteIndex].name = newName;

  localStorage.setItem("data", JSON.stringify(data));
  return data;
}

export {
  saveNewNote,
  resetData,
  getData,
  saveSpecificNote,
  getNoteContentByName,
  removeNote,
  editNoteName
};
