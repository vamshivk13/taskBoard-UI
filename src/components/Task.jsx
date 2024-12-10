import React, { useContext, useState } from "react";
import TaskList from "./TaskList";
import {
  Box,
  Card,
  CardContent,
  createTheme,
  IconButton,
  InputBase,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import { taskContext } from "../context/TaskContextProvider";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import fetchRequest from "../api/api";
import { CREATE_TASK, UPDATE_LIST } from "../constants/api";

const Task = ({ task }) => {
  const [isTaskNameEditMode, setIsTaskNameEditMode] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTask, setNewTask] = useState("");

  const { setTasks } = useContext(taskContext);
  async function handleAddingNewTask(e) {
    e.preventDefault();
    const id = uuid();
    const newTaskToAdd = {
      task: newTask,
      isDone: false,
      createdAt: Date.now(),
      note: "",
      id: id,
    };
    setTasks((tasks) => {
      return tasks.map((curTaskList) => {
        if (curTaskList.tasksListId == task.tasksListId) {
          const updatedTasks = [...curTaskList.tasks, newTaskToAdd];
          return {
            ...curTaskList,
            tasks: updatedTasks,
          };
        } else {
          return curTaskList;
        }
      });
    });
    setNewTask("");
    try {
      const newSavedTask = await fetchRequest(CREATE_TASK, {
        task: newTaskToAdd,
        tasksListId: task.tasksListId,
      });
    } catch (err) {
      handleError({
        title: "Unable to save your tasks",
        message: err.response.data,
      });
      console.log("Error saving new task", err);
    }
  }

  async function handleUpdatingTaskList(type) {
    if (type == "edit") {
      setTasks((tasksLists) => {
        return tasksLists.map((curTaskList) => {
          if (curTaskList.tasksListId == task.tasksListId) {
            return {
              ...curTaskList,
              taskName: newTaskName,
            };
          } else {
            return curTaskList;
          }
        });
      });
      setIsTaskNameEditMode(null);
      try {
        const updatedSavedTask = await fetchRequest(UPDATE_LIST, {
          taskName: newTaskName,
          tasksListId: task.tasksListId,
        });
      } catch (err) {
        handleError({
          title: "Unable to save your tasks",
          message: err.response.data,
        });
        console.log("Error saving new task", err);
      }
      setNewTaskName("");
    }
  }
  const mode = "dark";
  const theme = createTheme({
    palette: {
      mode,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            padding: "!important 4px",
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#000000",
            boxShadow:
              mode === "dark"
                ? "0px 4px 10px rgba(0, 0, 0, 0.5)"
                : "0px 4px 10px rgba(0, 0, 0, 0.1)",
            border: mode === "dark" ? "1px solid #333" : "1px solid #ddd",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "!important 6px", // Applies padding to CardContent
          },
        },
      },
    },
  });

  return (
    <Box
      sx={{
        minWidth: "400px",
        height: "calc(100% - 50px)",
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: "5px",
      }}
    >
      <ThemeProvider theme={theme}>
        <Card
          sx={{
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              ":last-child": { paddingBottom: "5px" },
              height: "100%",
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setIsTaskNameEditMode(task.tasksListId);
                setNewTaskName(task.taskName);
              }}
              sx={{ height: "50px" }}
            >
              {isTaskNameEditMode == task.tasksListId ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  component={"form"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdatingTaskList("edit");
                  }}
                >
                  <InputBase
                    fullWidth
                    sx={{ fontSize: "1.4rem", padding: 0 }}
                    autoFocus
                    onBlur={(e) => {
                      setIsTaskNameEditMode(null);
                    }}
                    value={newTaskName}
                    onChange={(e) => {
                      setNewTaskName(e.target.value);
                    }}
                  />
                  <IconButton
                    sx={{ marginLeft: "auto", padding: 0, margin: 0 }}
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography sx={{ fontSize: "1.4rem", padding: 0 }}>
                  {task.taskName}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                height: "calc(100% - 120px)",
                overflow: "auto",
              }}
            >
              <TaskList tasks={task.tasks} tasksListId={task.tasksListId} />
            </Box>
            <Box
              component={"form"}
              sx={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                bottom: 0,
              }}
              onSubmit={handleAddingNewTask}
            >
              <IconButton type="submit">
                <AddIcon />
              </IconButton>
              <InputBase
                fullWidth
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="add new task"
              />
            </Box>
          </CardContent>
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export default Task;
