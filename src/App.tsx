import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "./App.css";
import EntryBar from "./components/EntryBar";
import LeftMenu from "./components/LeftMenu";
import WordCounter from "./components/WordCounter";
import createEnterElements from "./helpers/createEnterElements";
import getNodeContentEditable from "./helpers/getNodeContentEditable";
import {
  getData,
  getNoteContentByName,
  resetData,
  saveNewNote,
  saveSpecificNote,
} from "./helpers/io/storageFunctions";
import { isRangeAtEnd } from "./helpers/setRangeAfter";
import handleKeyPress from "./structures/keyPressHandler";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [fetchedNotes, setFetchedNotes] = useState([]);
  let [bottomBarText, setBottomBarText] = useState("");
  let [maximized, setMaximized] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let cbox = document.querySelectorAll("input");

  cbox.forEach((cb) => {
    cb.addEventListener("click", () => {
      console.log("change check");
      cb.checked
        ? cb.setAttribute("checked", "")
        : cb.removeAttribute("checked");
      setContent(document.getElementsByClassName("editable")[0].innerHTML);
    });
  });

  useEffect(() => {
    if (currentNoteName === "") return;
    if (getNoteContentByName(currentNoteName) !== null) {
      setContent(getNoteContentByName(currentNoteName));
    } else {
      setCurrentNoteName("");
    }
    let target = document.getElementsByClassName("editable")[0] as HTMLElement;
    target.innerHTML = getNoteContentByName(currentNoteName);
  }, [currentNoteName]);

  useEffect(() => {
    if (currentNoteName) {
      // handleCounter(target, setCharAmount, setWordAmount);
      saveSpecificNote(currentNoteName, content);
    }
  }, [content, currentNoteName]);

  useEffect(() => {
    if (!fetchedNotes.length) setCurrentNoteName("");
  }, [fetchedNotes]);

  return (
    <>
      <div className="draggable">
        <p>Notes development build</p>
      </div>

      <div className="windowControls">
        <button onClick={() => controls.minimize()} id="minimize">
          &#xE921;
        </button>
        <button
          onClick={() => {
            maximized ? controls.restore() : controls.maximize();
            setMaximized(!maximized);
          }}
          id="maximize"
        >
          {maximized ? "" : ""}
        </button>
        <button onClick={() => controls.close()} id="close">
          &#xE8BB;
        </button>
      </div>
      <div
        className="App"
        onKeyDown={(e) => {
          if (e.key === "Home") {
            resetData();
          }
        }}
      >
        {entryBarToggle && (
          <EntryBar
            setEntryBarToggle={setEntryBarToggle}
            defaultText="Enter new note name..."
            fireAction={(text: string) => {
              if (fetchedNotes.findIndex((e) => e.name === text) !== -1) {
                enqueueSnackbar("Note name already exists");
                return;
              }
              saveNewNote(text);
              setCurrentNoteName(text);
              setEntryBarToggle(false);
              setFetchedNotes(getData().notes);
              document.getElementsByClassName("editable")[0].focus();
            }}
          />
        )}
        <LeftMenu
          setEntrybarToggle={setEntryBarToggle}
          setCurrentNoteName={setCurrentNoteName}
          currentNoteName={currentNoteName}
          fetchedNotes={fetchedNotes}
          setFetchedNotes={setFetchedNotes}
          setBottomBarText={setBottomBarText}
        />

        <div
          contentEditable={currentNoteName ? "true" : "false"}
          suppressContentEditableWarning={true}
          onClick={(e) => {
            if (!currentNoteName) return;
            setContent(
              document.getElementsByClassName("editable")[0].innerHTML
            );
            saveSpecificNote(currentNoteName, content);
          }}
          onKeyUp={(e) => {
            setContent(handleKeyPress(e, entryBarToggle) || "");
            saveSpecificNote(currentNoteName, content);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (getNodeContentEditable()?.parentElement?.className !== "App" && isRangeAtEnd()) {
                createEnterElements(e);
              }
              
            }
          }}
          className="editable rightContainer"
        >
          <div>
            <br></br>
          </div>
        </div>
        <div className="bottomBar">
          <p className="bottomBarInfo">{bottomBarText}</p>
          <WordCounter content={content} />
        </div>
        <div className="devBuildNotifier">Development build</div>
      </div>
    </>
  );
}

export default App;
