import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import SidebarDrawer from "./SidebarDrawer";

const BoardHeader = () => {
  const { mode, setIsSideBarOpen, isSideBarOpen, currentBoard } =
    useContext(globalStateContext);
  return (
    <Box>
      <Toolbar></Toolbar>
      <Box
        sx={{
          paddingX: "16px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          backgroundColor:
            mode == "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          border:
            mode == "dark"
              ? "1px solid rgba(181, 177, 177, 0.1)"
              : "1px solid rgba(0,0,0,0.1)",
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
          <Typography>{currentBoard?.boardName}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BoardHeader;
