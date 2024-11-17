import React, { Children, createContext, useState } from "react";
import { useContext } from "react";

export const taskContext = createContext();

const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    // {
    //   taskListId: "123",
    //   taskName: "testTaskName",
    //   tasks: [
    //     {
    //       task: "New Task 1",
    //       note: "description for notes",
    //       isDone: false,
    //       createdAt: Date.now(),
    //       id: "123123",
    //     },
    //   ],
    //   userId: "12312",
    // },
  ]);
  return (
    <taskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </taskContext.Provider>
  );
};

export default TaskContextProvider;
