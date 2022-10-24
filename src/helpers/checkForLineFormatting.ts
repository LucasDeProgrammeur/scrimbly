import { setRangeOn } from "./setRangeAfter";

export default function checkForLineFormatting(
  editable: Element,
  content: string,
  nodeType: string,
  event: React.KeyboardEvent<HTMLDivElement>,
  setContent: any
) {
  let elementTypes = [
    { syntax: "-!", element: "h1" },
    { syntax: "-@", element: "h2" },
    { syntax: "-#", element: "h3" },
    {
      syntax: "-cb",
      element: "input",
      properties: [
        { attrName: "type", val: "checkbox" },
      ],
    },
  ];

  let children = editable.querySelectorAll("div");

  children.forEach((e) => {
    elementTypes.forEach((typesE) => {
      if (e.innerText.includes(typesE.syntax)) {
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
