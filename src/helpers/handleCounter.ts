const handleCounter = (target: HTMLElement, setCharAmount: any, setWordAmount: any) => {
    let text = target.innerText.replace(/\u200B/g, "");
    setCharAmount(text.length);
    setWordAmount(text.split(" ").length)
}

export default handleCounter;