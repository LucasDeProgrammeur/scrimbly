import { useState } from "react";

interface FileEntryProps {
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<any>>;
  entryBarProps: any;
}

const FileEntry = ({
  currentNoteName,
  setCurrentNoteName,
  name,
  noteNames,
  setNoteNames,
  entryBarProps
}: FileEntryProps) => {
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
          aria-label="edit note name"
          onClick={() => {
            entryBarProps.setEntryBarOpen(true)
            entryBarProps.setEntryBarDefaultText("Enter new note name") 
            entryBarProps.setEntryBarAction(() => (newNote: string) => {
              let updatedArray = noteNames;
              let index = updatedArray.findIndex(e => e === name);
              updatedArray[index] = newNote;
              setNoteNames(updatedArray);
              window.dbConnection.updateName(newNote, name);
              setLocalNoteName(newNote);
            })
          }}
        >
          &#xE70F;
        </button>
      </div>
    </>
  );
};

export default FileEntry;
