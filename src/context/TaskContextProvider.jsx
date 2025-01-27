import React, { Children, createContext, useState } from "react";
import { useContext } from "react";

export const taskContext = createContext();

const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  return (
    <taskContext.Provider value={{ tasks, setTasks, boards, setBoards }}>
      {children}
    </taskContext.Provider>
  );
};

export default TaskContextProvider;
