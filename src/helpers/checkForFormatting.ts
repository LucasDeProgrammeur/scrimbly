import getNodeContentEditable from "./getNodeContentEditable";
import goToPositionContentEditable from "./goToPositionContentEditable";
import { setRangeAfter } from "./setRangeAfter";

const checkForInlineFormatting = (editable: Element) => {
  const replaceableSymbols = [
    { key: "*", element: "em" },
    { key: "**", element: "b" },
  ];

  replaceableSymbols.forEach((e) => {
    getNodeContentEditable()?.childNodes.forEach((el, i) => {
      let keySplit = e.key.split("").join("\\");

      // Regex to match text contained within keys (i.e. *test*)
      if (
        el.textContent?.match(
          new RegExp(`(?<!\\${keySplit})(\\${keySplit})([^\\${keySplit}]+\\${keySplit})`, "g")
        )
      ) {
        //debugger;
        let previousTextBegin = el.textContent.split(e.key)[0];
        let previousTextEnd = el.textContent.split(e.key)[2];
        let newContent = el.textContent.split(e.key)[1];
        let newElement = document.createElement(e.element) as HTMLElement;
        newElement.textContent = newContent;

        getNodeContentEditable()?.replaceChild(newElement, el);
        console.log(newElement.parentElement)
        newElement.insertAdjacentHTML(
          "beforebegin",
          previousTextBegin + "&#8203;"
        );
        newElement.insertAdjacentHTML("afterend", "&#8203;" + previousTextEnd);
        setRangeAfter(newElement);
      }
    });
  });
};

function locations(substring: string, string: string) {
  let a = [],
    i = -1;
  while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
}

export default checkForInlineFormatting;
