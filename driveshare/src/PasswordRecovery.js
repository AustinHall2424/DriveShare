import React, { useState } from 'react';
import { Button, TextField, ListItemText, Snackbar, Alert  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, getDocs, where, query } from 'firebase/firestore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showQuestions, setShowQuestions] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordToShow, setPasswordToShow] = useState(false);
    const navigate = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('email', '==', email)));
            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();
                if (userData.email === email && userData.securityQuestions) {
                    const questionsData = Object.entries(userData.securityQuestions).map(([question, answer]) => ({ question, answer }));
                    setSecurityQuestions(questionsData);
                    setShowQuestions(true);
                    setPassword(userData.password);
                } else {
                    console.log('User data or security questions not found');
                }
            } else {
                console.log('User not found');

                setMessage('Correct!');
                setSeverity('error');
                setOpenSnackbar(true);
                }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        const currentQuestion = securityQuestions[currentQuestionIndex];
        const userAnswer = answers[currentQuestion.question];

        if (userAnswer === currentQuestion.answer) {
            console.log('Correct answer for', currentQuestion.question);
            
            setMessage('Correct!');
            setSeverity('success');
            setOpenSnackbar(true);

            if (currentQuestionIndex < securityQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                console.log('All security questions answered correctly');

                setMessage('All security questions answered correctly.');
                setSeverity('success');
                setOpenSnackbar(true);

                setPasswordToShow(true);
            }
        } else {
            console.log('Incorrect answer for', currentQuestion.question);
            if (currentQuestionIndex < securityQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    const handleBackButton = () => {
        navigate('/');
    };
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackButton}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px', 
                }}
                >
                Back
            </Button>
            <h2>Password Recovery</h2>
            <form onSubmit={handleSubmitEmail} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    type="email"
                    label="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <Button variant="contained" color="primary" type="submit">Submit</Button>
            </form>

            {showQuestions && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ListItemText primary={securityQuestions[currentQuestionIndex].question} />
                    <TextField
                        label="Your Answer"
                        autoComplete="off"
                        value={answers[securityQuestions[currentQuestionIndex].question] || ''}
                        onChange={(e) => handleAnswerChange(securityQuestions[currentQuestionIndex].question, e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmitAnswer}>Submit Answer</Button>
                </div>
            )}

            {passwordToShow && (
                <div>
                    <p>Your password is: {password}</p>
                    <Button variant="contained" color="primary" onClick={handleBackButton}>Back to Login</Button>
                </div>
            )}
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
        </div>
    );
}

export default PasswordRecovery;
