import getNodeContentEditable from "./getNodeContentEditable";
import { setRangeOn } from "./setRangeAfter";

const createEnterElements = (e: Event) => {
    debugger;
  let node = getNodeContentEditable();
  if (node?.parentElement?.className === "App") {
    return;
  }

  while (node?.nodeName !== "DIV") {
    node = node?.parentElement;
  }
  e.preventDefault();
  let target = e.target as HTMLElement;
  let newEl = document.createElement("div");
  newEl.appendChild(document.createElement("br"));
  target.insertBefore(newEl, node?.nextSibling || null);
  setRangeOn(newEl, 0);
};

export default createEnterElements;
