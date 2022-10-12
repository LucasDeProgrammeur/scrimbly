import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";
import insertHTMLNode from "./helpers/insertHTMLNode";
import LeftMenu from "./components/LeftMenu";
import { ipcRenderer } from "electron";
import closeApp from "./ipcControls";
import wrapContent from "./helpers/wrapContent";
import checkForInlineFormatting from "./helpers/checkForFormatting";
import EntryBar from "./components/EntryBar";
import {
  getData,
  resetData,
  saveNewNote,
  saveSpecificNote,
  getNoteContentByName,
} from "./helpers/io/storageFunctions";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [previousKey, setPreviousKey] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [fetchedNotes, setFetchedNotes] = useState([
    { name: "testname", content: "" },
  ]);

  useEffect(() => {
    content = "";
    if (getNoteContentByName(currentNoteName)) {
      content = getNoteContentByName(currentNoteName);
    }

    document.getElementsByClassName("editable")[0].innerHTML = content;
  }, [currentNoteName]);

  const formatDocument = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentKey = event.key;
    const keyCombo = previousKey + currentKey;
    console.log(keyCombo)
    switch (keyCombo) {
      case "-!":
        insertHTMLNode(
          document.getElementsByClassName("editable")[0],
          content,
          "h1",
          event,
          setContent
        );
        break;
      case "-@":
        insertHTMLNode(
          document.getElementsByClassName("editable")[0],
          content,
          "h2",
          event,
          setContent
        );
        break;
      case "-#":
        insertHTMLNode(
          document.getElementsByClassName("editable")[0],
          content,
          "h3",
          event,
          setContent
        );
        break;
    }

    if (currentKey !== "Shift") setPreviousKey(currentKey);
  };

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
          contentEditable="true"
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
            formatDocument(e);
            checkForInlineFormatting(target);
            setContent(val);
            saveSpecificNote(currentNoteName, content);

            //e.target.setSelectionRange(e.target.innerText.length, e.target.innerText.length)
          }}
          className="editable"
        >
          <div>
            <br />
          </div>
        </div>
        <div className="devBuildNotifier">Development build</div>
      </div>
    </>
  );
}

export default App;
