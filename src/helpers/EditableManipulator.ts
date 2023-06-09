import hljs from "highlight.js";
import checkForInlineFormatting from "./checkForFormatting";
import checkForLineFormatting from "./checkForLineFormatting";

class EditableManipulator {
  static createDefaultElements(e: React.KeyboardEvent<Element>) {
    let target = e.target as HTMLElement;
    let node = this.getNodeContentEditable();
    let newEl = document.createElement("div");

    let newBreakLine = document.createElement("br");
    newEl.appendChild(newBreakLine);

    switch (e.key) {
      case "Backspace":
        console.log(target.childNodes.length);
        if (target.childNodes.length <= 0) {
          target.appendChild(newEl);
        }
        break;
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
          let selection = window.getSelection();
          let range = selection!.getRangeAt(0);

          let codeEnter = document.createElement("br");
          console.log(this.getNodeContentEditable());
          console.log(document.getSelection());
          // node.insertBefore(
          //   codeEnter,
          //   document.getSelection()?.anchorNode!.nextSibling!
          // );
          range.insertNode(codeEnter);
          range.setStartAfter(codeEnter);
          range.setEndAfter(codeEnter);
          this.setRangeOn(codeEnter, 0);

          selection!.removeAllRanges();
          selection!.addRange(range);
          //node.insertBefore(codeEnter, document.getSelection()?.getRangeAt(0))
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

    // checkForEmptyElements(target)
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

  static SyntaxHighlightCodeBlocks(children: Array<Element>) {
    const editableChildren = children
      .map((x) => {
        return [...x.children].filter((x) => x.nodeName === "CODE");
      })
      .filter((x) => x !== undefined);

    const editableChildrenFlat = ([] as Element[]).concat(...editableChildren);

    const selection = window.getSelection();
    let range = null;
    try {
      range = selection!.getRangeAt(0);
    } catch {
      return;
    }
    const focusNode = selection?.focusNode;
    const focusOffset = selection?.focusOffset;
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    editableChildrenFlat.forEach((x) => {
      const innerHTMLCodeblock = x.innerHTML;
      console.log(innerHTMLCodeblock);
      hljs.highlightElement(x as HTMLElement);
    });
  }

  static SyntaxHighlightCodeBlocksNew(e: Event) {
    debugger;
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
