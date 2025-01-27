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
import React, { useContext } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import AddIcon from "@mui/icons-material/Add";
import { taskContext } from "../context/TaskContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  const { boards } = useContext(taskContext);
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
      <Paper
        sx={{
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "24px",
          paddingRight: "16px",
          backgroundColor:
            mode == "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
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
      <List>
        <ListItem
          sx={{
            cursor: "pointer",
            "&:hover": {
              bgcolor:
                mode == "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            },
          }}
          onClick={() => {
            navigate("/dashboard");
            setIsSideBarOpen(false);
          }}
        >
          Boards Dashboard
        </ListItem>
      </List>
      <Box>
        <Paper
          variant="elevation"
          sx={{
            padding: "8px 1rem",
            backgroundColor:
              mode == "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            border:
              mode == "dark"
                ? "1px solid rgba(181, 177, 177, 0.1)"
                : "1px solid rgba(0,0,0,0.1)",
            borderRight: "none",
            boxShadow: "none",
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>Your Boards</Typography>
          <IconButton
            sx={{ padding: 0, marginLeft: "auto", borderRadius: "2px" }}
          >
            <AddIcon />
          </IconButton>
        </Paper>
        <List>
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
                }}
                onClick={() => {
                  navigate("/" + board.id);
                  setCurrentBoard(board);
                }}
              >
                {board.boardName}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarDrawer;
