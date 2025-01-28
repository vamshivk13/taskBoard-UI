import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { Box, Grid2, IconButton, Paper, Typography } from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import { taskContext } from "../context/TaskContextProvider";
import { useNavigate } from "react-router";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import SidebarDrawer from "../components/SidebarDrawer";
import BoardHeader from "../components/BoardHeader";
import NewBoardDialog from "../components/dialog/NewBoardDialog";

const Dashboard = () => {
  const { boards, setBoards, setTasks } = useContext(taskContext);
  const { setCurrentBoard, mode } = useContext(globalStateContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const navigate = useNavigate();

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
        sx={{ height: "calc(100% - 110px)", overflow: "auto", display: "flex" }}
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
                      navigate("/" + board.id);
                      setTasks([]);
                      setCurrentBoard(board);
                    }}
                    size={{ md: 3, sm: 10, xs: 12 }}
                    key={board.id}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        height: "150px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor:
                            mode == "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                        },
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      }}
                    >
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
      </Box>
    </Box>
  );
};

export default Dashboard;
