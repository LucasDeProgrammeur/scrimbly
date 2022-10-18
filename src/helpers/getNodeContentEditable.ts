const  getNodeContentEditable = () => {
    var node = document.getSelection()?.anchorNode;
    return (node && node.nodeType === 3 ? node.parentNode : node);
 }

 export default getNodeContentEditable;

