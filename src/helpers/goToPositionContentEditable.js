export default function goToPositionContentEditable(contentEditableElement)
{
    var range,selection;

        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        console.log(contentEditableElement.lastChild.firstChild)
        range.setStart(contentEditableElement.lastChild.lastChild, 1)
        range.collapse(true);
        selection = window.getSelection();
        selection.removeAllRanges();
        console.log(selection)
        selection.addRange(range);

}