import * as React from "react";

const WindowBar = () => {
  let [maximized, setMaximized] = React.useState(false);
  return (
    <div className="windowBarContainer">
      <div className="draggable">
        <p>Notes development build</p>
      </div>
      <div className="windowControls">
        <button onClick={() => controls.minimize()} id="minimize">
          &#xE921;
        </button>
        <button
          onClick={() => {
            maximized ? controls.restore() : controls.maximize();
            setMaximized(!maximized);
          }}
          id="maximize"
        >
          {maximized ? "" : ""}
        </button>
        <button onClick={() => controls.close()} id="close">
          &#xE8BB;
        </button>
      </div>
    </div>
  );
};

export default WindowBar;
