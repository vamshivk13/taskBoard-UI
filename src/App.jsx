import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import TaskBoard from "./routes/TaskBoard";
import Cookies from "js-cookie";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import GlobalStateContextProvider, {
  globalStateContext,
} from "./context/GlobalStateContextProvider";
import { useContext, useEffect, useState } from "react";
import Dashboard from "./routes/Dashboard";
import fetchRequest from "./api/api";
import { GET_BOARDS, USER_AUTH_TOKEN_URL } from "./constants/api";
import { authContext } from "./context/AuthContextProvider";
import { taskContext } from "./context/TaskContextProvider";

function App() {
  const { setIsAuthenticated, setUser, user, isAuthenticated } =
    useContext(authContext);
  const { mode, setCurrentBoard, setIsInitialLoadingDone } =
    useContext(globalStateContext);
  const { setBoards } = useContext(taskContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TaskBoard />,
    },
    {
      path: "/:boardId",
      element: <TaskBoard />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ]);

  const [curMode, setCurMode] = useState(mode);

  useEffect(() => {
    setCurMode(curMode);
  }, [mode]);

  async function fetchBoardsByUser(userId) {
    try {
      const boards = await fetchRequest(GET_BOARDS, {}, "GET", {
        params: {
          userId: userId,
        },
      });
      console.log("BOARDS", boards.data);
      setBoards(boards.data);
      setCurrentBoard(boards.data[0] || null);
      setIsInitialLoadingDone(true);
    } catch (err) {
      console.log("ERROR Fetching boards of user", err);
    }
  }
  useEffect(() => {
    setIsInitialLoadingDone(false);
    async function authenticateViaCustomLoginToken(token, config = {}) {
      try {
        const user = await fetchRequest(
          USER_AUTH_TOKEN_URL,
          {
            token: token,
          },
          "POST",
          { ...config }
        );
        console.log("TOKEN AUTH RESPONSE", user);
        if (user) return user.data;
        else return null;
      } catch (err) {
        console.log("Token Authentication Error", err);
      }
    }

    async function authenticateUser() {
      const authToken = Cookies.get("token");
      const googleToken = Cookies.get("google-token");
      console.log("AUTH, GOOGLE TOKENS", authToken, googleToken);
      const googleUser = await authenticateViaCustomLoginToken(googleToken);
      const user = await authenticateViaCustomLoginToken(authToken, {
        withCredentials: true,
      });
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else if (googleUser) {
        setIsAuthenticated(true);
        setUser(googleUser);
      } else {
        navigate("/login");
      }
    }
    if (!isAuthenticated) authenticateUser();
    else {
      fetchBoardsByUser(user.userId);
    }
  }, [isAuthenticated]);

  const theme = createTheme({
    palette: {
      mode: mode,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            padding: "!important 4px",
            backgroundColor: mode === "dark" ? "#111111" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#000000",
            boxShadow:
              mode === "dark"
                ? "0px 4px 10px rgba(0, 0, 0, 0.5)"
                : "0px 4px 10px rgba(0, 0, 0, 0.1)",
            border: mode === "dark" ? "1px solid #333" : "1px solid #ddd",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "!important 6px", // Applies padding to CardContent
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? "#1e1e1e" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#000000",
            boxShadow:
              mode === "dark"
                ? "0px 4px 10px rgba(0, 0, 0, 0.5)"
                : "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
