interface noteData {
  notes: Array<{name: string; content: string;}>;
}

type noteList = Array<note>

interface note  {name: string; content: string;};


export type { noteList, noteData, note};
