import { Menu, MenuItem } from "@mui/material";
import React, { useContext } from "react";
import { taskContext } from "../../context/TaskContextProvider";
import fetchRequest from "../../api/api";
import { DELETE_LIST_URL } from "../../constants/api";

const ListOptionMenu = ({ listId, anchor, handleClose }) => {
  const { tasks, setTasks } = useContext(taskContext);
  function handleDelete() {
    setTasks((tasks) => {
      return tasks.filter((task) => task.tasksListId != listId);
    });
    try {
      fetchRequest(DELETE_LIST_URL, { tasksListId: listId }, "POST");
    } catch (err) {
      console.log("Error deleting list", err);
    }
  }
  return (
    <Menu anchorEl={anchor} open={!!anchor} onClose={handleClose}>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </Menu>
  );
};

export default ListOptionMenu;
