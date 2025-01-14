import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContextProvider";
import Cookies from "js-cookie";
import { Box, CircularProgress } from "@mui/material";

import Header from "../components/Header";
import NewTask from "../components/NewTask";
import { taskContext } from "../context/TaskContextProvider";
import Task from "../components/Task";
import { DragDropContext } from "@hello-pangea/dnd";
import { useErrorBoundary } from "../components/useErrorBoundary";
import {
  DELETE_TASK_URL,
  LIST_ALLTASKS_UPDATE_URL,
  LISTS_URL,
  USER_AUTH_TOKEN_URL,
} from "../constants/api";
import fetchRequest from "../api/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";
const TaskBoard = () => {
  const { setIsAuthenticated, setUser, user, isAuthenticated } =
    useContext(authContext);
  const { mode } = useContext(globalStateContext);
  const [isTaskEditMode, setIsTaskEditMode] = useState(false);
  const { tasks, setTasks } = useContext(taskContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleError, ErrorModal } = useErrorBoundary();

  async function fetchSavedLists(userId) {
    try {
      setIsLoading(true);
      const lists = await fetchRequest(LISTS_URL, { userId: userId });
      setTasks(lists.data);
      setIsLoading(false);
    } catch (err) {
      handleError({
        title: "Unable to load your tasks",
        message: err.response.data,
      });
      console.log("Error while fetching tasks", err);
    }
  }

  useEffect(() => {
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
      fetchSavedLists(user.userId);
    }
  }, [isAuthenticated]);

  async function handleOnDragEnd(result) {
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      console.log("DRAG AND DROP IN ACTION");
      let updatedTasksList = null;
      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == destination.droppableId) {
            const curTasks = curTaskList.tasks;
            const [entryToBeReOrdered] = curTasks.splice(source.index, 1);
            curTasks.splice(destination.index, 0, entryToBeReOrdered);
            updatedTasksList = [...curTasks];
            return {
              ...curTaskList,
              tasks: [...curTasks],
            };
          } else {
            return curTaskList;
          }
        });
      });
      try {
        fetchRequest(LIST_ALLTASKS_UPDATE_URL, {
          tasksListId: source.droppableId,
          updatedTasks: updatedTasksList,
        });
      } catch (err) {
        handleError({
          title: "Task Card Update Error",
          message: err.response.data,
        });
        console.log("Error while saving tasks list after reordering");
      }
    } else {
      console.log("SORUCE, DESTINATION", source, destination);
      const toBeRemoved = tasks.filter(
        (curTaskList) => curTaskList.tasksListId == source.droppableId
      )[0].tasks[source.index];

      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == source.droppableId) {
            const curTasks = [...curTaskList.tasks];
            curTasks.splice(source.index, 1);
            return {
              ...curTaskList,
              tasks: [...curTasks],
            };
          } else if (curTaskList.tasksListId == destination.droppableId) {
            const curTasks = [...curTaskList.tasks];
            curTasks.splice(destination.index, 0, toBeRemoved);
            fetchRequest(DELETE_TASK_URL, {
              tasksListId: source.droppableId,
              task: toBeRemoved,
            }).then((res) => {
              fetchRequest(LIST_ALLTASKS_UPDATE_URL, {
                tasksListId: destination.droppableId,
                updatedTasks: [...curTasks],
              }).catch((err) => {
                console.log("ERROR MOVING TO DIFFFERENT LIST");
                handleError({
                  title: "Task Card Update Error",
                  message: err.response.data,
                });
              });
            });
            return {
              ...curTaskList,
              tasks: [...curTasks],
            };
          } else {
            return curTaskList;
          }
        });
      });
    }
  }

  return (
    <Box
      component={"div"}
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        background: mode == "dark" ? "#303334" : "#DEE4EA",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          height: "calc(100% - 60px)",
          overflowX: "auto",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {/* List of tasks to be rendered */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {tasks.map((task) => {
            return (
              <Task
                task={task}
                key={task.tasksListId}
                setIsTaskEditMode={setIsTaskEditMode}
                isTaskEditMode={isTaskEditMode}
              />
            );
          })}
        </DragDropContext>
        <NewTask />

        <ErrorModal />
      </Box>
      <Box
        sx={{
          zIndex: "10",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        {(!isAuthenticated || isLoading) && <CircularProgress />}
      </Box>
    </Box>
  );
};

export default TaskBoard;
