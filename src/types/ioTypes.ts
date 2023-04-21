interface noteData {
  notes: Array<{name: string; noteHTML: string;}>;
}

type noteList = Array<note>

interface note  {noteName: string; noteHTML: string;};


export type { noteList, noteData, note};
