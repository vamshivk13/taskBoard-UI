import React, { useContext, useState } from "react";
import Header from "../components/Header";
import {
  Box,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import { taskContext } from "../context/TaskContextProvider";
import { useNavigate } from "react-router";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import SidebarDrawer from "../components/SidebarDrawer";
import BoardHeader from "../components/BoardHeader";
import NewBoardDialog from "../components/dialog/NewBoardDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import fetchRequest from "../api/api";
import { DELETE_BOARD, UPDATE_BOARD } from "../constants/api";

const Dashboard = () => {
  const { boards, setBoards, setTasks } = useContext(taskContext);
  const { setCurrentBoard, mode } = useContext(globalStateContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [curEditBoardId, setCurrentEditBoardId] = useState(null);
  const [updatedBoardName, setUpdatedBoardName] = useState("");

  const navigate = useNavigate();

  async function handleDeleteBoard(boardId) {
    setBoards((boards) => boards.filter((board) => board.id != boardId));
    try {
      await fetchRequest(DELETE_BOARD, {}, "DELETE", {
        params: {
          boardId: boardId,
        },
      });
    } catch (err) {
      console.log("ERROR DELETING BOARD", err);
    }
  }
  async function handleEditBoard(boardId) {
    let toUpdate = null;
    console.log("EDIT BOARD", boardId, updatedBoardName);
    setBoards((boards) => {
      return boards.map((board) => {
        if (board.id == boardId) {
          toUpdate = board;
          return {
            ...toUpdate,
            boardName: updatedBoardName,
          };
        } else return board;
      });
    });
    setCurrentEditBoardId(null);
    try {
      if (toUpdate.boardName == updatedBoardName) {
        return;
      }
      await fetchRequest(
        UPDATE_BOARD,
        {
          ...toUpdate,
          boardName: updatedBoardName,
        },
        "PUT"
      );
    } catch (err) {
      console.log("ERROR UPDATING BOARD", err);
    }
    setUpdatedBoardName("");
  }
  return (
    <Box
      sx={{
        height: "100%",

        background:
          mode == "dark" ? "#303334" : "linear-gradient(#FAF9F6	,#fff	)",
      }}
    >
      <Header />
      <BoardHeader />
      <Box
        sx={{
          height: "calc(100% - 110px)",
          overflow: curEditBoardId ? "hidden" : "auto",
          display: "flex",
          position: "relative",
        }}
      >
        <SidebarDrawer />
        <NewBoardDialog
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              height: "100%",
            }}
          >
            <Grid2
              container
              spacing={2}
              sx={{
                justifyContent: {
                  xs: "center",
                  md: "start",
                },
                padding: "1.5rem",
              }}
            >
              {boards.map((board) => {
                return (
                  <Grid2
                    onClick={() => {
                      if (curEditBoardId == null) {
                        navigate("/" + board?.id);
                        setTasks([]);
                        setCurrentBoard(board);
                      }
                    }}
                    size={{ md: 3, sm: 10, xs: 12 }}
                    key={board?.id}
                  >
                    <Paper
                      variant="outlined"
                      component={"form"}
                      sx={{
                        height: "150px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(!curEditBoardId && {
                          "&:hover": {
                            bgcolor:
                              mode == "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                          },
                        }),
                        zIndex: curEditBoardId == board?.id ? 2000 : "initial",
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        "&:hover .board-action": {
                          display: "block",
                          zIndex: "100",
                        },
                      }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditBoard(board?.id);
                      }}
                    >
                      {curEditBoardId == board?.id ? (
                        <TextField
                          autoCapitalize="on"
                          value={updatedBoardName}
                          autoFocus
                          sx={{ width: "100%", padding: "10%" }}
                          onChange={(e) => setUpdatedBoardName(e.target.value)}
                        ></TextField>
                      ) : (
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
                      )}
                      <Box
                        className="board-action"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          display: "none",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBoard(board.id);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentEditBoardId(board.id);
                            setUpdatedBoardName(board.boardName);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
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
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.5)",
            position: "absolute",
            display: curEditBoardId ? "block" : "none",
            inset: 0,
            height: "100%",
            zIndex: 100,
          }}
          onClick={() => {
            handleEditBoard(curEditBoardId);
            setCurrentEditBoardId(null);
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
