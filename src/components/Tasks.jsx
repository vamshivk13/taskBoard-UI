import {
  Box,
  Button,
  IconButton,
  InputBase,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { taskContext } from "../context/TaskContextProvider";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { DELETE_TASK_URL, UPDATE_TASK } from "../constants/api";
import fetchRequest from "../api/api";
import { globalStateContext } from "../context/GlobalStateContextProvider";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TaskActionDialog from "./dialog/TaskActionDialog";
const Tasks = ({ tasks, tasksListId }) => {
  // const [isTaskEditMode, setIsTaskEditMode] = useState(null);
  const [isTaskActionMode, setIsTaskActionMode] = useState(false);
  // const [updatedValue, setUpdatedValue] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const { mode } = useContext(globalStateContext);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const textFieldRef = useRef(null);

  function handleSelectedTask(id) {
    const currentTask = tasks.filter((task) => task.id == id);
    setCurrentTask(currentTask[0]);
    // setUpdatedValue(currentTask[0].task);
    // setIsTaskEditMode(id);
    setIsTaskActionMode(true);
  }

  return (
    <List
      sx={{
        padding: "0",
        // maxHeight: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        overflowY: "auto",
        height: "100%",
        position: "relative",
      }}
    >
      <TaskActionDialog
        taskId={currentTask?.id}
        tasksListId={tasksListId}
        isOpen={isTaskActionMode}
        handleClose={() => {
          setIsTaskActionMode(false);
          setCurrentTask(null);
        }}
      />
      <Droppable key={tasksListId} droppableId={tasksListId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ height: "100%" }}
          >
            <Box
              sx={{
                height: isCompletedOpen ? "auto" : "calc(100% - 30px)",
                overflow: isCompletedOpen ? "visible" : "auto",
                marginBottom: isCompletedOpen ? "0" : "20px",
              }}
            >
              {tasks
                .filter((cur) => cur?.isDone == false)
                .map((task, index) => {
                  return (
                    <div key={task.id}>
                      <Draggable
                        key={task.order}
                        draggableId={task.id}
                        index={task.order}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Paper
                              variant="elevation"
                              elevation={1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectedTask(task.id);
                              }}
                              sx={{
                                marginBottom: "10px",
                                background:
                                  mode == "light" ? "#e9e9e6" : "#3e3e3e",
                                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                              }}
                              key={task.id}
                            >
                              <ListItem
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  "&:hover .hidden-button": {
                                    display: "block",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    lineHeight: "1rem",
                                    fontSize: "16px",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {task.task}
                                </Box>
                              </ListItem>
                            </Paper>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  );
                })}
              {provided.placeholder}
            </Box>
            <Paper
              onClick={() => {
                setIsCompletedOpen((prev) => !prev);
              }}
              sx={{
                borderRadius: "0",
                display: "flex",
                position: isCompletedOpen ? "sticky" : "absolute",
                alignItems: "center",
                bottom: "0px",
                right: 0,
                left: 0,
                top: "100",
                height: "30px",
              }}
            >
              {!isCompletedOpen ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              <Typography>Completed</Typography>
            </Paper>
            {isCompletedOpen &&
              tasks
                .filter((cur) => cur.isDone == true)
                .map((task, index) => {
                  return (
                    <div key={task.id}>
                      <Draggable
                        key={task.order}
                        draggableId={task.id}
                        index={task.order}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Paper
                              variant="elevation"
                              elevation={1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectedTask(task.id);
                              }}
                              sx={{
                                marginBottom: "10px",
                                background:
                                  mode == "light" ? "#e9e9e6" : "#3e3e3e",
                                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                              }}
                              key={task.id}
                            >
                              <ListItem
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  "&:hover .hidden-button": {
                                    display: "block",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    lineHeight: "1rem",
                                    fontSize: "16px",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {task.task}
                                </Box>
                              </ListItem>
                            </Paper>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  );
                })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </List>
  );
};

export default Tasks;
