import { SnackbarProvider } from "notistack";
import React from "react";
import App from "../App";

const ReactLoader = () => {
  return (
    <React.StrictMode>
      <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
        <App />
      </SnackbarProvider>
    </React.StrictMode>
  );
};

export default ReactLoader;
