import { useContext, useState } from "react";
import { CurrentNoteName, CurrentTabs } from "../App";
import { useSnackbar } from "notistack";

interface FileEntryProps {
  name: string;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<any>>;
  entryBarProps: any;
}

const FileEntry = ({
  name,
  noteNames,
  setNoteNames,
  entryBarProps,
}: FileEntryProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName) as any;
  const [localNoteName, setLocalNoteName] = useState(name);
  const [currentTabs, setCurrentTabs] = useContext(CurrentTabs);
  return (
    <>
      <div
        onClick={() => {
          setCurrentNoteName(name);
          if (currentTabs.indexOf(localNoteName) === -1) {
            setCurrentTabs([...currentTabs, localNoteName])
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
              let index = updatedArray.findIndex(e => e === name);
              if (updatedArray.indexOf(newNote) !== -1) {
                enqueueSnackbar("Note name already exists", {variant: "error"})
                return;
              }

              updatedArray[index] = newNote;
              setNoteNames(updatedArray);
              setCurrentTabs(currentTabs.map(e => e === name ? newNote : e))
              window.dbConnection.updateName(newNote, name);
              setLocalNoteName(newNote);
              setCurrentNoteName(newNote)
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
