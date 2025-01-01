import React, { createContext, useState } from "react";
export const globalStateContext = createContext();
const GlobalStateContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  return (
    <globalStateContext.Provider value={{ mode, setMode }}>
      {children}
    </globalStateContext.Provider>
  );
};

export default GlobalStateContextProvider;
