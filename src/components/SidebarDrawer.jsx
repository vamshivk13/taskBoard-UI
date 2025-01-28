import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import AddIcon from "@mui/icons-material/Add";
import { taskContext } from "../context/TaskContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import NewBoardDialog from "./dialog/NewBoardDialog";
const SidebarDrawer = () => {
  const {
    setIsSideBarOpen,
    isSideBarOpen,
    mode,
    setCurrentBoard,
    currentBoard,
  } = useContext(globalStateContext);
  const navigate = useNavigate();
  const params = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { boards, setBoards, setTasks } = useContext(taskContext);
  return (
    <Drawer
      sx={{
        background: "red",
        minWidth: "250px",
        width: "20%",
        "& .MuiDrawer-paper": {
          width: "20%",
          minWidth: "250px",
        },
        display: isSideBarOpen ? "block" : "none",
      }}
      variant="permanent"
    >
      <Toolbar></Toolbar>
      <NewBoardDialog
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
      <Paper
        sx={{
          minHeight: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "24px",
          paddingRight: "16px",
          backgroundColor:
            mode == "dark" ? "rgba(0,0,0,0.1)" : "rgba(152, 152, 152, 0.1)",
          border:
            mode == "dark"
              ? "1px solid rgba(181, 177, 177, 0.1)"
              : "1px solid rgba(0,0,0,0.1)",
          boxShadow: "none",
          borderRight: "none",
          borderRadius: 0,
        }}
      >
        <Typography variant="body1">Taskboard WorkSpace</Typography>
        <IconButton
          onClick={() => {
            setIsSideBarOpen(false);
          }}
          sx={{ padding: 0, borderRadius: "2px" }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Paper>
      <List sx={{ height: "45px", padding: 0 }}>
        <ListItem
          sx={{
            cursor: "pointer",
            height: "100%",
            "&:hover": {
              bgcolor:
                mode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            },
            gap: "2rem",
          }}
          onClick={() => {
            setTasks([]);
            navigate("/dashboard");
            setIsSideBarOpen(false);
          }}
        >
          <DashboardIcon />
          <Typography>Boards Dashboard</Typography>
        </ListItem>
      </List>
      <Paper
        variant="elevation"
        sx={{
          padding: "8px 1rem",
          backgroundColor:
            mode == "dark"
              ? "rgba(82, 78, 78, 0.1)"
              : "rgba(152, 152, 152, 0.1)",
          border:
            mode == "dark"
              ? "1px solid rgba(181, 177, 177, 0.1)"
              : "1px solid rgba(0,0,0,0.1)",
          borderRight: "none",
          boxShadow: "none",
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          height: "45px",
        }}
      >
        <Typography>Your Boards</Typography>
        <IconButton
          sx={{ padding: 0, marginLeft: "auto", borderRadius: "2px" }}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <AddIcon />
        </IconButton>
      </Paper>

      <List sx={{ overflowY: "auto", height: "calc(100% - 135px)" }}>
        {boards.map((board) => {
          return (
            <ListItem
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor:
                    mode == "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                },
                bgcolor:
                  board.id == params.boardId
                    ? mode == "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)"
                    : "inherit",
                textTransform: "capitalize",
                gap: "1rem",
              }}
              onClick={() => {
                setTasks([]);
                setCurrentBoard(board);
                navigate("/" + board.id);
              }}
            >
              <ContentPasteIcon fontSize="small" />
              <Typography>{board.boardName}</Typography>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default SidebarDrawer;
