import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/login";
import TaskBoard from "./routes/TaskBoard";
import AuthContextProvider from "./context/AuthContextProvider";
import Header from "./components/Header";
import TaskContextProvider from "./context/TaskContextProvider";

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
  return (
    <AuthContextProvider>
      <TaskContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </TaskContextProvider>
    </AuthContextProvider>
  );
}

export default App;
