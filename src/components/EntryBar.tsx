import { getData } from "../helpers/io/storageFunctions";

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
  return (
    <div className="entryBar" id="entryBar">
      <input
      className="entryBarInput"
        onKeyDown={(e) => {
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
      ></input>
    </div>
  );
};

export default EntryBar;
