import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }} justifyContent={"center"}>
      <AppBar position="static">
        <Toolbar>
          {/* <Box sx={{ display: "flex", "al" }}> */}
          <Typography>TaskBoard</Typography>
          <Avatar sx={{ marginLeft: "auto" }}></Avatar>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
