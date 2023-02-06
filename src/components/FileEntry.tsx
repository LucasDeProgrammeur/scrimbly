import { useState } from "react";
import { editNoteName } from "../helpers/io/storageFunctions";
import { noteList } from "../types/ioTypes";
import EntryBar from "./EntryBar";

interface FileEntryProps {
  keyNumber: Number;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
  fetchedNotes: noteList;
  setFetchedNotes: React.Dispatch<React.SetStateAction<any>>;
}

const FileEntry = ({
  keyNumber,
  currentNoteName,
  setCurrentNoteName,
  name,
  fetchedNotes,
  setFetchedNotes
}: FileEntryProps) => {
  const [entryBarToggle, setEntryBarToggle] = useState(false);
  return (
    <>
      <div
        key={keyNumber as React.Key}
        onClick={() => setCurrentNoteName(name)}
        className={
          currentNoteName === name ? "fileEntry selectedEntry" : "fileEntry"
        }
      >
        <p>{name}</p>
        <button
          className="actionButton editNoteNameButton"
          onClick={() => {
            setEntryBarToggle(true);
          }}
        >
          &#xE70F;
        </button>
      </div>
      {entryBarToggle && (
        <EntryBar
          defaultText="Enter note name to change to"
          fireAction={(newNote: string) => {
            let updatedArray = fetchedNotes;
            let index = updatedArray.findIndex(e => e.noteName === name);
            updatedArray[index].noteName = newNote;
            setFetchedNotes(updatedArray);
            dbConnection.updateName(newNote, name);
          }}
          setEntryBarToggle={setEntryBarToggle}
        />
      )}
    </>
  );
};

export default FileEntry;
