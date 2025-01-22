import React, { useContext, useState } from "react";
import TaskList from "./Tasks";
import {
  Box,
  Card,
  CardContent,
  createTheme,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import { taskContext } from "../context/TaskContextProvider";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import fetchRequest from "../api/api";
import { CREATE_TASK, UPDATE_LIST } from "../constants/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListOptionMenu from "./menu/ListOptionMenu";

const BoardList = ({ task }) => {
  const [isTaskNameEditMode, setIsTaskNameEditMode] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTask, setNewTask] = useState("");
  const [listOptionMenuAnchor, setListOptionMenuAnchor] = useState(null);

  const { setTasks } = useContext(taskContext);

  async function handleAddingNewTask(e) {
    e.preventDefault();
    if (e.target.value == "") {
      return;
    }
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

  function handleListOptionMenu(e) {
    e.stopPropagation();
    setListOptionMenuAnchor(e.currentTarget);
  }

  return (
    <Box
      sx={{
        display: "block",
        minWidth: "400px",
        maxWidth: "400px",
        width: "400px",
        height: "calc(100% - 50px)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ height: "100%" }}>
        <Card
          sx={{
            display: "flex",
            maxHeight: "100%",
            borderRadius: "14px",
          }}
        >
          <CardContent
            sx={{
              ":last-child": { paddingBottom: "5px" },
              flex: 1,
              boxSizing: "border-box",
              maxWidth: "400px",
              maxHeight: "100%",
              display: "flex",
              padding: "12px",
              paddingTop: "5px",
              flexDirection: "column",
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setIsTaskNameEditMode(task.tasksListId);
                setNewTaskName(task.taskName);
              }}
              sx={{
                minHeight: "50px",
                // background: "red",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isTaskNameEditMode == task.tasksListId ? (
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    padding: "0",
                    margin: 0,
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
                    sx={{
                      fontSize: "1.2rem",
                      padding: "3px 5px",
                      borderRadius: "5px",
                      border: "1px solid #F0EAD6",
                    }}
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
                <Typography sx={{ fontSize: "1.2rem", padding: "3px 5px" }}>
                  {task.taskName}
                </Typography>
              )}
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={handleListOptionMenu}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <TaskList tasks={task.tasks} tasksListId={task.tasksListId} />
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
      </Box>
      <ListOptionMenu
        listId={task.tasksListId}
        anchor={listOptionMenuAnchor}
        handleClose={() => setListOptionMenuAnchor(null)}
      />
    </Box>
  );
};

export default BoardList;
