import ReactDOM from "react-dom/client";
import "highlight.js/styles/github-dark.css";
import "./index.css";
import "./";
import reportWebVitals from "./reportWebVitals";
import ReactLoader from "./components/ReactLoader";
import "./Dialog.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<ReactLoader />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
