import setEndOfContenteditable from "./setEndofContenteditable"


export default function insertHTMLNode (editable: Element, content: string, nodeType: string, event: React.KeyboardEvent<HTMLDivElement>, setContent: any) {
event.preventDefault();
console.log("hi")
setContent(content.substring(0, content.length - 3) + "h");
editable.innerHTML = editable.innerHTML.substring(0, editable.innerHTML.length - 2)
let newElement = document.createElement(nodeType);
document.getElementsByClassName("editable")[0].appendChild(newElement);
editable.lastChild?.previousSibling?.remove();
newElement.textContent = "- "
setEndOfContenteditable(event.target)
}

