import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormLabel,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import fetchRequest from "../../api/api";
import { CREATE_BOARD } from "../../constants/api";
import { authContext } from "../../context/AuthContextProvider";
import { taskContext } from "../../context/TaskContextProvider";
import { v4 as uuid } from "uuid";

const NewBoardDialog = ({ isAddDialogOpen, setIsAddDialogOpen }) => {
  const { setBoards } = useContext(taskContext);
  const [boardName, setBoardName] = useState("");
  const { user } = useContext(authContext);

  async function handleNewBoard(e) {
    e.preventDefault();
    const newBoardData = {
      boardName: boardName,
      userId: user.userId,
      id: uuid(),
    };
    setBoards((prev) => [...prev, newBoardData]);
    setIsAddDialogOpen(false);
    setBoardName("");
    try {
      const res = await fetchRequest(CREATE_BOARD, newBoardData);
    } catch (err) {
      console.log("ERROR creating new board", err);
    }
  }
  return (
    <Dialog
      fullWidth
      open={isAddDialogOpen}
      onClose={() => {
        setIsAddDialogOpen(false);
        setBoardName("");
      }}
    >
      <DialogTitle title="Add New Board">Add New Board</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={handleNewBoard}>
          <FormGroup>
            <FormLabel>Board Name</FormLabel>
            <TextField
              autoFocus
              name="board-name"
              value={boardName}
              variant="standard"
              onChange={(e) => setBoardName(e.target.value)}
            ></TextField>
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => setIsAddDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleNewBoard}>
          <DoneIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default NewBoardDialog;
