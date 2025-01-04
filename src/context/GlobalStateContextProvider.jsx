import React, { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
export const globalStateContext = createContext();
const GlobalStateContextProvider = ({ children }) => {
  const { value, setLocalStorageValue } = useLocalStorage("mode", "light");

  return (
    <globalStateContext.Provider
      value={{ mode: value, setMode: setLocalStorageValue }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export default GlobalStateContextProvider;
