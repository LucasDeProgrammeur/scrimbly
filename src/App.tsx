import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "./App.css";
import EntryBar from "./components/EntryBar";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import WordCounter from "./components/WordCounter";
import createEnterElements from "./helpers/createEnterElements";
import getNodeContentEditable from "./helpers/getNodeContentEditable";
import { isRangeAtEnd } from "./helpers/setRangeAfter";
import handleKeyPress from "./structures/keyPressHandler";
// import initDB from "./io/dbFunctions";

declare global {
  interface Window {
    controls: any;
    dbConnection: any;
  }
}

const getNoteNames = async (setter: ((arg0: any) => void)) => {
  console.log(await window.dbConnection.getAllNoteNames()); 
  setter(await window.dbConnection.getAllNoteNames());
}

function App() {
  let [content, setContent] = useState("");
  let [entryBarToggle, setEntryBarToggle] = useState(false);
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [noteNames, setNoteNames] = useState<string[]>([]);
  let [bottomBarText, setBottomBarText] = useState("");
  let [helpOpen, setHelpOpen] = useState(false);
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
    let syncContentFromNote = async () => {
      let newContent = await window.dbConnection.getOneByName(currentNoteName);
      let target = document.getElementsByClassName(
        "editable"
      )[0] as HTMLElement;
      if (target === undefined) return;
      setContent(newContent.noteHTML);
      target.innerHTML = newContent.noteHTML;
    };

    syncContentFromNote();
  }, [currentNoteName]);

  useEffect(() => {
    getNoteNames(setNoteNames);
    console.log(noteNames);
  }, [])

  useEffect(() => {
    if (!noteNames.length) setCurrentNoteName("");
  }, [noteNames]);

  return (
    <>
      <WindowBar />
      <div
        className="App"
        onKeyDown={(e) => {
          if (e.key === "Home") {
            window.dbConnection.resetData();
          }
        }}
      >
        <main>
          {entryBarToggle && (
            <EntryBar
              setEntryBarToggle={setEntryBarToggle}
              defaultText="Enter new note name..."
              fireAction={(newNoteName: string) => {
                if (
                  noteNames.length &&
                  noteNames.findIndex((e) => e.noteName === newNoteName) !== -1
                ) {
                  enqueueSnackbar("Note name already exists");
                  return;
                }
                //ipcRenderer.send("insert", [newNoteName, "<div><br></br></div>"])
                window.dbConnection.insert(newNoteName, "<div></div>");
                setNoteNames(
                  [...noteNames, newNoteName]
                );
                setCurrentNoteName(newNoteName);
                setEntryBarToggle(false);

                document.getElementsByClassName("editable")[0].focus();
              }}
            />
          )}
          <LeftMenu
            setEntrybarToggle={setEntryBarToggle}
            setCurrentNoteName={setCurrentNoteName}
            currentNoteName={currentNoteName}
            noteNames={noteNames}
            setNoteNames={setNoteNames}
            setBottomBarText={setBottomBarText}
            helpOpen={helpOpen}
            setHelpOpen={setHelpOpen}
          />
          <HelpPage helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
          <>
            <div
              contentEditable={currentNoteName ? "true" : "false"}
              suppressContentEditableWarning={true}
              onClick={(e) => {
                if (!currentNoteName) return;
                setContent(
                  document.getElementsByClassName("editable")[0].innerHTML
                );

              }}
              onKeyUp={(e) => {
                setContent(handleKeyPress(e, entryBarToggle) || "");
                //ipcRenderer.send("saveOne", [currentNoteName, content])
                window.dbConnection.saveOne(currentNoteName, content);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Insert") {
                  window.dbConnection.clearDb();
                  //ipcRenderer.send("clearDb")
                }
                if (e.key === "Enter") {
                  if (
                    getNodeContentEditable()?.parentElement?.className !==
                      "App" &&
                    isRangeAtEnd()
                  ) {
                    createEnterElements(e);
                  }
                }
              }}
              className="editable"
            >
              <div>
                <br></br>
              </div>
            </div>
          </>
        </main>
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
