import React, { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import FileEntry from "./FileEntry";
import { CurrentNoteName, CurrentTabs } from "../App";
import { deleteNote, importNote, newNote } from "../helpers/actionFunctions";

interface LeftMenuProps {
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  helpOpen: boolean;
  entryBarProps: any;
  entryBarOpen: any;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<string[]>>;
}

const getNoteNames = async (setter: (arg0: any) => void) => {
  setter(await window.dbConnection.getAllNoteNames());
};

const LeftMenu = ({
  setHelpOpen,
  helpOpen,
  entryBarProps,
  entryBarOpen,
  noteNames,
  setNoteNames
}: LeftMenuProps) => {
  const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);
  const { enqueueSnackbar } = useSnackbar();
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [currentTabs, setCurrentTabs] = useContext(CurrentTabs);

  useEffect(() => {
    getNoteNames(setNoteNames);
  }, []);

  useEffect(() => {
    let baseWidth = 220;
    const resize = document.getElementsByClassName("resizerSpace")[0]!;
    const leftSide = document.getElementsByClassName("leftMenu")[0] as HTMLElement;
    const rightSide = document.getElementsByClassName(
      "editorContainer"
    )[0] as HTMLElement;
    const tabBar = document.getElementsByClassName(
      "tabBar"
    )[0] as HTMLElement;
    const container = document.getElementsByClassName("App")[0] as HTMLElement;
    var moveX =
      leftSide.getBoundingClientRect().width +
      resize.getBoundingClientRect().width / 2;
    let drag = false;

    resize.addEventListener("mousedown", function (e: any) {
      drag = true;
      moveX = e.x;
    });

    container.addEventListener("mousemove", function (e) {
      moveX = e.x;
      let newWidth =
        moveX - resize.getBoundingClientRect().width / 2 + 50;
      if (newWidth < baseWidth) newWidth = baseWidth;
      if (drag) {
        rightSide.style.width = "calc(100% - " + newWidth + "px)";
        tabBar.style.left = newWidth + 10 + "px"; //+10 compensation for divider
        leftSide.style.width = newWidth + "px";
      }
    });

    container.addEventListener("mouseup", () => {
      drag = false;
    });

    container.addEventListener("mouseleave", () => {
      drag = false;
    })
  }, []);

  return (
    <>
      <div
        className={!helpOpen ? "leftMenu" : "leftMenu disabled"}
        draggable
      >
        <div className="topBar">
          <button
            tabIndex={90}
            className="newNoteButton"
            disabled={entryBarOpen ? true : false}
            onClick={() => newNote(entryBarProps, noteNames, setNoteNames, setCurrentNoteName, setCurrentTabs, currentTabs)}
            aria-label="New note"
          >
            &#xE710;
          </button>
          <button
            tabIndex={91}
            disabled={entryBarOpen ? true : false}
            className="deleteNoteButton red"
            onClick={() => deleteNote(noteNames, setNoteNames, setCurrentTabs, setCurrentNoteName, currentNoteName, currentTabs)}
            aria-label="Delete note"
          >
            &#xE74D;
          </button>
          <button
            tabIndex={92}
            disabled={entryBarOpen ? true : false}
            onClick={() => {
              setHelpOpen(!helpOpen);
            }}
            aria-label="Help"
          >
            &#xE897;
          </button>
          <button
            tabIndex={93}
            disabled={entryBarOpen ? true : false}
            onClick={() => {
              window.controls.export().then(() => {
                enqueueSnackbar("Data exported");
              });
            }}
          >
            &#xE78C;
          </button>
          <button
            tabIndex={94}
            disabled={entryBarOpen ? true : false}
            onClick={() => importNote(setNoteNames)}
          >
            &#xE8E5;
          </button>
        </div>
        <input
          tabIndex={96}
          type="text"
          className="searchBox"
          placeholder="Note search"
          onChange={(e) => {
            setNoteSearchQuery(e.target.value);
          }}
          disabled={entryBarOpen}
          style={entryBarOpen ? { pointerEvents: "none" } : {}}
        />
        <div className="fileList">
          {noteNames.map((e, i) =>
            e.toLowerCase().includes(noteSearchQuery.toLocaleLowerCase()) ||
              e === currentNoteName ? (
              <FileEntry
                setNoteNames={setNoteNames}
                noteNames={noteNames}
                key={i + e as React.Key}
                name={e}
                entryBarProps={entryBarProps}
              />
            ) : (
              <></>
            )
          )}
        </div>
      </div>
      <div className="resizerSpace"></div>
    </>
  );
};

export default LeftMenu;
