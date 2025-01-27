import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useContext, useState } from "react";
import { taskContext } from "../context/TaskContextProvider";
import { v4 as uuid } from "uuid";
import fetchRequest from "../api/api";
import { authContext } from "../context/AuthContextProvider";
import { useErrorBoundary } from "./useErrorBoundary";
import { CREATE_TASK_LIST } from "../constants/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";

const NewList = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [listName, setListName] = useState("");
  const { setTasks } = useContext(taskContext);
  const { user } = useContext(authContext);
  const { currentBoard } = useContext(globalStateContext);
  const { handleError, ErrorModal } = useErrorBoundary();

  async function handleAddingNewTaskList() {
    if (!listName) {
      return;
    }
    const newTaskList = {
      tasksListId: uuid(),
      userId: user.userId,
      tasks: [],
      taskName: listName,
      boardId: currentBoard.id,
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
  return (
    <Box
      sx={{
        minWidth: "350px",
      }}
    >
      <Paper>
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
              onBlur={(e) => {
                e.stopPropagation();
                setIsEditMode(false);
              }}
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
              <AddIcon />
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

export default NewList;
