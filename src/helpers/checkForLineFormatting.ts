import { setRangeOn } from "./setRangeAfter";
import ReactDOM from "react-dom/client";

export default function checkForLineFormatting(editable: Element) {
  let elementTypes = [
    { syntax: "-!", element: "h1" },
    { syntax: "-@", element: "h2" },
    { syntax: "-#", element: "h3" },
    { syntax: "-s", element: "s" },
    {syntax: "`", element: "code"},
    {
      syntax: "-cd",
      elements: ["pre", "code"],
      elementsType: "children",
      properties: [{ attrName: "class", val: "language-js" }],
    },
    {
      syntax: "-cb",
      element: "input",
      properties: [{ attrName: "type", val: "checkbox" }],
    },
  ];

  let children = editable.querySelectorAll("div");
  children.forEach((e) => {
    elementTypes.forEach((typesE) => {
      if (e.innerText.includes(typesE.syntax)) {


        if (typesE.elements) {
          let previousElement: any;
          typesE.elements.forEach((e) => {
            let newElement = document.createElement(e);
            if (!previousElement) {
              previousElement = newElement;
              return;
            }
          })
          return;
        }

        let newElement = document.createElement(typesE.element);
        newElement.innerText = e.innerText.replaceAll(typesE.syntax, "");
        if (newElement.innerText === "") newElement.innerHTML = "&#8203;";
        e.textContent = "";
        e.appendChild(newElement);

        if (typesE.properties) {
          typesE.properties.forEach((property) => {
            newElement.setAttribute(property.attrName, property.val);
          });
        }
        setRangeOn(newElement);
      }
    });
  });
}
