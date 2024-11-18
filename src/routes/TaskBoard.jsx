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
import axios from "axios";
import { DragDropContext } from "@hello-pangea/dnd";
import { useErrorBoundary } from "../components/useErrorBoundary";
const TaskBoard = () => {
  const { setIsAuthenticated, setUser, user, isAuthenticated } =
    useContext(authContext);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isTaskEditMode, setIsTaskEditMode] = useState(false);
  const { tasks, setTasks } = useContext(taskContext);
  const listsUrl = "https://task-board-backend-cbnz.onrender.com/task/lists";
  const updateTasksListUrl =
    "https://task-board-backend-cbnz.onrender.com/task/update/task";
  const deleteTaskUrl =
    "https://task-board-backend-cbnz.onrender.com/task/delete";
  const navigate = useNavigate();
  const { handleError, ErrorModal } = useErrorBoundary();

  async function fetchSavedLists(userId) {
    try {
      const lists = await axios.post(listsUrl, { userId: userId });
      setTasks(lists.data);
    } catch (err) {
      handleError({
        title: "Unable to load your tasks",
        message: err.response.data,
      });
      console.log("Error while fetching tasks", err);
    }
  }

  useEffect(() => {
    const user = Cookies.get("user");
    const urlParams = new URLSearchParams(window.location.search);
    const googleUser = urlParams.get("user");

    if (user) {
      console.log(user);
      setIsAuthenticated(true);
      const userDetails = JSON.parse(user);
      setUser(userDetails);
      fetchSavedLists(userDetails.userId);
    } else if (googleUser) {
      console.log(googleUser);
      setIsAuthenticated(true);
      const userDetails = JSON.parse(googleUser);
      console.log("googleuser", googleUser, userDetails);
      setUser(googleUser);
      fetchSavedLists(userDetails.userId);
    } else {
      navigate("/login");
    }
  }, []);
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
        axios.post(updateTasksListUrl, {
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
            axios.post(updateTasksListUrl, {
              tasksListId: destination.droppableId,
              updatedTasks: [...curTasks],
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

      try {
        axios.post(deleteTaskUrl, {
          tasksListId: source.droppableId,
          task: toBeRemoved,
        });
      } catch (err) {
        handleError({
          title: "Task Card Update Error",
          message: err.response.data,
        });
        console.log("Error while saving tasks list after reordering");
      }
    }
  }
  if (!isAuthenticated) {
    return <CircularProgress />;
  } else
    return (
      <Box
        component={"div"}
        sx={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#EBEAFF",
        }}
        onClick={(e) => {
          // setIsEditMode(false);
          // setIsTaskEditMode(false);
        }}
      >
        <Header />
        <Box
          sx={{
            display: "flex",
            overflowY: "auto",
            height: "100%",
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
          <NewTask isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
          <ErrorModal />
        </Box>
      </Box>
    );
};

export default TaskBoard;
