import { Dispatch, useEffect, useRef } from "react";
import OpenAIImg from "../img/openai.png";

interface OptionBarProps {
    setOptionBarOpen: any
}

const OptionBar = ({setOptionBarOpen}:OptionBarProps) => {
    const focusRef = useRef(null)

    const optionBarOptions = [
        {description: "Export note", icon: '\u{E78C}'},
        {description: "Import note", icon: '\u{E8E5}'},
        {description: "Delete note", icon: '\u{E74D}'},
        {description: "Help", icon: "\uE897"}
    ]

    useEffect(() => {
      const currentRef = focusRef.current as unknown as HTMLElement;
      if (currentRef) {
        currentRef.focus();
        let range = document.createRange()
        range.setStart(currentRef, 0)
      }
    }, [focusRef]);
  


   return  (<div className="optionBar">
        <input type="text" ref={focusRef} onKeyDown={e => {if (e.key === "Escape" || e.ctrlKey && e.shiftKey && e.key === "P") setOptionBarOpen(false)}}></input>
        <div className="optionBarOptions">
            <ul>
                {optionBarOptions.map(e => {
                    return (<li><p>{e.icon}</p><p>{e.description}</p></li>)
                })}
                <li><img src={OpenAIImg}/><p>OpenAI autocomplete note</p></li>
            </ul>
        </div>
    </div>)
}

export default OptionBar;