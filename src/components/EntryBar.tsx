import { getData } from "../helpers/io/storageFunctions";

interface EntryBarProps {
  defaultText: string;
  setEntryBarToggle: React.Dispatch<React.SetStateAction<boolean>>;
  fireAction: any;
  fetchedNotes: Array<object>;
  setFetchedNotes: any;
}
const EntryBar: React.FunctionComponent<EntryBarProps> = ({
  defaultText,
  fireAction,
  setEntryBarToggle,
  fetchedNotes,
  setFetchedNotes,
}: EntryBarProps) => {
  return (
    <div className="entryBar" id="entryBar">
      <input
        onKeyDown={(e) => {
          const target = e.target as HTMLInputElement;
          if (e.key === "Enter") {
            e.preventDefault();
            fireAction(target.value);
            setEntryBarToggle(false);
            setFetchedNotes(getData().notes)
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
