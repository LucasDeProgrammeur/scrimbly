const setRangeAfter = (newElement: HTMLElement, rangeSetter = 0) => {
  let range = document.createRange();
  // range.setStartAfter(newElement);
  if (rangeSetter > 0) {
    range.setStart(newElement, rangeSetter)
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    return;
  }
    
  range.setStart(newElement.nextSibling!, 1);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
};


const setRangeOn = (newElement: HTMLElement, rangeSetter = 1) => {
  let range = document.createRange();
  // range.setStartAfter(newElement);

  range.setStart(newElement, rangeSetter);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
}

export { setRangeAfter, setRangeOn };

