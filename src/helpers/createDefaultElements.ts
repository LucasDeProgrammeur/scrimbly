import getNodeContentEditable from "./getNodeContentEditable";
import { setRangeOn } from "./setRangeAfter";

const createDefaultElements = (e: React.KeyboardEvent<Element>) => {
  e.preventDefault();
  let target = e.target as HTMLElement;
  let newEl = document.createElement("div");
  let node = getNodeContentEditable();

  if (e.key.length === 1 && target.children.length === 0) {
    newEl.textContent = e.key;
    target.innerHTML = "";
    target.appendChild(newEl);
    setRangeOn(newEl);
  }

  if (e.key === "Enter") {
   target.insertBefore(newEl, node?.nextSibling || null)
  }

};

export default createDefaultElements;
