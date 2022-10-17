const setRangeAfter = (newElement: HTMLElement) => {
  let range = document.createRange();
//   console.log(
//     getLengthChars(
//       Array.prototype.indexOf.call(
//         newElement.parentElement?.children,
//         newElement
//       ),
//       newElement.parentElement?.children.length
//     )
//   );
console.log(newElement)
  range.setStart(
    newElement,
    1
  );
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
};

const getLengthChars = (newSiblingIndex: number, children: HTMLCollection) => {
  let count = 0;
  for (let i = 0; i <= newSiblingIndex; i++) {
    count ++;
  }

  return count;
};

export default setRangeAfter;
