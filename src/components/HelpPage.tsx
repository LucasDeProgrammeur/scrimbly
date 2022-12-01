interface helpProps {
  setHelpOpen: any;
}

const HelpPage = ({ setHelpOpen }: helpProps) => {
  return (
    <div className="helpPage" >
      <button onClick={() => setHelpOpen(false)}>Close</button>
      <h1>Help</h1>
      <h2>Welcome to Scrimbly, the markdown note editor!</h2>
      <p>Read this manual to make use of all the features it has to offer.</p>
      <h3>Concept</h3>
      <p>
        Scrimbly is an application where you edit, save and read all notes
        within the app. Note names can be edited, and notes can be deleted as
        well. Notes can be exported and imported for sharing, or as a back-up.
        It works by using syntax to make your notes more organized and prettier.
      </p>
      <h3>Line Syntax</h3>
      <ul>
        <li>
          <b>-!</b> : Main heading
        </li>
        <li>
          <b>-@</b> : Sub-heading
        </li>
        <li>
          <b>-#</b> : Sub-sub-heading
        </li>
        <li>
          <b>-cb</b> : Checkbox
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
      </ul>
    </div>
  );
};
export default HelpPage;
