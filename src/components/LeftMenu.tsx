import React, { useEffect, useState } from "react";
import { getData, removeNote } from "../helpers/io/storageFunctions";
import { useSnackbar } from "notistack";
import { noteList, note } from "../types/ioTypes";

interface LeftMenuProps {
  setEntrybarToggle: any;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  fetchedNotes: noteList;
  setFetchedNotes: any;
}

const LeftMenu = ({
  setEntrybarToggle,
  setCurrentNoteName,
  currentNoteName,
  fetchedNotes,
  setFetchedNotes,
}: LeftMenuProps) => {
  useEffect(() => {
    if (!fetchedNotes.length) setFetchedNotes(getData().notes);
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const [noteSearchQuery, setNoteSearchQuery] = useState("");

  return (
    <div className="leftMenu">
      <div className="topBar">
        <button onClick={() => setEntrybarToggle(true)}>&#xE710;</button>
        <button
          onClick={() => {
            let newValue = removeNote(currentNoteName);
            setFetchedNotes(newValue.notes);
          }}
        >
          &#xE74D;
        </button>
        <button>&#xE897;</button>
        <button
          onClick={() => {
            controls.export().then(() => {
              enqueueSnackbar("Data exported");
            });
          }}
        >
          &#xE78C;
        </button>
        <button
          onClick={() => {
            controls.import().then(() => {
              enqueueSnackbar("Data imported");
              setFetchedNotes(getData().notes);
            });
          }}
        >
          &#xE8E5;
        </button>
      </div>
      <input
        type="text"
        placeholder="Note search"
        onChange={(e) => {
          setNoteSearchQuery(e.target.value);
        }}
      />
      <div className="fileList">
        {fetchedNotes
          .filter(
            (e) =>
              e.name.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
              e.name === currentNoteName
          )
          .map((e: note, i: Number) => {
            if (e.name === currentNoteName) {
              return (
                <div
                  key={i as React.Key}
                  onClick={() => setCurrentNoteName(e.name)}
                  className="fileEntry selectedEntry"
                >
                  {e.name}
                </div>
              );
            }

            return (
              <div
                key={i as React.Key}
                onClick={() => setCurrentNoteName(e.name)}
                className="fileEntry"
              >
                {e.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LeftMenu;
