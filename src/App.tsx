import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";
import insertHTMLNode from "./helpers/insertHTMLNode";
import LeftMenu from "./components/LeftMenu";
import initDB from "./io/dbFunctions";

function App() {
  let [content, setContent] = useState("");
  let [previousKey, setPreviousKey] = useState("");
  let [visible, setVisible] = useState(false)
  initDB()

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
        <p>Scrimbly (developed by Lucas Hopman)</p>
      </div>

      <div className="App">
        <button className="revealButton" onClick={(e) => setVisible(!visible)}>Reveal</button>
        {visible && <LeftMenu />}

        <div
          contentEditable="true"
          suppressContentEditableWarning={true}
          onKeyDown={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.innerHTML === "<br>" || target.innerHTML === "") {
              e.preventDefault();
              if (e.key.length == 1) {
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

            //e.target.setSelectionRange(e.target.innerText.length, e.target.innerText.length)
          }}
          className="editable"
        >
          <div>
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
