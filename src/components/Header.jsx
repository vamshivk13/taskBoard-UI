import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { authContext } from "../context/AuthContextProvider";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import LightIcon from "@mui/icons-material/Light";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import { taskContext } from "../context/TaskContextProvider";

const Header = () => {
  const { user, setIsAuthenticated } = useContext(authContext);
  const { setTasks } = useContext(taskContext);
  const { mode, setMode } = useContext(globalStateContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("google-token");
    setTasks([]);
    setIsAuthenticated(false);
    navigate("/login");
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", zIndex: "200001" }}
      >
        <Toolbar sx={{ zIndex: "2000001" }}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"3px"}
          >
            <SpaceDashboardIcon />
            <Typography variant="h6">TaskBoard</Typography>
          </Box>
          <IconButton
            sx={{ marginLeft: "auto", marginRight: "1rem" }}
            onClick={() =>
              setMode((mode) => (mode == "dark" ? "light" : "dark"))
            }
          >
            {mode == "dark" ? <LightIcon /> : <NightlightRoundIcon />}
          </IconButton>
          <IconButton onClick={handleClick}>
            <Avatar></Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>{`Hi, ${
              user?.email?.split("@")[0] || "User"
            } !`}</MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
