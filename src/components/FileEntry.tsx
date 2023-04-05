import { useState } from "react";
import EntryBar from "./EntryBar";

interface FileEntryProps {
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<any>>;
}

const FileEntry = ({
  currentNoteName,
  setCurrentNoteName,
  name,
  noteNames,
  setNoteNames
}: FileEntryProps) => {
  const [entryBarToggle, setEntryBarToggle] = useState(false);
  const [localNoteName, setLocalNoteName] = useState(name);
  return (
    <>
      <div
        onClick={() => setCurrentNoteName(name)}
        className={
          currentNoteName === name ? "fileEntry selectedEntry" : "fileEntry"
        }
      >
        <p>{localNoteName}</p>
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
            let updatedArray = noteNames;
            let index = updatedArray.findIndex(e => e === name);
            updatedArray[index] = newNote;
            setNoteNames(updatedArray);
            window.dbConnection.updateName(newNote, name);
            setLocalNoteName(newNote);
          }}
          setEntryBarToggle={setEntryBarToggle}
        />
      )}
    </>
  );
};

export default FileEntry;
