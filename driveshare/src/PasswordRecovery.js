import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, getDocs, where, query } from 'firebase/firestore';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showQuestions, setShowQuestions] = useState(false); // Track whether to show security questions
    const navigate = useNavigate();

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
                    setShowQuestions(true); // Show security questions after fetching
                } else {
                    console.log('User data or security questions not found');
                }
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error, maybe show a snackbar
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        const currentQuestion = securityQuestions[currentQuestionIndex];
        const userAnswer = answers[currentQuestion.question];
        if (userAnswer === currentQuestion.answer) {
            console.log('Correct answer for', currentQuestion.question);
            // Perform further action if the answer is correct
            // For now, just move to the next question
            if (currentQuestionIndex < securityQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        } else {
            console.log('Incorrect answer for', currentQuestion.question);
            // Show the next question
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Change your password</h2>
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
        </div>
    );
}

export default PasswordRecovery;
