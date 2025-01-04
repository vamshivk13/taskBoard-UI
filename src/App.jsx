import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import TaskBoard from "./routes/TaskBoard";
import AuthContextProvider from "./context/AuthContextProvider";
import TaskContextProvider from "./context/TaskContextProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import GlobalStateContextProvider, {
  globalStateContext,
} from "./context/GlobalStateContextProvider";
import { useContext } from "react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TaskBoard />,
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);

  const { mode } = useContext(globalStateContext);
  const theme = createTheme({
    palette: {
      mode,
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
    <AuthContextProvider>
      <TaskContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </TaskContextProvider>
    </AuthContextProvider>
  );
}

export default App;
