import {
  Box,
  IconButton,
  InputBase,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import React, { useContext, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { taskContext } from "../context/TaskContextProvider";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const TaskList = ({ tasks, tasksListId }) => {
  const [isEditMode, setIsEditMode] = useState(null);
  const { setTasks } = useContext(taskContext);
  const [updatedValue, setUpdatedValue] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const deleteTaskUrl =
    "https://task-board-backend-cbnz.onrender.com/task/delete";
  const updateTaskUrl =
    "https://task-board-backend-cbnz.onrender.com/task/update";
  function handleSelectedTask(id) {
    const currentTask = tasks.filter((task) => task.id == id);
    setCurrentTask(currentTask[0]);
    setUpdatedValue(currentTask[0].task);
    setIsEditMode(id);
  }

  function handleUpdateTask(type) {
    if (type == "edit") {
      console.log("IN EDIT TASK");
      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == tasksListId) {
            const updatedTasks = curTaskList.tasks.map((curTask) => {
              if (curTask.id == currentTask.id) {
                return {
                  ...curTask,
                  task: updatedValue,
                };
              } else {
                return curTask;
              }
            });
            console.log("UPDATED TASK", updatedTasks);
            return { ...curTaskList, tasks: [...updatedTasks] };
          } else {
            return curTaskList;
          }
        });
      });
      setIsEditMode(null);
      try {
        axios.post(updateTaskUrl, {
          tasksListId: tasksListId,
          task: { ...currentTask, task: updatedValue },
        });
      } catch (err) {
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
      setIsEditMode(null);
      try {
        axios.post(deleteTaskUrl, {
          tasksListId: tasksListId,
          task: { ...currentTask },
        });
      } catch (err) {
        console.log("Error updating the task", err);
      }
      setUpdatedValue("");
    }
  }

  return (
    <List>
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
                          variant="elavation"
                          elevation={4}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectedTask(task.id);
                          }}
                          sx={{
                            marginBottom: "10px",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          }}
                          key={task.id}
                        >
                          <ListItem sx={{}}>
                            {isEditMode == task.id ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <InputBase
                                  autoFocus
                                  fullWidth
                                  value={updatedValue}
                                  onChange={(e) =>
                                    setUpdatedValue(e.target.value)
                                  }
                                ></InputBase>
                                <IconButton
                                  sx={{ marginLeft: "auto" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTask("edit");
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  sx={{ marginLeft: "auto" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTask("delete");
                                  }}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Box>
                            ) : (
                              task.task
                            )}
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

export default TaskList;
