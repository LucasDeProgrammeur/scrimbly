import scrimblyImg from "../img/scrimblyimg.gif";
import optionBar from "../img/optionbar.png";

interface helpProps {
  setHelpOpen: any;
  helpOpen: boolean;
}

const HelpPage = ({ setHelpOpen, helpOpen }: helpProps) => {
  return (
    <div className={helpOpen ? "helpPage" : "helpPage disabled"}>
      <div className="shadowElement"></div>
      <button className="actionButton" onClick={() => setHelpOpen(false)}>
        &#xE8BB;
      </button>
      <h1>Help</h1>
      <h2>Welcome to Scrimbly, the markdown note editor!</h2>
      <p>Read this manual to make use of all the features it has to offer.</p>
      <h3>Concept</h3>
      <img src={scrimblyImg} alt="Scrimbly showcase" />
      <p>
        Scrimbly is an application where you edit, save and read all notes
        within the app. Note names can be edited, and notes can be deleted as
        well. Notes can be exported and imported for sharing, or as a back-up.
        It works by using syntax to make your notes more organized and prettier.
        Opening a note opens a tab. Tabs can be moved around and closed.
      </p>
      <h3>New feature: the Optionbar</h3>
      <img src={optionBar} />
      <p>
        Want to perform actions quickly? Press <strong>Ctrl+Shift+P</strong>,
        and bring up a range of options to choose from. Search through them with
        the search bar, and use the arrow keys (or mouse) to navigate.
      </p>
      <h3>Line Syntax</h3>
      <ul>
        <li>
          <b>#</b> : Main heading
        </li>
        <li>
          <b>##</b> : Sub-heading
        </li>
        <li>
          <b>###</b> : Sub-sub-heading
        </li>
        <li>
          <b>-s</b> : Strikethrough (whole line)
        </li>
        <li>
          <b>-cb</b> : Checkbox
        </li>
        <li>
          <b>``</b> : Code block (use Shift+Enter for newline in a codeblock)
        </li>
      </ul>
      <h3>Inline syntax (with the word "text" as example)</h3>
      <ul>
        <li>
          <b>*text*</b> : Bold text
        </li>
        <li>
          <b>_text_</b> : Italic text
        </li>
        <li>
          <b>~text~</b> : Strikethrough
        </li>
      </ul>
      <h3>Other supported elements</h3>
      <p>This app supports pasting images</p>
      <p></p>
    </div>
  );
};
export default HelpPage;
