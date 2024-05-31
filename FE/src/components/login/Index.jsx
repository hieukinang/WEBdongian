import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Link } from '@mui/material';
import Toast from '../Toast';
import { URL } from '../../utils/URL';
import {useNavigate} from "react-router-dom"
const Login = ({setLogin, setUserTitle}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name:"",
    password:""
  })
  const [error, setError] = useState({
    open: false,
    message:""
  })

  const handleLogin =async () => {
    if(!user.name || !user.password) return;
    console.log(user);
    const res = await fetch(URL+"/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })

    if(res.status === 401) {
      setError({
        open: true,
        message:res?.body?.error || "name or password invalid"
      })
    }
    if(res.status === 200) {
      const data = await res.json();
      const token = data.token;
      localStorage.setItem("token", token);
      setLogin(true);
      setUserTitle(data?.user)
      navigate("/users/" + data?.user?._id)
    }

  };

  const closeError = () => {
    setError({
      open: false,
      message:""
    })
  }

  return (
    <Container maxWidth="xs" >
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '8rem' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'Arial', fontStyle: 'italic', fontWeight: 'bold' }}>
          Login
        </Typography>
        <div>
          <TextField
            label="Name"
            type="text"
            fullWidth
            value={user.name}
            onChange={(e) => setUser({
              ...user,
              name: e.target.value
            })}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={user.password}
            onChange={(e) => setUser({
              ...user,
              password: e.target.value
            })}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1rem' }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <Grid item>
            Don't have an account?
              <Link href="/register" variant="body2">
                {"Register"}
              </Link>
            </Grid>
          </Grid>
        </div>
        <Toast
          open={error.open}
          onClose={closeError}
          message={error?.message}
          severity="error"
        />
      </Paper>
    </Container>
  );
};

export default Login;
