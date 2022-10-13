import goToPositionContentEditable from "./goToPositionContentEditable";

export default function checkForLineFormatting(
  editable: Element,
  content: string,
  nodeType: string,
  event: React.KeyboardEvent<HTMLDivElement>,
  setContent: any
) {


  let elementTypes = [
    {syntax: "-!", element: "h1"},
    {syntax: "-@", element: "h2"},
    {syntax: "-#", element: "h3"},
    {syntax: "-cb", element: "input", elementType: "checkbox"}
  ];

  let newElement = document.createElement(nodeType);

  let children = editable.querySelectorAll("div");

  children.forEach(e => {

    elementTypes.forEach(typesE => {
      if (e.innerText === typesE.syntax) {
        e.innerText = "";
        let newElement = document.createElement(typesE.element);
        if (typesE.elementType !== null) newElement.setAttribute("type", "checkbox");
        newElement.innerHTML = "&#8203;";
        e.appendChild(newElement)
  
        let range = document.createRange();
        range.setStartAfter(newElement)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
      }
    })
  })
}
