import { useEffect, useState } from "react";
import "./App.css";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import WordCounter from "./components/WordCounter";
import handleKeyPress from "./structures/keyPressHandler";
import EntryBar from "./components/EntryBar";
import EditableManipulator from "./helpers/EditableManipulator";
import checkForInlineFormatting from "./helpers/checkForFormatting";
import checkForLineFormatting from "./helpers/checkForLineFormatting";

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
  let [shouldLockApp, setShouldLockApp] = useState(false);
  let [entryBarDefaultText, setEntryBarDefaultText] = useState(
    "Enter new note name"
  );
  let [entryBarOpen, setEntryBarOpen] = useState(false);
  let [entryBarAction, setEntryBarAction] = useState(() => {});

  let entryBarProps = {
    setEntryBarOpen,
    setEntryBarAction,
    setEntryBarDefaultText,
  };
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
    let target = document.getElementsByClassName("editable")[0] as HTMLElement;
    if (currentNoteName === "") return;
    if (target === undefined) return;
    let syncContentFromNote = async () => {
      let newContent = await window.dbConnection.getOneByName(currentNoteName);

      setContent(newContent.noteHTML || "");
      target.innerHTML = newContent.noteHTML;
    };

    syncContentFromNote();
  }, [currentNoteName]);

  useEffect(() => {
    const checkIsSingleInstance = async () => {
      let isSingleInstance = await window.controls.isSingleInstance();
      if (!isSingleInstance) {
        setShouldLockApp(true);
      }
    };

    checkIsSingleInstance();
  }, []);

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
        <dialog open={shouldLockApp}>
          Opening two instances of Scrimbly at the same time could result in
          notes being out of sync.
          <button onClick={() => setShouldLockApp(false)}>OK</button>
        </dialog>
        {entryBarOpen && (
          <EntryBar
            defaultText={entryBarDefaultText}
            setEntryBarToggle={setEntryBarOpen}
            fireAction={entryBarAction}
          />
        )}
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
                const target = e.target as HTMLInputElement;
                // EditableManipulator.SyntaxHighlightCodeBlocks([
                //   ...target.children,
                // ]);
                EditableManipulator.createDefaultElements(e);
                checkForLineFormatting(target);
                checkForInlineFormatting(target);

                window.dbConnection.saveOne(currentNoteName, content);
              }}
              onKeyDown={async (e) => {
                const target = e.target as HTMLInputElement;

                if (e.key === "Insert") {
                  window.dbConnection.clearDb();
                }
                EditableManipulator.preventEditableBehavior(e);
                setContent(EditableManipulator.handleKeyPress(e) || "");
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
