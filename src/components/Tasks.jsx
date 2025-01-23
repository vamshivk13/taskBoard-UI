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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { taskContext } from "../context/TaskContextProvider";
import EditIcon from "@mui/icons-material/Edit";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { DELETE_TASK_URL, UPDATE_TASK } from "../constants/api";
import fetchRequest from "../api/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";
const Tasks = ({ tasks, tasksListId }) => {
  const [isTaskEditMode, setIsTaskEditMode] = useState(null);
  const { setTasks } = useContext(taskContext);
  const [updatedValue, setUpdatedValue] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const { mode } = useContext(globalStateContext);
  const textFieldRef = useRef(null);

  function handleSelectedTask(id) {
    const currentTask = tasks.filter((task) => task.id == id);
    setCurrentTask(currentTask[0]);
    setUpdatedValue(currentTask[0].task);

    setIsTaskEditMode(id);
  }

  function handleUpdateTask(type) {
    if (type == "edit") {
      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == tasksListId) {
            const updatedTasks = curTaskList.tasks.map((curTask) => {
              if (
                curTask.id == currentTask.id &&
                curTask.task != updatedValue
              ) {
                return {
                  ...curTask,
                  task: updatedValue,
                };
              } else {
                return curTask;
              }
            });
            return { ...curTaskList, tasks: [...updatedTasks] };
          } else {
            return curTaskList;
          }
        });
      });
      setIsTaskEditMode(null);
      try {
        if (currentTask.task != updatedValue)
          fetchRequest(UPDATE_TASK, {
            tasksListId: tasksListId,
            task: { ...currentTask, task: updatedValue },
          });
      } catch (err) {
        // handleError({
        //   title: "Unable to update your tasks",
        //   message: err.response.data,
        // });
        console.log("Error updating the task", err);
      }
      setUpdatedValue("");
    } else if (type == "delete") {
      console.log("IN DELETE TASK");
      setTasks((lists) => {
        return lists.map((curTaskList) => {
          if (curTaskList.tasksListId == tasksListId) {
            const updatedTasks = curTaskList.tasks.filter(
              (curTask) => curTask.id != currentTask.id
            );
            console.log("UPDATED TASK", updatedTasks);
            return { ...curTaskList, tasks: [...updatedTasks] };
          } else {
            return curTaskList;
          }
        });
      });
      setIsTaskEditMode(null);
      try {
        fetchRequest(DELETE_TASK_URL, {
          tasksListId: tasksListId,
          task: { ...currentTask },
        });
      } catch (err) {
        handleError({
          title: "Unable to update tasks",
          message: err.response.data,
        });
        console.log("Error updating the task", err);
      }
      setUpdatedValue("");
    }
  }
  console.log("RENDERED");
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
                              // height: "40px",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {isTaskEditMode == task.id ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                                component={"form"}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleUpdateTask("edit");
                                }}
                              >
                                <TextField
                                  sx={{
                                    boxSizing: "border-box",
                                    padding: 0,
                                    lineHeight: "1rem",
                                    fontSize: "1rem",
                                    letterSpacing: "0",
                                    "& .MuiInputBase-root": {
                                      padding: 0,
                                      lineHeight: "1rem",
                                      letterSpacing: 0,
                                      fontSize: "16px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                  }}
                                  fullWidth
                                  autoFocus
                                  multiline
                                  inputRef={textFieldRef}
                                  value={updatedValue}
                                  onChange={(e) => {
                                    setUpdatedValue(e.target.value);
                                  }}
                                  onBlur={() => {
                                    setIsTaskEditMode(null);
                                    handleUpdateTask("edit");
                                  }}
                                  onFocus={(e) => {
                                    textFieldRef.current =
                                      e.target.setSelectionRange(
                                        updatedValue.length,
                                        updatedValue.length
                                      );
                                  }}
                                ></TextField>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  lineHeight: "1rem",
                                  fontSize: "16px",
                                  wordBreak: "break-word",
                                }}
                              >
                                {task.task}
                              </Box>
                            )}
                            {/* <IconButton
                              sx={{
                                marginLeft: "auto",
                                padding: 0,
                                display: "none",
                                position: "absolute",
                                right: 0,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateTask("delete");
                              }}
                            >
                              <DeleteOutlineIcon />
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
