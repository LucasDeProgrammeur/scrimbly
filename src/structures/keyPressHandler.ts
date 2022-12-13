import React from "react";
import checkForInlineFormatting from "../helpers/checkForFormatting";
import checkForLineFormatting from "../helpers/checkForLineFormatting";
import setEndOfContenteditable from "../helpers/setEndofContenteditable";

const handleKeyPress = (e: React.KeyboardEvent, entryBarToggle: boolean ) => {
    if (entryBarToggle) {
        document.getElementById("entryBar")?.focus();
        e.preventDefault();
        return;
      }


      const target = e.target as HTMLInputElement;

      [...target.children].forEach(el => {
        
        if (el.nodeName === "IMG") {  
          el.remove();
        }

        


        [...el.children].forEach(eli => {
          if (eli.nodeName === "IMG") {
            
            let newEl = document.createElement("div");
            newEl.setAttribute("class", "imageFrame");
            newEl.style.background = `url("${eli.getAttribute("src")}") no-repeat`;
            newEl.style.backgroundSize = "100% 100%";
            newEl.style.height = eli.clientHeight + "px" || "100px";
            newEl.style.width = eli.clientWidth + "px" || "100px";
            newEl.setAttribute("contenteditable", "false");

            eli.parentElement?.insertBefore(newEl, eli);

              console.log("Hi")
            eli.remove();
          }
        })
      })

      if (target.innerHTML === "<br>" || target.innerHTML === "") {
        e.preventDefault();
        if (e.key.length === 1) {
          target.innerHTML = "<div>" + e.key + "</div>";
          setEndOfContenteditable(e.target);
        } else {
          target.innerHTML = "<div><br></div>";
        }
      }


      target.focus();
      let val = target?.innerHTML;
      checkForLineFormatting(target);
      checkForInlineFormatting(target);
      // checkForEmptyElements(target)
      
      return val;
}


export default handleKeyPress;
