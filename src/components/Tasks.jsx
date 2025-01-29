import {
  Box,
  Button,
  IconButton,
  InputBase,
  List,
  ListItem,
  Paper,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { taskContext } from "../context/TaskContextProvider";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { DELETE_TASK_URL, UPDATE_TASK } from "../constants/api";
import fetchRequest from "../api/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import TaskActionDialog from "./dialog/TaskActionDialog";
const Tasks = ({ tasks, tasksListId }) => {
  // const [isTaskEditMode, setIsTaskEditMode] = useState(null);
  const [isTaskActionMode, setIsTaskActionMode] = useState(false);
  // const [updatedValue, setUpdatedValue] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const { mode } = useContext(globalStateContext);
  const textFieldRef = useRef(null);

  function handleSelectedTask(id) {
    const currentTask = tasks.filter((task) => task.id == id);
    setCurrentTask(currentTask[0]);
    // setUpdatedValue(currentTask[0].task);
    // setIsTaskEditMode(id);
    setIsTaskActionMode(true);
  }

  return (
    <List
      sx={{
        padding: "0",
        // maxHeight: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <TaskActionDialog
        taskId={currentTask?.id}
        tasksListId={tasksListId}
        isOpen={isTaskActionMode}
        handleClose={() => {
          setIsTaskActionMode(false);
          setCurrentTask(null);
        }}
      />
      <Droppable key={tasksListId} droppableId={tasksListId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => {
              return (
                <div key={task.id}>
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Paper
                          variant="elevation"
                          elevation={1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectedTask(task.id);
                          }}
                          sx={{
                            marginBottom: "10px",
                            background: mode == "light" ? "#e9e9e6" : "#3e3e3e",
                            boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                          }}
                          key={task.id}
                        >
                          <ListItem
                            sx={{
                              position: "relative",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              "&:hover .hidden-button": {
                                display: "block",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                lineHeight: "1rem",
                                fontSize: "16px",
                                wordBreak: "break-word",
                              }}
                            >
                              {task.task}
                            </Box>
                            {/* <IconButton
                              className="hidden-button"
                              sx={{
                                display: "none",
                                height: "50%",
                                position: "absolute",
                                right: 0,
                                alignItems: "center",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateTask("delete", task.id);
                              }}
                            >
                              <HighlightOffIcon />
                            </IconButton> */}
                          </ListItem>
                        </Paper>
                      </div>
                    )}
                  </Draggable>
                </div>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </List>
  );
};

export default Tasks;
