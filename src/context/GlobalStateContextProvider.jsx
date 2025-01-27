import React, { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
export const globalStateContext = createContext();
const GlobalStateContextProvider = ({ children }) => {
  const { value, setLocalStorageValue } = useLocalStorage("mode", "light");
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [isInitialLoadingDone, setIsInitialLoadingDone] = useState(false);
  return (
    <globalStateContext.Provider
      value={{
        mode: value,
        setMode: setLocalStorageValue,
        isSideBarOpen: isSideBarOpen,
        setIsSideBarOpen: setIsSideBarOpen,
        setCurrentBoard,
        currentBoard: currentBoard,
        setIsInitialLoadingDone,
        isInitialLoadingDone,
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export default GlobalStateContextProvider;
