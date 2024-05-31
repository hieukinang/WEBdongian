import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";
import { Link } from "react-router-dom";
import axios from "axios";
import { URL } from "../../utils/URL";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    // const users = models.userListModel();
    const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId")

const fetchUsers = async () => {
  try {
    const res = await fetch(URL+"/api/user/list");
    const data = await res.json();
    setUsers(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};


useEffect(() => {
  fetchUsers();
}, []);
    return (
      <div>
        {
          users?.length === 1 
          ? <Typography>Các người dùng còn lại chưa hoạt động</Typography>
          : <Typography>Đang hoạt động</Typography>
        }
        <List component="nav">
          {users?.filter(user => user._id !== userId).map((item) => (
            <>
            <div style={{
              cursor:"pointer",
            }}>
              <Link to={`users/${item._id}`}>
              <ListItem>
                  <ListItemText primary={ item?.name ||item?.first_name + item?.last_name}/>
              </ListItem>
              </Link>
              </div>
              <Divider />
            </>
          ))}
        </List>
      </div>
    );
}

export default UserList;
