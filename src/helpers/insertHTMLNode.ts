import goToPositionContentEditable from "./goToPositionContentEditable";

export default function insertHTMLNode(
  editable: Element,
  content: string,
  nodeType: string,
  event: React.KeyboardEvent<HTMLDivElement>,
  setContent: any
) {

  setContent(content.substring(0, content.length - 3) + "h");
  editable.innerHTML = editable.innerHTML.substring(
    0,
    editable.innerHTML.length - 2
  );
  let newElement = document.createElement(nodeType);

//   let child = document
//     .getElementsByClassName("editable")[0]
//     .appendChild(newElement);

    // console.log("range: ");
    // console.log(range);   
    // range?.getRangeAt(0).insertNode(newElement);

  //child.previousSibling!.remove();

  

  let children = editable.querySelectorAll("div");

  children.forEach(e => {

    if (e.innerHTML.includes("-!")) { e.remove();}
  })

    let child = editable.appendChild(newElement);

  
  

  newElement.textContent = "- ";
  //goToPositionContentEditable(editable);
}
