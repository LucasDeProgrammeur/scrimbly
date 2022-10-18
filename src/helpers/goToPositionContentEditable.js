export default function goToPositionContentEditable(contentEditableElement)
{
    var range,selection;
        console.log(contentEditableElement.lastChild.lastChild)
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.setStart(contentEditableElement.lastChild.lastChild, 0)
        range.collapse(true);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

}