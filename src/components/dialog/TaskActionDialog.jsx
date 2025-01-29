import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import React, { useContext, useEffect, useState } from "react";
import { globalStateContext } from "../../context/GlobalStateContextProvider";
import { taskContext } from "../../context/TaskContextProvider";
import fetchRequest from "../../api/api";
import { DELETE_TASK_URL, UPDATE_TASK } from "../../constants/api";

const TaskActionDialog = ({ taskId, isOpen, handleClose, tasksListId }) => {
  const [updatedValue, setUpdatedValue] = useState("");
  const [updatedNotes, setUpdatedNotes] = useState("");
  const [task, setTask] = useState(null);
  const { mode } = useContext(globalStateContext);
  const { tasks, setTasks } = useContext(taskContext);
  useEffect(() => {
    if (task) {
      console.log("UPDATING", task);
      setUpdatedValue(task.task);
      setUpdatedNotes(task.note);
    }
  }, [task]);
  useEffect(() => {
    if (taskId) {
      const currentTaskList = tasks.filter(
        (curList) => curList.tasksListId == tasksListId
      )[0];
      console.log("CURLIST", currentTaskList);
      const currentTask = currentTaskList.tasks.filter(
        (curTask) => curTask.id == taskId
      );
      setTask(currentTask[0]);
    }
  }, [tasks, taskId]);
  console.log("CUR TASK", task, tasks, taskId);
  function handleUpdateTask(type, id) {
    if (type == "edit") {
      setTasks((tasksList) => {
        return tasksList.map((curTaskList) => {
          if (curTaskList.tasksListId == tasksListId) {
            const updatedTasks = curTaskList.tasks.map((curTask) => {
              if (
                curTask.id == task.id &&
                (curTask.task != updatedValue || curTask.note != updatedNotes)
              ) {
                return {
                  ...curTask,
                  task: updatedValue,
                  note: updatedNotes,
                };
              } else {
                return curTask;
              }
            });
            return { ...curTaskList, tasks: [...updatedTasks] };
          } else {
            return curTaskList;
          }
        });
      });
      try {
        if (task.task != updatedValue || task.note != updatedNotes)
          fetchRequest(UPDATE_TASK, {
            tasksListId: tasksListId,
            task: { ...task, task: updatedValue, note: updatedNotes },
          });
      } catch (err) {
        // handleError({
        //   title: "Unable to update your tasks",
        //   message: err.response.data,
        // });
        console.log("Error updating the task", err);
      }
      // setUpdatedValue("");
    } else if (type == "delete") {
      console.log("IN DELETE TASK");
      setTasks((lists) => {
        return lists.map((curTaskList) => {
          if (curTaskList.tasksListId == tasksListId) {
            const updatedTasks = curTaskList.tasks.filter(
              (curTask) => curTask.id != task.id
            );
            console.log("UPDATED TASK", updatedTasks);
            return { ...curTaskList, tasks: [...updatedTasks] };
          } else {
            return curTaskList;
          }
        });
      });
      try {
        fetchRequest(DELETE_TASK_URL, {
          tasksListId: tasksListId,
          task: { ...task },
        });
      } catch (err) {
        // handleError({
        //   title: "Unable to update tasks",
        //   message: err.response.data,
        // });
        console.log("Error updating the task", err);
      }
      setUpdatedValue("");
    }
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={() => {
        handleUpdateTask("edit");
        handleClose();
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTask("edit");
          }}
        >
          <TextField
            sx={{
              boxSizing: "border-box",
              padding: 0,
              letterSpacing: "0",
              "&:focus-within .MuiOutlinedInput-notchedOutline": {
                border:
                  mode == "dark"
                    ? "1px solid rgba(210, 205, 205, 0.9)"
                    : "1px solid rgba(2, 1, 1, 0.9)",
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            fullWidth
            autoFocus
            // multiline
            value={updatedValue}
            onChange={(e) => {
              setUpdatedValue(e.target.value);
            }}
            // onBlur={() => {
            //   handleUpdateTask("edit");
            // }}
          ></TextField>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            boxSizing: "border-box",
            padding: 0,

            letterSpacing: "0",
            "& .MuiOutlinedInput-notchedOutline": {
              border:
                mode == "dark"
                  ? "1px solid rgba(210, 205, 205, 0.9)"
                  : "1px solid rgba(2, 1, 1, 0.9)",
              outline: "none",
            },
          }}
          fullWidth
          autoFocus
          minRows={10}
          multiline
          value={updatedNotes}
          onChange={(e) => {
            setUpdatedNotes(e.target.value);
          }}
          // onBlur={() => {
          //   handleUpdateTask("edit");
          // }}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <IconButton
          onClick={() => {
            handleUpdateTask("delete");
            handleClose();
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
        <IconButton
          type="submit"
          onClick={() => {
            handleUpdateTask("edit");
            handleClose();
          }}
        >
          <DoneIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default TaskActionDialog;
