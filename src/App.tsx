import React, { useEffect, useState } from "react";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";
import LeftMenu from "./components/LeftMenu";
import checkForInlineFormatting from "./helpers/checkForFormatting";
import EntryBar from "./components/EntryBar";
import { SnackbarProvider } from "notistack";
import {
  resetData,
  saveNewNote,
  saveSpecificNote,
  getNoteContentByName,
} from "./helpers/io/storageFunctions";
import checkForLineFormatting from "./helpers/checkForLineFormatting";
import handleCounter from "./helpers/handleCounter";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [fetchedNotes, setFetchedNotes] = useState([]);
  let [bottomBarText, setBottomBarText] = useState("");
  let [charAmount, setCharAmount] = useState("");
  let [wordAmount, setWordAmount] = useState("");
  useEffect(() => {
    content = "";
    let target = document.getElementsByClassName("editable")[0] as HTMLElement;
    if (getNoteContentByName(currentNoteName)) {
      content = getNoteContentByName(currentNoteName);
    } else {
      setCurrentNoteName("");
    }

    target.innerHTML = content;
    handleCounter(target, setCharAmount, setWordAmount);
  }, [currentNoteName]);

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
        <button onClick={() => controls.maximize()} id="maximize">
          &#xE922;
        </button>
        <button onClick={() => controls.close()} id="close">
          &#xE8BB;
        </button>
      </div>
      <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
        <div
          className="App"
          onKeyDown={(e) => {
            if (e.key === "Home") {
              resetData();
            }
            if (e.key === "Escape") {
              setEntryBarToggle(false);
            }
          }}
        >
          {entryBarToggle && (
            <EntryBar
              setEntryBarToggle={setEntryBarToggle}
              defaultText="Enter new note name..."
              fireAction={(text: string) => {
                saveNewNote(text);
                setCurrentNoteName(text);
                document.getElementsByClassName("editable")[0].focus();
              }}
              fetchedNotes={fetchedNotes}
              setFetchedNotes={setFetchedNotes}
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
            onKeyUp={(e) => {
              if (entryBarToggle) {
                document.getElementById("entryBar")?.focus();
                e.preventDefault();
                return;
              }
              
              const target = e.target as HTMLInputElement;
              handleCounter(target, setCharAmount, setWordAmount);

              if (target.innerHTML === "<br>" || target.innerHTML === "") {
                e.preventDefault();
                if (e.key.length === 1) {
                  target.innerHTML = "<div>" + e.key + "</div>";
                  setEndOfContenteditable(e.target);
                } else {
                  target.innerHTML = "<div><br></div>";
                }
              }
              
              target.focus();
              let val = target?.innerHTML;
              checkForLineFormatting(target, content, "h1", e, setContent);
              checkForInlineFormatting(target);
              setContent(val);
              saveSpecificNote(currentNoteName, content);
            }}
            className="editable rightContainer"
          >
            <div>
              <br></br>
            </div>
          </div>
          <div className="bottomBar">
            <p className="bottomBarInfo">{bottomBarText}</p>
            <p className="charNumbers">
              Words: {wordAmount} | Characters: {charAmount}
            </p>
          </div>
          <div className="devBuildNotifier">Development build</div>
        </div>
      </SnackbarProvider>
    </>
  );
}

export default App;
