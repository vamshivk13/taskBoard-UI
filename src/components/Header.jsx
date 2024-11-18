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

const Header = () => {
  const { user } = useContext(authContext);
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
    navigate("/login");
  }
  const mode = "dark";
  return (
    <Box sx={{ flexGrow: 1 }} justifyContent={"center"}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
          color: mode === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Toolbar>
          {/* <Box sx={{ display: "flex", "al" }}> */}
          <Typography>TaskBoard</Typography>
          <IconButton onClick={handleClick} sx={{ marginLeft: "auto" }}>
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
              user?.email.split("@")[0] || "User"
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
