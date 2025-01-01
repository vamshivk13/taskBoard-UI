import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import GlobalStateContextProvider from "./context/GlobalStateContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStateContextProvider>
      <App />
    </GlobalStateContextProvider>
  </StrictMode>
);
