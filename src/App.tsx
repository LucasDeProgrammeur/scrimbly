import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import WordCounter from "./components/WordCounter";
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
  const [selectionRange, setSelectionRange] = useState({ range: null }) as any;
  let [entryBarDefaultText, setEntryBarDefaultText] = useState(
    "Enter new note name"
  );
  let [entryBarOpen, setEntryBarOpen] = useState(false);
  let [entryBarAction, setEntryBarAction] = useState(() => { });

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

  useLayoutEffect(() => {
    const selection = document.getSelection()!
    if (selectionRange !== undefined) {
      selection.removeAllRanges()
      // Check if selectionrange has a property a range is known to have
      if (selectionRange.startContainer) {
        selection.addRange(selectionRange)
      }
    }
  })


  useEffect(() => {
    const target = document.getElementsByClassName("editable")[0] as HTMLElement;
    if (currentNoteName === "") return;
    if (target === undefined) return;
    let syncContentFromNote = async () => {
      let newContent = await window.dbConnection.getOneByName(currentNoteName);
      if (newContent) {
        
        setContent(newContent.noteHTML || "");
        target.innerHTML = newContent.noteHTML;
      }
    };

    syncContentFromNote();
  }, [currentNoteName]);

  useEffect(() => {
    const checkIsSingleInstance = async () => {
      const isSingleInstance = await window.controls.isSingleInstance();
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
              onCopy={(e) => {
                console.dir(e.clipboardData)
                e.preventDefault(); 
                const selectedText = window.getSelection()!.toString(); 
                const range = document.createRange(); 
                range.selectNode(document.body);
                const copiedData = range.createContextualFragment(selectedText);
                e.clipboardData.setData('text/plain', copiedData.textContent!); 
                e.clipboardData.setData('text/html', ''); 
              }}
              onClick={(e) => {
                if (!currentNoteName) return;
                setContent(
                  document.getElementsByClassName("editable")[0].innerHTML
                );
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                EditableManipulator.createDefaultElements(e);
                EditableManipulator.SyntaxHighlightCodeBlocks()
                EditableManipulator.removeOrphanHighlightedCodeblocks(e.target as HTMLElement)
                checkForLineFormatting(target);
                checkForInlineFormatting(target);
                setSelectionRange(document.getSelection()!.getRangeAt(0).cloneRange())
                setContent(target.innerHTML)
                window.dbConnection.saveOne(currentNoteName, content);
              }}
              onKeyDown={async (e) => {
                EditableManipulator.preventEditableBehavior(e);
                if (e.key === "Insert") {
                  window.dbConnection.clearDb();
                }

                // setContent(EditableManipulator.handleKeyPress(e) || "");
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
