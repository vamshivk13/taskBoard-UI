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
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import { globalStateContext } from "../context/GlobalStateContextProvider";

const Header = () => {
  const { user, setIsAuthenticated } = useContext(authContext);
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
    Cookies.remove("user");
    setIsAuthenticated(false);
    navigate("/login");
  }
  return (
    <Box sx={{ flexGrow: 1, height: "60px" }} justifyContent={"center"}>
      <AppBar position="static">
        <Toolbar>
          <Typography>TaskBoard</Typography>
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
