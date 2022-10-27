interface FileEntryProps {
  keyNumber: Number;
  setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>;
  currentNoteName: string;
  name: string;
}

const FileEntry = ({
  keyNumber,
  currentNoteName,
  setCurrentNoteName,
  name,
}: FileEntryProps) => {
  return (
    <div
      key={keyNumber as React.Key}
      onClick={() => setCurrentNoteName(name)}
      className={
        currentNoteName === name ? "fileEntry selectedEntry" : "fileEntry"
      }
    >
      {name}
    </div>
  );
};

export default FileEntry;
