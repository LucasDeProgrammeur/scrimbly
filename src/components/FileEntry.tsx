import { useState } from "react";
import { editNoteName } from "../helpers/io/storageFunctions";
import EntryBar from "./EntryBar";

interface FileEntryProps {
  keyNumber: Number;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
  setFetchedNotes: React.Dispatch<React.SetStateAction<string>>;
}

const FileEntry = ({
  keyNumber,
  currentNoteName,
  setCurrentNoteName,
  name,
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
          className="actionButton"
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
            setFetchedNotes(editNoteName(name, newNote).notes);
          }}
          setEntryBarToggle={setEntryBarToggle}
        />
      )}
    </>
  );
};

export default FileEntry;
