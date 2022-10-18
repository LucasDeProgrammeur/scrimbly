const setRangeAfter = (newElement: HTMLElement) => {
  let range = document.createRange();
  // range.setStartAfter(newElement);

  range.setStart(newElement.nextSibling, 1);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
};


const setRangeOn = (newElement: HTMLElement) => {
  let range = document.createRange();
  // range.setStartAfter(newElement);

  range.setStart(newElement, 1);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
}

export { setRangeAfter, setRangeOn };
