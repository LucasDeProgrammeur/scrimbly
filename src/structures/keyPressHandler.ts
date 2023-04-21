import React from "react";
import checkForInlineFormatting from "../helpers/checkForFormatting";
import checkForLineFormatting from "../helpers/checkForLineFormatting";
import createDefaultElements from "../helpers/createDefaultElements";

const handleKeyPress = (e: React.KeyboardEvent) => {
      const target = e.target as HTMLInputElement;

      // Replace any images with specialized image element
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
            eli.remove();
          }
        })
      })
      createDefaultElements(e)


      target.focus();
      let val = target?.innerHTML;
      checkForLineFormatting(target);
      checkForInlineFormatting(target);
      // checkForEmptyElements(target)
      
      return val;
}


export default handleKeyPress;
