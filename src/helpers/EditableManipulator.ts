import hljs from "highlight.js";

class EditableManipulator {
  static createDefaultElements(e: React.FormEvent<HTMLDivElement>) {
    let target = e.target as HTMLElement;
    let newEl = document.createElement("div");

    let newBreakLine = document.createElement("br");
    newEl.appendChild(newBreakLine);

    if (target.childNodes.length <= 0) {
      target.appendChild(newEl);
    }
  }



  static preventEditableBehavior(e: React.KeyboardEvent<Element>) {
    let target = e.target as HTMLElement;
    let node = this.getNodeContentEditable();
    let newEl = document.createElement("div");
    let newBreakLine = document.createElement("br");
    newEl.appendChild(newBreakLine);

    switch (e.key) {
      case "Enter":

        let parentElement = node!.parentElement;
        e.preventDefault();
        console.log(node?.nodeName);

        if (
          node?.nodeName === "CODE" ||
          node?.parentElement?.nodeName === "CODE"
        ) {
          if (!e.shiftKey) {
            e.preventDefault()
            let enter = document.createElement("div")
            let breakline = document.createElement("br")
            enter.appendChild(breakline)
            let parent = window.getSelection()?.anchorNode!.parentNode?.parentNode;
            console.log(window.getSelection()?.anchorNode!.parentNode?.parentNode?.nextSibling)
            target.insertBefore(enter, parent?.nextSibling!)
            this.setRangeOn(breakline, 0)
            return;
          }

          this.insertTextInCodeBlock("\n")
          return;
        }

        if (node?.nodeName !== "DIV") {
          node = parentElement;
        }

        if (!node?.nextSibling) {
          target.appendChild(newEl);
          this.setRangeOn(newEl);
          return;
        }
        target.insertBefore(newEl, node!.nextSibling);
        EditableManipulator.setRangeOn(node!.nextSibling as HTMLElement);
        break;
      case "Tab":

        if (
          node?.nodeName === "CODE" ||
          node?.parentElement?.nodeName === "CODE"
        ) {
          this.insertTextInCodeBlock("\t")
        }
        e.preventDefault();
        let newTabs = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
        EditableManipulator.setRangeAfter(newTabs as unknown as HTMLElement);
        break;
    }
  }

  static getNodeContentEditable() {
    var node = document.getSelection()?.anchorNode;
    return node && node.nodeType === node.TEXT_NODE ? node.parentNode : node;
  }

  // Put cursor on exact element. rangeSetter determining where in the text
  static setRangeOn(element: HTMLElement, rangeSetter = 1) {
    let range = document.createRange();
    range.setStart(element, rangeSetter);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }

  static isRangeAtEnd() {
    let selection = window.getSelection();
    let bool =
      selection?.anchorNode!.textContent?.length === selection?.anchorOffset &&
      !selection?.anchorNode?.parentElement!.nextSibling;
    return bool;
  }

  static setRangeAfter(element: HTMLElement, rangeSetter = 0) {
    let range = document.createRange();
    if (rangeSetter > 0) {
      range.setStart(element, rangeSetter);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      return;
    }
  }

  static handleKeyPress(e: React.KeyboardEvent) {
    const target = e.target as HTMLInputElement;

    // Replace any images with specialized image element
    EditableManipulator.generateImages([...target.children]);
    target.focus();
    let val = target?.innerHTML;
    return val;
  }

  static generateImages(children: Array<Element>) {
    const images = children.filter(
      (x: Element) => x.nodeName === "IMG" && x.className !== "imageFrame"
    );

    images.forEach((el) => {
      let newEl = document.createElement("div");
      newEl.setAttribute("class", "imageFrame");
      newEl.style.background = `url("${el.getAttribute("src")}") no-repeat`;
      newEl.style.backgroundSize = "100% 100%";
      newEl.style.height = el.clientHeight + "px" || "100px";
      newEl.style.width = el.clientWidth + "px" || "100px";
      newEl.setAttribute("contenteditable", "false");

      el.parentElement?.insertBefore(newEl, el);
      el.remove();
    });
  }

  static SyntaxHighlightCodeBlocks() {
    const target = this.getNodeContentEditable() as HTMLElement;
    const editable = document.getElementsByClassName("editable")[0]
    if (target?.nodeName !== "CODE") return;



    console.log("TRIGGERED")
    console.dir(target)

    let codeOverlay;
    if (!target.nextElementSibling?.className.includes("highlightOverlay")) {
      console.dir(target.children)
      codeOverlay = document.createElement("code")
      codeOverlay.classList.add("highlightOverlay")
      codeOverlay.setAttribute("contenteditable", "false")
      codeOverlay.setAttribute("tabindex", "-1")


      codeOverlay.addEventListener("keydown", (event) => {
        console.log("test")
        event.preventDefault();
      });

      codeOverlay.addEventListener("keypress", (event) => {
        event.preventDefault();
      });

      codeOverlay.addEventListener("paste", (event) => {
        event.preventDefault();
      });

      target.insertAdjacentElement('afterend', codeOverlay)
    } else {
      codeOverlay = target.nextElementSibling
    }
    codeOverlay.textContent = ""
    codeOverlay.textContent = target.textContent;
    codeOverlay.setAttribute("class", "highlightOverlay")
    hljs.highlightElement(codeOverlay as HTMLElement);
  }

  static insertTextInCodeBlock(textToInsert: string) {
    const codeContent = document.getSelection()?.anchorNode!.textContent;
    const offset = document.getSelection()?.anchorOffset!;
    const newString = codeContent?.substring(0, offset) + textToInsert + codeContent?.substring(offset, codeContent.length)
    let node = document.getSelection()?.anchorNode as Node;
    node.textContent = newString
    this.setRangeOn(node as HTMLElement, offset + 1)
    this.SyntaxHighlightCodeBlocks();
  }

  static SyntaxHighlightCodeBlocksNew(e: Event) {
    const target = e.target as HTMLInputElement;
    const innerHTMLCodeblock = target.innerHTML;
    console.log(innerHTMLCodeblock);
    hljs.highlightElement(target as HTMLElement);
  }

  static escapeHTML(html: string) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

export default EditableManipulator;
