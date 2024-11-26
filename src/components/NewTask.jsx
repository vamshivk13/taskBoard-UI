import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useContext, useState } from "react";
import { taskContext } from "../context/TaskContextProvider";
import { v4 as uuid } from "uuid";
import fetchRequest from "../api/api";
import { authContext } from "../context/AuthContextProvider";
import { useErrorBoundary } from "./useErrorBoundary";
import { CREATE_TASK_LIST } from "../constants/api";

const NewTask = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [listName, setListName] = useState("");
  const { setTasks } = useContext(taskContext);
  const { user } = useContext(authContext);
  const { handleError, ErrorModal } = useErrorBoundary();

  async function handleAddingNewTaskList() {
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
      const res = await fetchRequest(CREATE_TASK_LIST, newTaskList);
    } catch (err) {
      handleError({
        title: "Unable to save your tasks",
        message: err.response.data,
      });
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
