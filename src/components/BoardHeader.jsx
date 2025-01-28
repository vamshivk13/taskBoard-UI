import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import SidebarDrawer from "./SidebarDrawer";
import { useLocation } from "react-router";

const BoardHeader = () => {
  const { mode, setIsSideBarOpen, isSideBarOpen, currentBoard } =
    useContext(globalStateContext);
  const navigation = useLocation();
  const isDashboard = navigation.pathname.includes("dashboard");
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
          {!isDashboard && <Typography>{currentBoard?.boardName}</Typography>}
        </Box>
      </Box>
    </Box>
  );
};

export default BoardHeader;
