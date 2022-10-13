import { useEffect } from "react";
import { getData, removeNote } from "../helpers/io/storageFunctions";

interface LeftMenuProps {
  setEntrybarToggle: any;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  fetchedNotes: Array<object>;
  setFetchedNotes: any;
}

const LeftMenu = ({
  setEntrybarToggle,
  setCurrentNoteName,
  currentNoteName,
  fetchedNotes,
  setFetchedNotes
}: LeftMenuProps) => {
  useEffect(() => {
    if (!fetchedNotes.length) setFetchedNotes(getData().notes);
  }, []);

  return (
    <div className="leftMenu">
      <div className="topBar">
        <button onClick={() => setEntrybarToggle(true)}>&#xE710;</button>
        <button
          onClick={ () => {
            let newValue = removeNote(currentNoteName)
            setFetchedNotes(newValue.notes);
          }}
        >
          &#xE74D;
        </button>
        <button>&#xE897;</button>
      </div>
      <div className="fileList">
        { 
          fetchedNotes.map(
            (e, i) => {
              if (e.name === currentNoteName) {
                return (
                  <div
                    key={i}
                    onClick={() => setCurrentNoteName(e.name)}
                    className="fileEntry selectedEntry"
                  >
                    {e.name}
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  onClick={() => setCurrentNoteName(e.name)}
                  className="fileEntry"
                >
                  {e.name}
                </div>
              );
            },
            
          )}
      </div>
    </div>
  );
};

export default LeftMenu;
