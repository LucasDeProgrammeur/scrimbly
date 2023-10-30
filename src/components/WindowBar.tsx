import * as React from "react";

const WindowBar = () => {
  let [maximized, setMaximized] = React.useState(false);
  return (
    <div className="windowBarContainer">
      <div className="draggable">
        <p>Scrimbly | Markdown note editor</p>
      </div>
      <div className="windowControls">
        <button tabIndex={-1} onClick={() => window.controls.minimize()} id="minimize">
          &#xE921;
        </button>
        <button
          tabIndex={-1}
          onClick={() => {
            maximized ? window.controls.restore() : window.controls.maximize();
            setMaximized(!maximized);
          }}
          id="maximize"
        >
          {maximized ? "" : ""}
        </button>
        <button tabIndex={-1} onClick={() => window.controls.close()} id="close">
          &#xE8BB;
        </button>
      </div>
    </div>
  );
};

export default WindowBar;
