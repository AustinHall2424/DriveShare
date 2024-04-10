import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const navigate = useNavigate();

    // Checks if user is registerd, and if password is correct
    // Generates a sessionToken if successful and navigates the user to the dashboard
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('email', '==', email)));
            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.password === password) {

                    const sessionToken = generateSessionToken();
                    localStorage.setItem('sessionToken', sessionToken);
                    localStorage.setItem('userEmail', email);

                    navigate('/dashboard');
                } else {
                    setMessage('Login failed. Incorrect password');
                    setSeverity('error');
                    setOpenSnackbar(true);
                }
            } else {
                setMessage('User not found');
                setSeverity('error');
                setOpenSnackbar(true);
            }
        } catch(error){
            setMessage('Authentication failed');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Authentication failed', error.message);
        }
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    // Generates the session token for the user
    const generateSessionToken = () => {
        // Generate a random string using characters from A-Z, a-z, and 0-9
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const tokenLength = 32; // Length of the session token
        let token = '';
        for (let i = 0; i < tokenLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters[randomIndex];
        }
        return token;
    };

    return(
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: "25px"}}>
        <Typography variant='h4'>Login</Typography>
            <form onSubmit={handleSubmit}>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                style={{ marginTop: "15px"}}
                color="primary"
                fullWidth
                type="submit"
            >
                Login
            </Button>
            </form>
            <Typography variant="body1" style={{ marginTop: "25px"}}>
                <Link to="/PasswordRecovery">Forgot Password</Link>
            </Typography>
            <Typography variant="body1" style={{ marginTop: "25px"}}>
                Need To Sign Up? <Link to="/register">Register</Link>
            </Typography>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                onClose={handleSnackbarClose}
                severity={severity}
                sx={{ width: "100%", background: "black", color: "white"}}
                >
                {message}
                </Alert>
            </Snackbar>
      </Container>
    )
}


export default Login;


