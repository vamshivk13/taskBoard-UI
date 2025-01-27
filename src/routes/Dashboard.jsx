import React, { useContext, useState } from "react";
import Header from "../components/Header";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormLabel,
  Grid2,
  IconButton,
  InputBase,
  List,
  ListItem,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { taskContext } from "../context/TaskContextProvider";
import { authContext } from "../context/AuthContextProvider";
import { v4 as uuid } from "uuid";
import fetchRequest from "../api/api";
import { CREATE_BOARD } from "../constants/api";
import { useNavigate } from "react-router";
import { globalStateContext } from "../context/GlobalStateContextProvider";

const Dashboard = () => {
  const { boards, setBoards } = useContext(taskContext);
  const { user } = useContext(authContext);
  const { setCurrentBoard, mode } = useContext(globalStateContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const navigate = useNavigate();

  async function handleNewBoard(e) {
    e.preventDefault();
    console.log(user);
    const newBoardData = {
      boardName: boardName,
      userId: user.userId,
      id: uuid(),
    };
    setBoards((prev) => [...prev, newBoardData]);
    try {
      const res = await fetchRequest(CREATE_BOARD, newBoardData);
    } catch (err) {
      console.log("ERROR creating new board", err);
    }
  }
  return (
    <Box>
      <Header />
      <Toolbar />
      <Toolbar />
      <Dialog
        fullWidth
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
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
          <IconButton>
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handleNewBoard}>
            <DoneIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
      <Box sx={{ width: "100%" }}>
        <Grid2 container spacing={2} justifyContent={"center"}>
          {boards.map((board) => {
            return (
              <Grid2
                onClick={() => {
                  navigate("/" + board.id);
                  setCurrentBoard(board);
                }}
                size={3}
                key={board.id}
              >
                <Paper
                  elevation={2}
                  sx={{
                    height: "150px",
                    textAlign: "center",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor:
                        mode == "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textTransform: "capitalize",
                    }}
                  >
                    {board.boardName}
                  </Typography>
                </Paper>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>
      <IconButton
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
          border: "1px solid",
          borderColor:
            mode == "dark"
              ? "1px solid rgba(181, 177, 177, 0.1)"
              : "1px solid rgba(0,0,0,0.1)",
        }}
        onClick={() => setIsAddDialogOpen(true)}
        size="large"
      >
        <QueueIcon />
      </IconButton>
    </Box>
  );
};

export default Dashboard;
