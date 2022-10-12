const defaultData = { notes: [{ name: "testname", content: "" }] };

interface dataArray {
  notes: Array<object>;
}

const saveNewNote = (noteName: string) => {
  let storage = JSON.parse(localStorage.getItem("data") || "");
  storage.notes.push({ name: noteName, content: "" });
  localStorage.setItem("data", JSON.stringify(storage));
};

const resetData = () => {
  localStorage.setItem("data", JSON.stringify(defaultData));
};

const getData = () => {
  try {
    JSON.parse(localStorage.getItem("data") || JSON.stringify(defaultData));
  } catch {
    resetData();
  }
  return JSON.parse(
    localStorage.getItem("data") || JSON.stringify(defaultData)
  );
};

const removeNote = (noteName: string) => {
    console.log("Removing note...")
  let data = getData();

  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  noteIndex !== -1 && data.notes.splice(noteIndex, 1);

  localStorage.setItem("data", JSON.stringify(data))
};

const getNoteContentByName = (noteName: string) => {
    if (noteName === "") return;
  let data = JSON.parse(
    localStorage.getItem("data") || JSON.stringify(defaultData)
  );
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  return data.notes[noteIndex].content;
};

const saveSpecificNote = (noteName: string, content: string) => {
  console.log("Saving specific note...");
  let data = JSON.parse(
    localStorage.getItem("data") || JSON.stringify(defaultData)
  );
  let noteIndex = data.notes.findIndex((item: any) => item.name === noteName);
  console.log("Index" + noteIndex);
  if (noteIndex === -1) {
    saveNewNote(noteName);
    return;
  }

  data.notes[noteIndex].content = content;
  localStorage.setItem("data", JSON.stringify(data));
};

export {
  saveNewNote,
  resetData,
  getData,
  saveSpecificNote,
  getNoteContentByName,
  removeNote,
};
