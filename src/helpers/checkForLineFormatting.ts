import EditableManipulator from "./EditableManipulator";


export default function checkForLineFormatting(editable: Element) {
  let elementTypes = [
    { syntax: "###", element: "h3" },
    { syntax: "##", element: "h2" },
    { syntax: "#", element: "h1" },
    { syntax: "-s", element: "s" },
    {
      syntax: "`",
      element: "code",
      properties: [
        {
          attrName: "oninput",
        },
        {
          attrName: "contenteditable",
          val: true,
        },
        {
          attrName: "tabIndex",
          val: "150",
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
      properties: [{ attrName: "type", val: "checkbox" }, {attrName: "tabindex", val: "-1"}],
    },
  ];

  let children = editable.querySelectorAll("div");
  children.forEach((e) => {
    elementTypes.forEach((typesE) => {
      // Return if it's a CODE element
      if (e.firstChild?.nodeName === "CODE") return;
      if (!e.innerText) return;
      // Check if text inside of a child contains syntax (-cb -s etc)
      if (e.innerText.includes(typesE.syntax) && e.innerText.replace(/[^a-zA-Z0-9]/g, "").length > 1) {
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
          });
        }
        EditableManipulator.setRangeOn(newElement.parentElement!, [...newElement.parentElement?.childNodes!].indexOf(newElement) + 1);
      }
    });
  });
}
