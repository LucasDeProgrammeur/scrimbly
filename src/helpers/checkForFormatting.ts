import setEndOfContenteditable from "./setEndofContenteditable";
import goToPositionContentEditable from "./goToPositionContentEditable";

const checkForInlineFormatting = (editable: Element) => {
  const replaceableSymbols = [
    { key: "*", element: "em" },
    { key: "**", element: "b" },
  ];

  replaceableSymbols.forEach((e) => {
    let locs = locations(e.key, editable.innerHTML);

    locs.map((el, i) => {
      if (
        i % 2 !== 0 &&
        editable.innerHTML.substring(locs[i - 1], el).length !== 1
      ) {
        editable.innerHTML =
          editable.innerHTML.substring(0, locs[i - 1]) +
          "<" +
          e.element +
          ">" +
          editable.innerHTML.substring(locs[i - 1] + e.key.length, el) +
          "</" +
          e.element +
          ">&#8203;" +
          editable.innerHTML.substring(el + e.key.length, editable.innerHTML.length);

        goToPositionContentEditable(editable);
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
