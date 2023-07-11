import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import FileEntry from "./FileEntry";

interface LeftMenuProps {
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  helpOpen: boolean;
  entryBarProps: any;
  entryBarOpen: any;
}

const getNoteNames = async (setter: (arg0: any) => void) => {
  setter(await window.dbConnection.getAllNoteNames());
};

const LeftMenu = ({
  setCurrentNoteName,
  currentNoteName,
  setHelpOpen,
  helpOpen,
  entryBarProps,
  entryBarOpen
}: LeftMenuProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  let [noteNames, setNoteNames] = useState<string[]>([]);

  useEffect(() => {
    getNoteNames(setNoteNames);
  }, []);

  useEffect(() => {
    const resize = document.getElementsByClassName("resizerSpace")[0]!;
    const leftSide = document.getElementsByClassName("leftMenu")[0];
    const rightSide = document.getElementsByClassName(
      "editable"
    )[0] as HTMLElement;
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
      let newWidth =
        moveX - resize.getBoundingClientRect().width / 2 + 10 + "px";
      if (drag) {
        rightSide.style.width = "calc(100% - " + newWidth + ")";
        leftSide.style.width = newWidth;
      }
    });

    container.addEventListener("mouseup", function (e) {
      drag = false;
    });
  }, []);

  return (
    <>
      <div
        tabIndex={1}
        className={!helpOpen ? "leftMenu" : "leftMenu disabled"}
        draggable
      >
        <div className="topBar">
          <button
            className="newNoteButton"
            disabled={entryBarOpen ? true : false}
            onClick={() => {
              entryBarProps.setEntryBarOpen(true);
              entryBarProps.setEntryBarDefaultText("Enter a new note name...");
              entryBarProps.setEntryBarAction(() => async (newNoteName: string) => {
                if (
                  noteNames.length &&
                  noteNames.findIndex((e) => e === newNoteName) !== -1
                ) {
                  enqueueSnackbar("Note name already exists");
                  return;
                }
                setNoteNames([...noteNames, newNoteName]);
                await window.dbConnection.insert(newNoteName, "<div><br></div>");
                setCurrentNoteName(newNoteName);
                entryBarProps.setEntryBarOpen(false);
              })
            }}
            aria-label="New note"
          >
            &#xE710;
          </button>
          <button
          disabled={entryBarOpen ? true : false}
            className="deleteNoteButton red"
            onClick={() => {
              window.dbConnection.deleteOneByName(currentNoteName);
              setNoteNames(noteNames.filter((x) => x !== currentNoteName));
              setCurrentNoteName("");
            }}
            aria-label="Delete note"
          >
            &#xE74D;
          </button>
          <button
          disabled={entryBarOpen ? true : false}
            onClick={() => {
              setHelpOpen(!helpOpen);
            }}
            aria-label="Help"
          >
            &#xE897;
          </button>
          <button
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
          disabled={entryBarOpen ? true : false}
            onClick={async () => {
              let data = await window.controls.import();
              if (!data) {
                enqueueSnackbar("Scrimbly was unable to import these notes");
                return;
              }
              setNoteNames(data);

              enqueueSnackbar("Data imported");
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
          disabled={entryBarOpen}
          style={entryBarOpen ? {pointerEvents: "none"} : {}}
        />
        <div className="fileList">
          {noteNames.map((e, i) =>
            e.toLowerCase().includes(noteSearchQuery.toLocaleLowerCase()) ||
              e === currentNoteName ? (
              <FileEntry
                setNoteNames={setNoteNames}
                noteNames={noteNames}
                key={i as React.Key}
                currentNoteName={currentNoteName}
                setCurrentNoteName={setCurrentNoteName}
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
