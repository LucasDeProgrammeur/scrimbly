import { useEffect, useState } from "react";
import { getData, removeNote } from "../helpers/io/storageFunctions";

interface LeftMenuProps {
  setEntrybarToggle: any;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  fetchedNotes: React.Dispatch<React.SetStateAction<Array<object>>>;
  setFetchedNotes: any;
}

const LeftMenu = ({
  setEntrybarToggle,
  setCurrentNoteName,
  currentNoteName,
  fetchedNotes,
  setFetchedNotes
}: LeftMenuProps) => {
//   let [fetchedNotes, setFetchedNotes] = useState([
//     { name: "testname", content: "" },
//   ]);

  useEffect(() => {
    setFetchedNotes(getData().notes);
  }, []);

  console.log(getData().notes);
  return (
    <div className="leftMenu">
      <div className="topBar">
        <button onClick={() => setEntrybarToggle(true)}>&#xE710;</button>
        <button
          onClick={() => {
            removeNote(currentNoteName);
            setFetchedNotes(getData().notes);
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
            () => setDataChanged(false)
          )}
      </div>
    </div>
  );
};

export default LeftMenu;
