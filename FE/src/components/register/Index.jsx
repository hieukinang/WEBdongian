import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Link } from '@mui/material';
import Toast from '../Toast';
import { useNavigate  } from 'react-router-dom';
import { URL } from '../../utils/URL';
const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name:"",
    password:"",
    first_name:"",
    last_name:"",
    location:"",
    description:"",
    occupation:""
  })

  const [error, setError] = useState({
     open: false,
     message:""
   })

  const handleLogin =async () => {
    if(!user.name || !user.password) return;
    console.log(user);
    const res = await fetch(URL+"/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    const response = await res.json();
    if(res.status !== 201) {
     setError({
          open: true,
          message:response.error || `Failed to register account.`
     })
    } else {
      navigate("/");
    }
  };

  const closeError = () => {
     setError({
       open: false,
       message:""
     })
   }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '1rem' }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ fontFamily: 'Arial', fontStyle: 'italic', fontWeight: 'bold' }}
        >
          Register
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
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="First Name"
            type="text"
            fullWidth
            value={user.first_name}
            onChange={(e) => setUser({
              ...user,
              first_name: e.target.value
            })}
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Last Name"
            type="text"
            fullWidth
            value={user.last_name}
            onChange={(e) => setUser({
              ...user,
              last_name: e.target.value
            })}
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Location"
            type="text"
            fullWidth
            value={user.location}
            onChange={(e) => setUser({
              ...user,
              location: e.target.value
            })}
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            value={user.description}
            onChange={(e) => setUser({
              ...user,
              description: e.target.value
            })}
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Occupation"
            type="text"
            fullWidth
            value={user.occupation}
            onChange={(e) => setUser({
              ...user,
              occupation: e.target.value
            })}
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
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
            sx={{ marginBottom: '1rem' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1rem' }}
            onClick={handleLogin}
          >
            Register
          </Button>
          <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <Grid item>Already have an account?
              <Link href="/" variant="body2">
                {"Login"}
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

export default Register;
