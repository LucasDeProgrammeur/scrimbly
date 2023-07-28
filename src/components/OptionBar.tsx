import { Dispatch, useContext, useEffect, useRef, useState } from "react";
import OpenAIImg from "../img/openai.png";
import { enqueueSnackbar } from "notistack";
import { deleteNote, importNote, newNote } from "../helpers/actionFunctions";
import { CurrentNoteName, CurrentTabs } from "../App";

interface OptionBarProps {
  setOptionBarOpen: any;
  noteNames: string[];
  setNoteNames: React.Dispatch<React.SetStateAction<string[]>>;
  entryBarProps: any;
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const OptionBar = ({
  setOptionBarOpen,
  noteNames,
  setNoteNames,
  entryBarProps,
  setHelpOpen,
}: OptionBarProps) => {
  const focusRef = useRef(null as unknown as HTMLElement);
  const handleTabSwitchWithArrowKeys = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const target = e.target as HTMLElement;
      let nextSibling =
        e.key === "ArrowDown"
          ? (target.nextElementSibling as HTMLElement)
          : (target.previousElementSibling as HTMLElement);

      if (nextSibling && nextSibling.className === "optionBarOptions") {
        nextSibling = nextSibling.firstChild?.firstChild as HTMLElement;
      }

      if (!nextSibling) {
        nextSibling = document.getElementsByClassName(
          "inputBar"
        )[0] as HTMLElement;
      }

      setFocusedElement(nextSibling);
    }
  };

  const [currentNoteName, setCurrentNoteName] = useContext(CurrentNoteName);
  const [currentTabs, setCurrentTabs] = useContext(CurrentTabs);
  const [inputValue, setInputValue] = useState("");
  const [focusedElement, setFocusedElement] = useState(
    null as unknown as HTMLElement
  );
  const optionBarOptions = [
    {
      description: "Export note",
      icon: "\u{E78C}",
      action: () => {
        window.controls.export().then(() => {
          enqueueSnackbar("Data exported");
        });
      },
      needsCurrentNote: false
    },
    {
      description: "Import note",
      icon: "\u{E8E5}",
      action: () => importNote(setNoteNames),
      needsCurrentNote: false
    },
    {
      description: "Delete current note",
      icon: "\u{E74D}",
      action: () =>
        deleteNote(
          noteNames,
          setNoteNames,
          setCurrentTabs,
          setCurrentNoteName,
          currentNoteName,
          currentTabs
        ),
        needsCurrentNote: true
    },
    { description: "Help", icon: "\uE897", action: () => setHelpOpen(true) },
    {
      description: "OpenAI Note Autocomplete (not yet available)",
      icon: OpenAIImg,
      action: () => {},
      needsCurrentNote: true
    },
    {
      description: "New note",
      icon: "\u{E710}",
      action: () => {
        newNote(
          entryBarProps,
          noteNames,
          setNoteNames,
          setCurrentNoteName,
          setCurrentTabs,
          currentTabs
        );
      },
      needsCurrentNote: false
    },
  ];

  useEffect(() => {
    const currentRef = focusRef.current as unknown as HTMLElement;
    if (currentRef) {
      currentRef.focus();
      let range = document.createRange();
      range.setStart(currentRef, 0);
    }
    setFocusedElement(focusRef.current);
  }, [focusRef.current]);

  useEffect(() => {
    focusedElement && focusedElement.focus();
  }, [focusedElement]);

  const handleOptionBarShortcuts = (
    e: React.KeyboardEvent<any>,
    action: any = null
  ) => {
    if (e.key === "Escape" || (e.ctrlKey && e.shiftKey && e.key === "P")) {
      setOptionBarOpen(false);
    }

    if (action && e.key === "Enter") {
      action();
      setOptionBarOpen(false)
    }
  };

  return (
    <div
      className="optionBar"
      onKeyDown={(e) =>
        handleTabSwitchWithArrowKeys(e as unknown as KeyboardEvent)
      }
    >
      <input
        type="text"
        class="inputBar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ref={focusRef}
        onKeyDown={(e) => handleOptionBarShortcuts(e)}
      ></input>
      <div className="optionBarOptions">
        <ul>
          {optionBarOptions
            .filter((e) =>
              e.description.toLowerCase().includes(inputValue.toLowerCase())
              && !e.needsCurrentNote || e.needsCurrentNote && currentNoteName 
            )
            .map((el, i) => {
              return (
                <li
                  onKeyDown={(e) => {
                    handleOptionBarShortcuts(e, el.action);
                  }}
                  tabIndex={i + 2}
                  onClick={() => {
                    el.action!();
                    setOptionBarOpen(false);
                  }}
                  key={el.description + i.toString()}
                >
                  {el.icon.includes(".") ? (
                    <img src={el.icon} />
                  ) : (
                    <p>{el.icon}</p>
                  )}
                  <p>{el.description}</p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default OptionBar;
