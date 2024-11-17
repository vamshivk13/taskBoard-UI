import React, { useContext, useState } from "react";
import TaskList from "./TaskList";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import { taskContext } from "../context/TaskContextProvider";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import axios from "axios";

const Task = ({ task, isTaskNameEditMode, setIsTaskNameEditMode }) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTask, setNewTask] = useState("");
  const createNewTaskUrl =
    "https://task-board-backend-cbnz.onrender.com/task/create/task";
  const updateNewTaskUrl =
    "https://task-board-backend-cbnz.onrender.com/task/update/list";

  const { setTasks } = useContext(taskContext);
  async function handleAddingNewTask() {
    const id = uuid();
    const newTaskToAdd = {
      task: newTask,
      isDone: false,
      createdAt: Date.now(),
      note: "",
      id: id,
    };
    setTasks((tasks) => {
      return tasks.map((curTaskList) => {
        if (curTaskList.tasksListId == task.tasksListId) {
          const updatedTasks = [...curTaskList.tasks, newTaskToAdd];
          return {
            ...curTaskList,
            tasks: updatedTasks,
          };
        } else {
          return curTaskList;
        }
      });
    });
    setNewTask("");
    try {
      const newSavedTask = await axios.post(createNewTaskUrl, {
        task: newTaskToAdd,
        tasksListId: task.tasksListId,
      });
    } catch (err) {
      console.log("Error saving new task", err);
    }
  }

  async function handleUpdatingTaskList(type) {
    if (type == "edit") {
      setTasks((tasksLists) => {
        return tasksLists.map((curTaskList) => {
          if (curTaskList.tasksListId == task.tasksListId) {
            return {
              ...curTaskList,
              taskName: newTaskName,
            };
          } else {
            return curTaskList;
          }
        });
      });
      setIsTaskNameEditMode(false);
      try {
        const updatedSavedTask = await axios.post(updateNewTaskUrl, {
          taskName: newTaskName,
          tasksListId: task.tasksListId,
        });
      } catch (err) {
        console.log("Error saving new task", err);
      }
      setNewTaskName("");
    }
  }

  return (
    <Box sx={{ minWidth: "400px" }}>
      <Paper>
        <Card>
          <CardContent>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setIsTaskNameEditMode(true);
                setNewTaskName(task.taskName);
              }}
            >
              {isTaskNameEditMode ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  component={"form"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdatingTaskList("edit");
                  }}
                >
                  <InputBase
                    fullWidth
                    sx={{ fontSize: "1.4rem" }}
                    autoFocus
                    value={newTaskName}
                    onChange={(e) => {
                      setNewTaskName(e.target.value);
                    }}
                  />
                  <IconButton
                    sx={{ marginLeft: "auto" }}
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography variant="h6">{task.taskName}</Typography>
              )}
            </Box>

            <TaskList tasks={task.tasks} tasksListId={task.tasksListId} />

            <Box
              component={"div"}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <IconButton onClick={handleAddingNewTask}>
                <AddIcon />
              </IconButton>
              <InputBase
                fullWidth
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="add new task"
              />
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default Task;
