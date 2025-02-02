import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authContext } from "../context/AuthContextProvider";
import Cookies from "js-cookie";
import { Box, CircularProgress, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../components/Header";
import NewTask from "../components/NewList";
import { taskContext } from "../context/TaskContextProvider";
import Task from "../components/BoardList";
import { DragDropContext } from "@hello-pangea/dnd";
import { useErrorBoundary } from "../components/useErrorBoundary";
import {
  DELETE_TASK_URL,
  GET_BOARDS,
  LIST_ALLTASKS_UPDATE_URL,
  LIST_BY_BOARD,
  LISTS_URL,
  USER_AUTH_TOKEN_URL,
} from "../constants/api";
import fetchRequest from "../api/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import BoardHeader from "../components/BoardHeader";
import SidebarDrawer from "../components/SidebarDrawer";
const TaskBoard = () => {
  const { setIsAuthenticated, setUser, user, isAuthenticated } =
    useContext(authContext);
  const {
    mode,
    currentBoard,
    setCurrentBoard,
    setIsInitialLoadingDone,
    isInitialLoadingDone,
  } = useContext(globalStateContext);
  const [isTaskEditMode, setIsTaskEditMode] = useState(false);
  const { tasks, setTasks, boards, setBoards } = useContext(taskContext);
  const params = useParams();
  const navigate = useNavigate();
  const { handleError, ErrorModal } = useErrorBoundary();

  async function fetchSavedLists(userId, boardId) {
    try {
      const lists = await fetchRequest(LIST_BY_BOARD, {
        userId: userId,
        boardId: boardId,
      });
      console.log("LIST BY BOARD", lists.data);
      // const curBoard = boards.find((board) => board.id == boardId);
      // setCurrentBoard(curBoard);
      setTasks(lists.data);
    } catch (err) {
      handleError({
        title: "Unable to load your tasks",
        message: "",
      });
      console.log("Error while fetching tasks", err);
    }
  }

  useEffect(() => {
    if (!params.boardId && currentBoard) {
      console.log(
        "No Param, navigating with one from currentBoard",
        params,
        currentBoard
      );
      navigate("/" + currentBoard.id);
    } else if (params.boardId && isInitialLoadingDone) {
      console.log("PArams found", params);
      fetchSavedLists(user.userId, params.boardId);
    } else if (isInitialLoadingDone && !currentBoard) {
      console.log("NAVIGATING as no board is precent", currentBoard);
      navigate("/dashboard");
    }
  }, [currentBoard, isInitialLoadingDone, params.boardId]);

  async function handleOnDragEnd(result) {
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      console.log("DRAG AND DROP IN ACTION", source, destination);
      let updatedTasksList = null;
      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == destination.droppableId) {
            let curTasks = curTaskList.tasks;
            const sourceIndex = curTasks.findIndex(
              (task) => task.order == source.index
            );
            const destinationIndex = curTasks.findIndex(
              (task) => task.order == destination.index
            );
            console.log("INDEXes", sourceIndex, destinationIndex);
            const [entryToBeReOrdered] = curTasks.splice(sourceIndex, 1);
            const curTodoTasks = curTasks.filter((task) => !task.isDone).length;
            let isDone = true;
            if (destinationIndex >= 0 && destinationIndex <= curTodoTasks) {
              isDone = false;
            }
            curTasks.splice(destinationIndex, 0, {
              ...entryToBeReOrdered,
              isDone,
            });
            curTasks = curTasks.map((task, index) => ({
              ...task,
              order: index,
            }));

            updatedTasksList = [...curTasks];
            console.log("UPDATED LIST", updatedTasksList);
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
            let curTasks = [...curTaskList.tasks];
            curTasks.splice(source.index, 1);
            curTasks = curTasks.map((task, index) => ({
              ...task,
              order: index,
            }));
            return {
              ...curTaskList,
              tasks: [...curTasks],
            };
          } else if (curTaskList.tasksListId == destination.droppableId) {
            let curTasks = [...curTaskList.tasks];
            const curTodoTasks = curTasks.filter((task) => !task.isDone).length;
            let isDone = true;
            if (destination.index >= 0 && destination.index <= curTodoTasks) {
              isDone = false;
            }
            curTasks.splice(destination.index, 0, { ...toBeRemoved, isDone });
            curTasks = curTasks.map((task, index) => ({
              ...task,
              order: index,
            }));
            fetchRequest(DELETE_TASK_URL, {
              tasksListId: source.droppableId,
              task: { ...toBeRemoved, isDone },
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
        // backdropFilter: "blur(10px)",
        background:
          mode == "dark" ? "#303334" : "linear-gradient(#FAF9F6	,#fff	)",
      }}
    >
      <Header />
      <Box sx={{ display: "flex" }} height={"100%"}>
        <SidebarDrawer />
        <Box sx={{ flex: 1, width: "100%" }}>
          <BoardHeader />
          <Box
            sx={{
              display: "flex",
              height: "calc(100% - 109px)",
              overflowX: "auto",
              flex: 1,
              gap: "1rem",
              padding: "1rem",
              paddingBottom: 0,
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
            {(!isAuthenticated || !isInitialLoadingDone) && (
              <CircularProgress />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskBoard;
