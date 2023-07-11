import EditableManipulator from "./EditableManipulator";

const checkForInlineFormatting = (editable: Element) => {
  const replaceableSymbols = [
    { key: "*", element: "em" },
    { key: "**", element: "b" },
    { key: "~", element: "s" },
  ];

  replaceableSymbols.forEach((e) => {
    EditableManipulator.getNodeContentEditable()?.childNodes.forEach(
      (el, i) => {
        let keySplit = e.key.split("").join("\\");

        // Regex to match text contained within keys (i.e. *test*)
        if (
          el.textContent?.match(
            new RegExp(
              `(?<!\\${keySplit})(\\${keySplit})([^\\${keySplit}]+\\${keySplit})`,
              "g"
            )
          )
        ) {
          let previousTextBegin = el.textContent.split(e.key)[0];
          let previousTextEnd = el.textContent.split(e.key)[2];
          let newContent = el.textContent.split(e.key)[1];
          let newElement = document.createElement(e.element) as HTMLElement;
          newElement.textContent = newContent;

          EditableManipulator.getNodeContentEditable()?.replaceChild(
            newElement,
            el
          );
          newElement.insertAdjacentHTML(
            "beforebegin",
            previousTextBegin + "&#8203;"
          );
          newElement.insertAdjacentHTML(
            "afterend",
            "&#8203;" + previousTextEnd
          );
          EditableManipulator.setRangeOn(newElement.parentElement!, [...newElement.parentElement?.childNodes!].indexOf(newElement) +2);
        }
      }
    );
  });
};

export default checkForInlineFormatting;
