import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import setEndOfContenteditable from "./helpers/setEndofContenteditable";

function App() {
  let [content, setContent] = useState("");
  let [previousKey, setPreviousKey] = useState("");

  const formatDocument = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentKey = event.key;
    if (currentKey === "-" && previousKey === "-") {
      let editable = document.getElementsByClassName("editable")[0];
      event.preventDefault();
      setContent(content.substring(0, content.length - 3) + "h");
      editable.innerHTML = editable.innerHTML.substring(0, editable.innerHTML.length - 2)
      let newElement = document.createElement("h1");
      document.getElementsByClassName("editable")[0].appendChild(newElement);
      newElement.textContent = "- "
      setEndOfContenteditable(event.target)
    }

    setPreviousKey(currentKey);
  };

  return (
    <>
      <div className="draggable">
        <p>Scrimbly</p>
      </div>
      <div className="App">
        <div
          contentEditable="true"
          suppressContentEditableWarning={true}
          onKeyDown={(e) => {

            const target = e.target as HTMLInputElement;
            if (target.innerHTML == "<br>" ||  target.innerHTML == "" ) {
              e.preventDefault();
              if (e.key.length == 1) {
                target.innerHTML = "<div>" + e.key +  "</div>"
                setEndOfContenteditable(e.target)
              } else {
                target.innerHTML = "<div><br></div>" 
              } 

            }

            console.log(target.innerHTML)
            target.focus();
            let val = target?.innerHTML;
            formatDocument(e);
            setContent(val);

            //e.target.setSelectionRange(e.target.innerText.length, e.target.innerText.length)
          }}
          className="editable"
        ><div><br></br></div></div>
      </div>
    </>
  );
}

export default App;
