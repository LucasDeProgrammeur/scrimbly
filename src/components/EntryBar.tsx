import { useState } from "react";

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
  return (
    <div className="entryBar" id="entryBar">
      <input
      className="entryBarInput"
        onKeyUp={(e) => {
          
          const target = e.target as HTMLInputElement;
          if (e.key === "Enter") {
            e.preventDefault();
            fireAction(target.value);
            setEntryBarToggle(false)
            
          }
          if (e.key === "Escape") {
            setEntryBarToggle(false);
          }
        }}
        autoFocus
        placeholder={defaultText}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default EntryBar;
