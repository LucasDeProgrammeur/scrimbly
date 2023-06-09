// import getNodeContentEditable from "./getNodeContentEditable";

// const setRangeAfter = (newElement: HTMLElement, rangeSetter = 0) => {
//   let range = document.createRange();
//   if (rangeSetter > 0) {
//     range.setStart(newElement, rangeSetter)
//     window.getSelection()?.removeAllRanges();
//     window.getSelection()?.addRange(range);
//     return;
//   }

//   range.setStart(newElement.nextSibling!, 1);
//   window.getSelection()?.removeAllRanges();
//   window.getSelection()?.addRange(range);
// };

// // Put cursor on exact element. rangeSetter determining where in the text
// const setRangeOn = (newElement: HTMLElement, rangeSetter = 1) => {
//   let range = document.createRange();
//   range.setStart(newElement, rangeSetter);
//   window.getSelection()?.removeAllRanges();
//   window.getSelection()?.addRange(range);
// }

// const isRangeAtEnd = () => {
//   let selection = window.getSelection();
//   let bool = selection?.anchorNode!.textContent?.length === selection?.anchorOffset && !selection?.anchorNode?.parentElement!.nextSibling;
//   return bool;
// }

// export { setRangeAfter, setRangeOn, isRangeAtEnd };
