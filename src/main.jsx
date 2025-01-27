import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import GlobalStateContextProvider from "./context/GlobalStateContextProvider.jsx";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import TaskContextProvider from "./context/TaskContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <GlobalStateContextProvider>
    <AuthContextProvider>
      <TaskContextProvider>
        <App />
      </TaskContextProvider>
    </AuthContextProvider>
  </GlobalStateContextProvider>
  // </StrictMode>
);
