import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "./App.css";
import HelpPage from "./components/HelpPage";
import LeftMenu from "./components/LeftMenu";
import WindowBar from "./components/WindowBar";
import WordCounter from "./components/WordCounter";
import handleKeyPress from "./structures/keyPressHandler";

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
  const { enqueueSnackbar } = useSnackbar();
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
      if (target === undefined) return;
      setContent(newContent.noteHTML);
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
        <main>
          <LeftMenu
            setCurrentNoteName={setCurrentNoteName}
            currentNoteName={currentNoteName}
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
