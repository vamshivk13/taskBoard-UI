import {
  Box,
  IconButton,
  InputBase,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import SidebarDrawer from "./SidebarDrawer";
import { useLocation, useParams } from "react-router";
import fetchRequest from "../api/api";
import { UPDATE_BOARD } from "../constants/api";
import { taskContext } from "../context/TaskContextProvider";

const BoardHeader = () => {
  const { mode, setIsSideBarOpen, isSideBarOpen } =
    useContext(globalStateContext);
  const navigation = useLocation();
  const params = useParams();
  const { setBoards, boards } = useContext(taskContext);
  const isDashboard = navigation.pathname.includes("dashboard");
  const [isBoardEditMode, setIsBoardEditMode] = useState(false);
  const [updatedBoardName, setUpdatedBoardName] = useState("");
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    if (params.boardId) {
      const curBoard = boards.filter((board) => board.id == params.boardId);
      setCurrentBoard(curBoard[0]);
    }
  }, [boards, params.boardId]);
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
    setIsBoardEditMode(false);
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
    <Box>
      <Toolbar></Toolbar>
      <Box
        sx={{
          paddingX: "16px",
          paddingY: 0,
          height: "45px",
          display: "flex",
          alignItems: "center",
          backgroundColor:
            mode == "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          border:
            mode == "dark"
              ? "1px solid rgba(9, 9, 9, 0.1)"
              : "1px solid rgba(25, 24, 24, 0.1)",
          borderLeft: "none",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isSideBarOpen && (
            <IconButton onClick={() => setIsSideBarOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          {!isDashboard && (
            <Box
              onClick={() => {
                setIsBoardEditMode((prev) => !prev);
                setUpdatedBoardName(currentBoard?.boardName);
              }}
              component={"form"}
              onSubmit={(e) => {
                e.preventDefault();
                handleEditBoard(currentBoard.id);
              }}
            >
              {isBoardEditMode ? (
                <InputBase
                  autoCapitalize="on"
                  value={updatedBoardName}
                  autoFocus
                  sx={(theme) => ({
                    border: "1px solid " + theme.palette.text.primary,
                    borderRadius: "4px",
                    width: `${Math.max(updatedBoardName.length, 1)}ch`,
                    paddingX: "4px",
                    backdropFilter: "blur(20px)",
                  })}
                  onChange={(e) => setUpdatedBoardName(e.target.value)}
                  onBlur={() => {
                    handleEditBoard(currentBoard.id);
                  }}
                ></InputBase>
              ) : (
                <Typography>{currentBoard?.boardName}</Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BoardHeader;
