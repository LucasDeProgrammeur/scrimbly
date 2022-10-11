import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";
import insertHTMLNode from "./helpers/insertHTMLNode";
import LeftMenu from "./components/LeftMenu";
import {ipcRenderer} from "electron";
import closeApp from "./ipcControls";
import wrapContent from "./helpers/wrapContent";
import checkForInlineFormatting from "./helpers/checkForFormatting";
// import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [previousKey, setPreviousKey] = useState("");
  let [visible, setVisible] = useState(false)

  useEffect(() => {
    content = localStorage.getItem("data") || "";
    document.getElementsByClassName("editable")[0].innerHTML = content;
    
  }, [])

  const formatDocument = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentKey = event.key;
    const keyCombo = previousKey + currentKey;

    console.log("Combo: " + keyCombo);

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
        <p>Scrimbly development build</p> 
      </div>

      <div className="windowControls">
          <button onClick={() => controls.minimize()} id="minimize">&#xE921;</button>
          <button onClick={() => controls.maximize()} id="maximize">&#xE922;</button>
          <button onClick={() => controls.close()} id="close">&#xE8BB;</button>
        </div>

      <div className="App">
       
        <LeftMenu />

        <div
          contentEditable="true"
          suppressContentEditableWarning={true}
          onKeyDown={(e) => {
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

            console.log(target.innerHTML);
            target.focus();
            let val = target?.innerHTML;
            formatDocument(e);
            setContent(val);
            localStorage.setItem("data", content);
            checkForInlineFormatting(target);

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
