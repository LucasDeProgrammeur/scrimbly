import { useContext, useState } from "react";
import { CurrentNoteName } from "../App";

interface FileEntryProps {
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<any>>;
  entryBarProps: any;
  tabs: Array<string>;
  setTabs: React.Dispatch<React.SetStateAction<Array<string>>>;
}

const FileEntry = ({
  name,
  noteNames,
  setNoteNames,
  entryBarProps,
  tabs,
  setTabs
}: FileEntryProps) => {
  const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName) as any;
  const [localNoteName, setLocalNoteName] = useState(name);
  return (
    <>
      <div
        onClick={() => {
          setCurrentNoteName(name);
          if (tabs.indexOf(localNoteName) === -1) {
            setTabs([...tabs, localNoteName])
          }
        }}
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
              console.log(noteNames)
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
