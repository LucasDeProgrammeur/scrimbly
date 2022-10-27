import { useEffect, useState } from "react";
import "./App.css";
import LeftMenu from "./components/LeftMenu";
import EntryBar from "./components/EntryBar";
import { SnackbarProvider } from "notistack";
import {
  resetData,
  saveNewNote,
  saveSpecificNote,
  getNoteContentByName,
  getData,
} from "./helpers/io/storageFunctions";
import WordCounter from "./components/WordCounter";
import handleKeyPress from "./structures/keyPressHandler";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [fetchedNotes, setFetchedNotes] = useState([]);
  let [bottomBarText, setBottomBarText] = useState("");
  let [maximized, setMaximized] = useState(false);
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
      <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
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
                saveNewNote(text);
                setCurrentNoteName(text);
                setEntryBarToggle(false);
                setFetchedNotes(getData().notes)
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
            className="editable rightContainer"
          >
            <div>
              <br></br>
            </div>
          </div>
          <div className="bottomBar">
            <p className="bottomBarInfo">{bottomBarText}</p>
            <WordCounter content={content}/>
          </div>
          <div className="devBuildNotifier">Development build</div>
        </div>
      </SnackbarProvider>
    </>
  );
}

export default App;
