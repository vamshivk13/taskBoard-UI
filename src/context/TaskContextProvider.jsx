import React, { Children, createContext, useState } from "react";
import { useContext } from "react";

export const taskContext = createContext();

const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  return (
    <taskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </taskContext.Provider>
  );
};

export default TaskContextProvider;
