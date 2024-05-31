import './App.css';

import React, { useEffect, useState } from "react";
import { Grid, Typography, Paper, Modal , TextField, Button} from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

import {useParams, Link} from "react-router-dom";
import Login from './components/login/Index';
import Register from './components/register/Index';
import Toast from './components/Toast';
import { URL } from './utils/URL';


const App = (props) => {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") == "true");
  const [title, setTitle] = useState(null)
  const [error, setError] = useState({
    open: false,
    message:""
  })
  
  const setLogin = (value) => {
    setIsLogin(value);
    localStorage.setItem("isLogin", true);
  }

  const changeTille = (value) => {
    setTitle(value)
  }


  const setUserTitle = (user) => {
    setTitle(`Hi ${user?.name}`)
    localStorage.setItem("userId", user?._id)
  }

  const closeError = () => {
    setError({
      open: false,
      message:""
    })
  }


  const fetchUser = async() => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(URL+"/api/user/" + userId);
    const user = await response.json();
    setUserTitle(user)
  }




  useEffect(() => {
    fetchUser();
  },[])


  return (
      <Router>
        {
          isLogin ? (
            <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar 
                title = {title} 
                setIsLogin = {setIsLogin} 
                setError = {setError}
                />
              </Grid>
              <div className="main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route
                        path="/users/:userId"
                        element = {<UserDetail/>}
                    />
                    <Route
                        path="/photos/:userId"
                        element = {<UserPhotos/>}
                    />
                    <Route path="/users" element={<UserList />} />
                  </Routes>
                </Paper>
              </Grid>
            </Grid>
            
            
            <Toast
            open={error.open}
            onClose={closeError}
            message={error?.message}
            severity="error"
      />
          </div>
          ) : (<>
          
            <Routes>
              <Route path='/' element = {<Login setLogin={setLogin} setUserTitle = {setUserTitle}/>}/>
              <Route path='/register' element = {<Register/>}/>
            </Routes>
          </>)
        }
      </Router>
  );
}

export default App;
