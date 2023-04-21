import { useEffect, useState } from "react";
import "./App.css";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import WordCounter from "./components/WordCounter";
import handleKeyPress from "./structures/keyPressHandler";
import EntryBar from "./components/EntryBar";

declare global {
  interface Window {
    controls: any;
    dbConnection: any;
  }
}

function App() {
  let [content, setContent] = useState("");
  let [currentNoteName, setCurrentNoteName] = useState("");
  let [bottomBarText, setBottomBarText] = useState("");
  let [helpOpen, setHelpOpen] = useState(false);
  let [entryBarDefaultText, setEntryBarDefaultText] = useState("Enter new note name");
  let [entryBarOpen, setEntryBarOpen] = useState(false);
  let [entryBarAction, setEntryBarAction] = useState(() => {})

  let entryBarProps = {setEntryBarOpen, setEntryBarAction, setEntryBarDefaultText}
  let cbox = document.querySelectorAll("input");

  cbox.forEach((cb) => {
    cb.addEventListener("click", () => {
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
      if (newContent === undefined) return;
      console.log(newContent);
      setContent(newContent.noteHTML || "");
      target.innerHTML = newContent.noteHTML;
    };

    syncContentFromNote();
  }, [currentNoteName]);

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
        {entryBarOpen && <EntryBar
          defaultText={entryBarDefaultText}
          setEntryBarToggle={setEntryBarOpen}
          fireAction={entryBarAction}
        /> 
}
        <main>
          <LeftMenu
            setCurrentNoteName={setCurrentNoteName}
            currentNoteName={currentNoteName}
            setBottomBarText={setBottomBarText}
            helpOpen={helpOpen}
            setHelpOpen={setHelpOpen}
            entryBarProps={entryBarProps}
          />
          <HelpPage helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
          <>
            <div
              tabIndex={2}
              contentEditable={currentNoteName ? "true" : "false"}
              suppressContentEditableWarning={true}
              onClick={(e) => {
                if (!currentNoteName) return;
                setContent(
                  document.getElementsByClassName("editable")[0].innerHTML
                );
              }}
              onKeyUp={(e) => {
                setContent(handleKeyPress(e) || "");
                window.dbConnection.saveOne(currentNoteName, content);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Insert") {
                  window.dbConnection.clearDb();
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
        <div className="devBuildNotifier">Alpha build</div>
      </div>
    </>
  );
}

export default App;
