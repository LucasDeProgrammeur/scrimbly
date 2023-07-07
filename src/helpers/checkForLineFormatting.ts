import EditableManipulator from "./EditableManipulator";


export default function checkForLineFormatting(editable: Element) {
  let elementTypes = [
    { syntax: "-!", element: "h1" },
    { syntax: "-@", element: "h2" },
    { syntax: "-#", element: "h3" },
    { syntax: "-s", element: "s" },
    {
      syntax: "`",
      element: "code",
      properties: [
        {
          attrName: "oninput",
          val: () => console.log,
        },
        {
          attrName: "contenteditable",
          val: true,
        },
        {
          attrName: "tabIndex",
          val: "4",
        },
      ],
    },
    {
      syntax: "-cd",
      elements: ["pre", "code"],
      elementsType: "children",
      properties: [
        { attrName: "class", val: "shadowElement language-js" },
        { attrName: "tabIndex", val: "3" },
      ],
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
      if (!e.innerText) return;
      // Check if text inside of a child contains syntax (-cb -s etc)
      if (e.innerText.includes(typesE.syntax)) {
        //Contains multiple elements? Loop through them and make them
        if (typesE.elements) {
          let previousElement: any;
          typesE.elements.forEach((e) => {
            let newElement = document.createElement(e);
            if (!previousElement) {
              previousElement = newElement;
              return;
            }
          });
          return;
        }

        //default behavior
        let newElement = document.createElement(typesE.element);
        //use the text within element, but remove the syntax
        newElement.innerText = e.innerText.replaceAll(typesE.syntax, "");
        e.textContent = "";
        e.appendChild(newElement);

        if (typesE.properties) {
          typesE.properties.forEach((property) => {
            if (typeof property.val === "string") {
              newElement.setAttribute(property.attrName, property.val);
            }
            if (typeof property.val === "boolean") {
              newElement.setAttribute(property.attrName, 'true');
            }
            if (typeof property.val === "function") {
              newElement.addEventListener("keyup", (e) =>
                console.log("event trigger")
              );
            }
          });
        }
        EditableManipulator.setRangeOn(newElement.parentElement!, [...newElement.parentElement?.childNodes!].indexOf(newElement) +1);
      }
    });
  });
}
