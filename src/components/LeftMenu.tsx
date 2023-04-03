import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { noteList, note } from "../types/ioTypes";
import FileEntry from "./FileEntry";

interface LeftMenuProps {
  setEntrybarToggle: any;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  noteNames: string[];
  setNoteNames: any;
  setBottomBarText: React.Dispatch<React.SetStateAction<string>>;
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  helpOpen: boolean;
}

const LeftMenu = ({
  setEntrybarToggle,
  setCurrentNoteName,
  currentNoteName,
  noteNames,
  setNoteNames,
  setBottomBarText,
  setHelpOpen,
  helpOpen
}: LeftMenuProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [noteSearchQuery, setNoteSearchQuery] = useState("");

  useEffect(() => {
    const resize = document.getElementsByClassName("resizerSpace")[0]!;
    const leftSide = document.getElementsByClassName("leftMenu")[0];
    const rightSide = document.getElementsByClassName("editable")[0] as HTMLElement;
    const container = document.getElementsByClassName("App")[0] as HTMLElement;
    var moveX =
      leftSide.getBoundingClientRect().width +
      resize.getBoundingClientRect().width / 2;
    let drag = false;

    resize.addEventListener("mousedown", function (e) {
      drag = true;
      moveX = e.x;
    });

    container.addEventListener("mousemove", function (e) {
      moveX = e.x;
      let newWidth =  (moveX - resize.getBoundingClientRect().width / 2) + 10 + "px";
      if (drag) {
        rightSide.style.width = "calc(100% - " + newWidth + ")";
        leftSide.style.width = newWidth
       
      }

    });

    container.addEventListener("mouseup", function (e) {
      drag = false;
    });
  }, []);

  return (
    <>
      <div className={!helpOpen ? "leftMenu" : "leftMenu disabled"} draggable>
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
              window.dbConnection.deleteOneByName(currentNoteName);
              setNoteNames(noteNames.filter(x => x !== currentNoteName));
            }}
          >
            &#xE74D;
          </button>
          <button
            onMouseEnter={() => setBottomBarText("Help")}
            onClick={() => {
              setHelpOpen(!helpOpen);
            }}
          >
            &#xE897;
          </button>
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
              window.controls.import().then(async () => {
                let notes = await window.dbConnection.getAllNoteNames();
                console.log(notes);
                enqueueSnackbar("Data imported");
                setNoteNames(notes);
              });
            }}
          >
            &#xE8E5;
          </button>
        </div>
        <input
          type="text"
          className="searchBox"
          placeholder="Note search"
          onChange={(e) => {
            setNoteSearchQuery(e.target.value);
          }}
        />
        <div className="fileList">
           {
            noteNames.map((e, i) => {
              if (e.toLowerCase().includes(noteSearchQuery.toLowerCase()) || e === currentNoteName) {
                return (
                  <FileEntry
                    setNoteNames={setNoteNames}
                    noteNames={noteNames}
                    key={i as React.Key}
                    currentNoteName={currentNoteName}
                    setCurrentNoteName={setCurrentNoteName}
                    name={e}
                  />
                );
              }
             
            })
           }
        </div>
      </div>
      <div className="resizerSpace"></div>
    </>
  );
};

export default LeftMenu;
