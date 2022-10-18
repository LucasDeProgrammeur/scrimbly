import getNodeContentEditable from "./getNodeContentEditable";
import goToPositionContentEditable from "./goToPositionContentEditable";
import setRangeAfter from "./setRangeAfter";

const checkForInlineFormatting = (editable: Element) => {
  const replaceableSymbols = [
    { key: "*", element: "em" },
    { key: "**", element: "b" },
  ];

  replaceableSymbols.forEach((e) => {
    let locs = locations(e.key, editable.innerHTML);
    console.log(getNodeContentEditable()?.childNodes.length);

    getNodeContentEditable()?.childNodes.forEach((el, i) => {
      let keySplit = e.key.split("").join("\\");

      // Regex to match text contained within keys (i.e. *test*)
      if (
        el.textContent?.match(
          new RegExp(`(?<!\\${keySplit})(\\${keySplit})([^\\${keySplit}]+\\${keySplit})`, "g")
        )
      ) {
        let previousTextBegin = el.textContent.split(e.key)[0];
        let previousTextEnd = el.textContent.split(e.key)[2];
        let newContent = el.textContent.split(e.key)[1];
        let newElement = document.createElement(e.element) as HTMLElement;
        newElement.textContent = newContent;

        getNodeContentEditable()?.replaceChild(newElement, el);
        newElement.insertAdjacentHTML(
          "beforebegin",
          previousTextBegin + "&#8203;"
        );
        newElement.insertAdjacentHTML("afterend", "&#8203;" + previousTextEnd);
        setRangeAfter(newElement);
      }
    });
    //getNodeContentEditable()?.appendChild(newElement)

    // editable.innerHTML =
    //   editable.innerHTML.substring(0, locs[i - 1]) +
    //   "<" +
    //   e.element +
    //   " classname='boldText'>" +
    //   editable.innerHTML.substring(locs[i - 1] + e.key.length, el) +
    //   "</" +
    //   e.element +
    //   editable.innerHTML.substring(el + e.key.length, editable.innerHTML.length);
  });
};

function locations(substring: string, string: string) {
  let a = [],
    i = -1;
  while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
}

export default checkForInlineFormatting;
