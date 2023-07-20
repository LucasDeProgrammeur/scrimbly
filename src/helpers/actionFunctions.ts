import { enqueueSnackbar } from "notistack";
import { CurrentTabs } from "../App";


const importNote = async (setNoteNames: React.Dispatch<React.SetStateAction<string[]>>) => {
    let data = await window.controls.import();
    if (!data) {
        enqueueSnackbar("Scrimbly was unable to import these notes");
        return;
    }
    setNoteNames(data);
    enqueueSnackbar("Data imported");
}


const deleteNote = (noteNames: string[],
    setNoteNames: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentTabs: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>,
    currentNoteName: string,
    currentTabs: string[]) => {
    setNoteNames(noteNames.filter((x) => x !== currentNoteName));
    setCurrentTabs(currentTabs.filter((x) => x !== currentNoteName))
    setCurrentNoteName("");
    window.dbConnection.deleteOneByName(currentNoteName);
}

const newNote = (
    entryBarProps: any, noteNames: string[],
    setNoteNames: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrentNoteName: React.Dispatch<React.SetStateAction<string>>,
    setCurrentTabs: React.Dispatch<React.SetStateAction<string[]>>,
    currentTabs: string[]) => {
    entryBarProps.setEntryBarOpen(true);
    entryBarProps.setEntryBarDefaultText("Enter a new note name...");
    entryBarProps.setEntryBarAction(() => async (newNoteName: string) => {
        if (
            noteNames.length &&
            noteNames.findIndex((e) => e === newNoteName) !== -1
        ) {
            enqueueSnackbar("Note name already exists", { variant: "error" })
            return;
        }
        setNoteNames([...noteNames, newNoteName]);
        await window.dbConnection.insert(newNoteName, "<div><br></div>");
        setCurrentNoteName(newNoteName);
        entryBarProps.setEntryBarOpen(false);
        setCurrentTabs([...currentTabs, newNoteName])
    })
}

export { newNote, importNote, deleteNote }