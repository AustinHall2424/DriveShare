import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
//import { createUserWithEmailAndPassword } from 'firebase/auth';

const securityQuestions = [
    "What was the name of your favorite childhood pet?",
    "What is your favorite sport?",
    "What year was your father born?",
    "What month were you born in?",
    "What year were you born in?",
    "What was the name of your Third grade math teacher?"
]


const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedQuestion1, setSelectedQuestion1] = useState('');
    const [selectedQuestion2, setSelectedQuestion2] = useState('');
    const [selectedQuestion3, setSelectedQuestion3] = useState('');

    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailExistsQuery = query(collection(db, 'Users'), where('email', '==', email));
        const emailExistsSnapshot = await getDocs(emailExistsQuery);
        if(!emailExistsSnapshot.empty){
            console.error('Registration failed: Email already exists');
            setMessage('Registration failed. Email already exists.');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        
        try{
            const userRef = await addDoc(collection(db, 'Users'), {
                email: email,
                password: password,
                securityQuestions: {
                    [selectedQuestion1]: answer1,
                    [selectedQuestion2]: answer2,
                    [selectedQuestion3]: answer3
                }
            });

            setMessage('Registration Successful!');
            setSeverity('success');
            setOpenSnackbar(true);

            console.log('User added with ID: ', userRef.id);
            navigate('/dashboard')
        } catch(error) {
            setMessage('Registration failed.');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Registration failed', error.message);
        }
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
      }

    return(
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: "25px"}}>
        <Typography variant='h4'>Sign Up</Typography>
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
            <Select
                value={selectedQuestion1}
                onChange={(e) => setSelectedQuestion1(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                >
                <MenuItem value="" disabled>Select Security Question 1</MenuItem>
                {securityQuestions.map((question, index) => (
                    <MenuItem key={index} value={question}>{question}</MenuItem>
                ))}
            </Select>
            <TextField
                label="Answer 1"
                variant='outlined'
                fullWidth
                margin='normal'
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
            />
            <Select
                    value={selectedQuestion2}
                    onChange={(e) => setSelectedQuestion2(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                >
                    <MenuItem value="" disabled>Select Security Question 2</MenuItem>
                    {securityQuestions.map((question, index) => (
                        <MenuItem key={index} value={question}>{question}</MenuItem>
                    ))}
            </Select>
            <TextField
                label="Answer 2"
                variant='outlined'
                fullWidth
                margin='normal'
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
            />
            <Select
                    value={selectedQuestion3}
                    onChange={(e) => setSelectedQuestion3(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                >
                    <MenuItem value="" disabled>Select Security Question 3</MenuItem>
                    {securityQuestions.map((question, index) => (
                        <MenuItem key={index} value={question}>{question}</MenuItem>
                    ))}
            </Select>
            <TextField
                label="Answer 3"
                variant='outlined'
                fullWidth
                margin='normal'
                value={answer3}
                onChange={(e) => setAnswer3(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "15px"}}
                fullWidth
                type="submit"
            >
                Register
            </Button>
            </form>
            <Typography variant="body1" style={{ marginTop: "25px"}}>
                Already have an account? <Link to="/">Login</Link>
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


export default RegisterPage;


