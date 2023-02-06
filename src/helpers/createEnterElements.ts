import getNodeContentEditable from "./getNodeContentEditable";
import { isRangeAtEnd, setRangeOn } from "./setRangeAfter";

const createEnterElements = (e: Event) => {
  let node = getNodeContentEditable();
  if (node?.parentElement?.className === "App" || !isRangeAtEnd()) {
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
