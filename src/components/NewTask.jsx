import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useContext, useState } from "react";
import { taskContext } from "../context/TaskContextProvider";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { authContext } from "../context/AuthContextProvider";
import TaskList from "./TaskList";
import { useErrorBoundary } from "./useErrorBoundary";

const NewTask = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [listName, setListName] = useState("");
  const { setTasks } = useContext(taskContext);
  const { user } = useContext(authContext);
  const { handleError, ErrorModal } = useErrorBoundary();

  const createTaskListUrl =
    "https://task-board-backend-cbnz.onrender.com/task/create/list";

  async function handleAddingNewTaskList() {
    console.log("CLICKED");

    const newTaskList = {
      tasksListId: uuid(),
      userId: user.userId,
      tasks: [],
      taskName: listName,
    };
    setTasks((tasksList) => {
      return [...tasksList, newTaskList];
    });
    setListName("");
    setIsEditMode(false);
    try {
      console.log("TSAKLIST", newTaskList, user);
      const res = await axios.post(createTaskListUrl, newTaskList);
      handleError({
        title: "Unable to save your tasks",
        message: err.response.data,
      });
    } catch (err) {
      console.log("Error saving list", err);
    }
  }
  const mode = "dark";
  return (
    <Box
      sx={{
        minWidth: "400px",
      }}
    >
      <Paper
        sx={{
          overflow: "hidden",
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
          color: mode === "dark" ? "#ffffff" : "#000000",
          boxShadow:
            mode === "dark"
              ? "0px 4px 10px rgba(0, 0, 0, 0.5)"
              : "0px 4px 10px rgba(0, 0, 0, 0.1)",
          border: mode === "dark" ? "1px solid #333" : "1px solid #ddd",
        }}
      >
        <Box
          component={"form"}
          sx={{
            display: "flex",
            padding: "10px 10px",
            alignItems: "center",
            cursor: "pointer",

            // borderRadius: "10px",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddingNewTaskList();
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditMode(true);
          }}
        >
          {!isEditMode ? (
            <Typography>Add a new list</Typography>
          ) : (
            <InputBase
              sx={{ color: "inherit", padding: 0 }}
              value={listName}
              fullWidth
              autoFocus
              onChange={(e) => {
                setListName(e.target.value);
              }}
              // onBlur={() => setIsEditMode(false)}
            />
          )}

          {isEditMode ? (
            <IconButton
              type="submit"
              sx={{ marginLeft: "auto", padding: 0 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AddIcon sx={{ color: "#ffffff" }} />
            </IconButton>
          ) : (
            <AddIcon sx={{ marginLeft: "auto" }} />
          )}
        </Box>
      </Paper>
      <ErrorModal />
    </Box>
  );
};

export default NewTask;
