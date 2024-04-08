import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('email', '==', email)));
            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();
                if (userData.email === email) {
                    setSecurityQuestions(userData.securityQuestions);
                    handleSecurityQuestions(userData.securityQuestions);
                } else {
                    setMessage('Email does not exist');
                    setSeverity('error');
                    setOpenSnackbar(true);
                }
            } else {
                setMessage('User not found');
                setSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setMessage('Authentication failed');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Authentication failed', error.message);
        }
    };

    const handleSecurityQuestions = (questions) => {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i].question;
            const answer = questions[i].answer;
            const userAnswer = answers[question]; // Get user's answer from the state

            if (userAnswer === answer) {
                console.log('Correct answer for', question);
                // Perform further action if the answer is correct
                return; // Exit the function if correct answer found
            } else {
                console.log('Incorrect answer for', question);
                if (i === questions.length - 1) {
                    console.log('Incorrect answer for all questions');
                    // Perform further action if all answers are incorrect
                }
            }
        }
    };

    const handleAnswerChange = (question, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: answer
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Change your password</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    type="email"
                    label="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <Button variant="contained" color="primary" type="submit">Submit</Button>
            </form>

            <List>
            {securityQuestions.map((question, index) => {
                return (
                    <ListItem key={index}>
                        <ListItemText primary={question.question} />
                        <TextField
                            label="Your Answer"
                            autoComplete="off"
                            value={answers[question.question] || ''}
                            onChange={(e) => handleAnswerChange(question.question, e.target.value)}
                        />
                    </ListItem>
                );
                })}
            </List>
        </div>
    );
}

export default PasswordRecovery;
