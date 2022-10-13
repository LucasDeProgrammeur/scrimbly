import React, { useEffect, useState } from "react";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";
import LeftMenu from "./components/LeftMenu";
import checkForInlineFormatting from "./helpers/checkForFormatting";
import EntryBar from "./components/EntryBar";
import {
  resetData,
  saveNewNote,
  saveSpecificNote,
  getNoteContentByName,
} from "./helpers/io/storageFunctions";
import checkForLineFormatting from "./helpers/checkForLineFormatting";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [fetchedNotes, setFetchedNotes] = useState([]);

  useEffect(() => {
    content = "";
    if (getNoteContentByName(currentNoteName)) {
      content = getNoteContentByName(currentNoteName);
    } else {
      setCurrentNoteName("");
    }

    document.getElementsByClassName("editable")[0].innerHTML = content;
  }, [currentNoteName]);

  useEffect(() => {
    if (!fetchedNotes.length) setCurrentNoteName("")
  }, [fetchedNotes])

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
           <div><br></br></div>
        </div>
        <div className="devBuildNotifier">Development build</div>
      </div>
    </>
  );
}

export default App;
