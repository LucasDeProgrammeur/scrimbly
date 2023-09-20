import { useEffect, useRef, useState } from "react";
import { EntryBarResult } from "../types/types";

interface EntryBarProps {
  defaultText: string;
  setEntryBarToggle: React.Dispatch<React.SetStateAction<boolean>>;
  fireAction: any;
}
const EntryBar: React.FunctionComponent<EntryBarProps> = ({
  defaultText,
  fireAction,
  setEntryBarToggle
}: EntryBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const focusRef = useRef(null)

  useEffect(() => {
    const currentRef = focusRef.current as unknown as HTMLElement;
    if (currentRef) {
      currentRef.focus();
      let range = document.createRange()
      range.setStart(currentRef, 0)
    }
  }, [focusRef]);

  return (
    <div className="entryBar" id="entryBar">
      <input
      ref={focusRef}
      tabIndex={100}
        className="entryBarInput"
        onKeyDown={(e) => {

          const target = e.target as HTMLInputElement;
          if (e.key === "Enter") {
            e.preventDefault();
            let actionResult = fireAction(target.value);


            if (actionResult=== EntryBarResult.SUCCESS) setEntryBarToggle(false)
          }
          if (e.key === "Escape") {
            setEntryBarToggle(false);
          }
        }}
        placeholder={defaultText}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default EntryBar;
