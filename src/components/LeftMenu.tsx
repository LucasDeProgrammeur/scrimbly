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
  setBottomBarText: React.Dispatch<React.SetStateAction<string>>;
}

const LeftMenu = ({
  setEntrybarToggle,
  setCurrentNoteName,
  currentNoteName,
  fetchedNotes,
  setFetchedNotes,
  setBottomBarText,
}: LeftMenuProps) => {

  const { enqueueSnackbar } = useSnackbar();
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  useEffect(() => {
    setFetchedNotes(getData().notes);
  }, []);
  return (
    <div className="leftMenu">
      <div className="topBar" onMouseLeave={() => setBottomBarText("")}>
        <button
          className="newNoteButton"
          onMouseEnter={() => setBottomBarText("New Note")}
          onMouseLeave={() => setBottomBarText("")}
          onClick={() => setEntrybarToggle(true)}
        >
          &#xE710;
        </button>
        <button
          className="deleteNoteButton"
          onMouseEnter={() => setBottomBarText("Delete Note")}
          onClick={() => {
            let newValue = removeNote(currentNoteName);
            setFetchedNotes(newValue.notes);
          }}
        >
          &#xE74D;
        </button>
        <button onMouseEnter={() => setBottomBarText("Help")}>&#xE897;</button>
        <button
          onMouseEnter={() => setBottomBarText("Export data")}
          onClick={() => {
            controls.export().then(() => {
              enqueueSnackbar("Data exported");
            });
          }}
        >
          &#xE78C;
        </button>
        <button
          onMouseEnter={() => setBottomBarText("Import data")}
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
