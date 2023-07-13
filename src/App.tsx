import { Dispatch, createContext, useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import EntryBar from "./components/EntryBar";
import EditableManipulator from "./helpers/EditableManipulator";
import checkForInlineFormatting from "./helpers/checkForFormatting";
import checkForLineFormatting from "./helpers/checkForLineFormatting";
import BottomBar from "./components/BottomBar";
import TabBar from "./components/TabBar";

declare global {
  interface Window {
    controls: any;
    dbConnection: any;
  }
}

export const CurrentNoteName = createContext(null as unknown as [string, Dispatch<React.SetStateAction<string>>]);
export const CurrentTabs = createContext(null as unknown as [string[], Dispatch<React.SetStateAction<string[]>>]);

function App() {
  let [content, setContent] = useState("");
  let [currentTabs, setCurrentTabs] = useState([] as string[])
  let [currentNoteName, setCurrentNoteName] = useState("");
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
      <CurrentNoteName.Provider value={[currentNoteName, setCurrentNoteName]}>
      <CurrentTabs.Provider value={[currentTabs, setCurrentTabs]}>
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
              helpOpen={helpOpen}
              setHelpOpen={setHelpOpen}
              entryBarProps={entryBarProps}
              entryBarOpen={entryBarOpen}
            />
            <HelpPage helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
            <>
              <div className="editorContainer">
                <TabBar />
                <div
                  tabIndex={2}
                  contentEditable={currentNoteName && !entryBarOpen ? "true" : "false"}
                  suppressContentEditableWarning={true}
                  onCopy={(e) => {
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
              </div>
            </>
          </main>
          <BottomBar content={content} />
          <div className="devBuildNotifier">Beta!</div>
        </div>
      </CurrentTabs.Provider>
      </CurrentNoteName.Provider>
    </>
  );
}

export default App;
