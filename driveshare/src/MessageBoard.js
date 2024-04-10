import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs, } from 'firebase/firestore';


const MessageBoard = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [email, setEmail] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const navigate = useNavigate();
    
    // Fetch all messages the user has sent or received
    useEffect(() => {
        async function fetchMessages() {
            try {
                const userEmail = localStorage.getItem('userEmail');
                const querySnapshotReceive =  await getDocs(query(collection(db, 'Messages'), where('recipientEmail', '==', userEmail)));
                const querySnapshotSent =  await getDocs(query(collection(db, 'Messages'), where('senderEmail', '==', userEmail)));
                
                const receivedMessages = [];
                querySnapshotReceive.forEach((doc) => {
                    receivedMessages.push({ id: doc.id, ...doc.data()});
                })
                const sentMessages = [];
                querySnapshotSent.forEach((doc) => {
                    sentMessages.push({ id: doc.id, ...doc.data()});
                })
                const allMessages = [...receivedMessages, ...sentMessages];

                if( allMessages.length > 0){
                    setMessages(allMessages);
                }
                else{
                    console.log('No Messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        }

        fetchMessages();
        
    }, []);
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        
    };
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }
    
    const handleEmailChange = async (e) => {
        setEmail(e.target.value);
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        if (message.trim() === '' || email.trim() === '') return;

        try {

            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('email', '==', email)));
            if (userQuerySnapshot.empty){
                console.log('User does not exist.');
                setSnackMessage('User does not exist.');
                setSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            const currentTime = new Date();
            await addDoc(collection(db, 'Messages'), {
                senderEmail: localStorage.getItem('userEmail'),
                recipientEmail: email,
                message: message.trim(),
                time: currentTime,
            })

            setMessage('');
            setEmail('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '25px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Back to Dashboard
                </Button>
                <Typography variant="h4">Message Board</Typography>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginTop="20px"
                style={{ overflowWrap: 'break-word' }}
            >
                {/* Display messages */}
                {/* <Box 
                    marginTop="20px" 
                    width="100%" 
                    maxHeight="400px" 
                    border="1px solid #ccc" 
                    borderRadius="8px" 
                    padding="5px"
                    overflowY="auto"
                    style={{ wordWrap: 'break-word' }} 
                >
                    {messages.sort((a, b) => a.time - b.time).map((msg, index) => (
                        <Typography key={index} variant="body1">
                           <i>From: {msg.senderEmail}</i> - <i>To: {msg.recipientEmail}</i><br />
                        {msg.message}<br/>
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(msg.time.toDate()).toLocaleString()}</span>
                        </Typography>
                    ))}
                </Box> */}
                <List
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        padding: "5px",
                        maxHeight: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        overflowY: "auto",
                    }}
                >
                    {messages.sort((a, b) => a.time - b.time).map((msg, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText
                                primary={
                                    <>
                                        <i>From: {msg.senderEmail}</i> - <i>To: {msg.recipientEmail}</i>
                                    </>
                                }
                                secondary={
                                    <>
                                        <span style={{ fontSize: '1rem', color: 'black' }}>{msg.message}</span>
                                        <br/>
                                        <span style={{ fontSize: '0.7rem', color: '#999' }}>
                                            {new Date(msg.time.toDate()).toLocaleString()}
                                        </span>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                {/* Input field for recipient's email */}
                <Box marginTop="20px" marginBottom="10px" width="100%">
                    <TextField
                        label="Recipient's Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleEmailChange}
                    />
        
                </Box>
                {/* Input field for new message */}
                <Box marginTop="20px" marginBottom="10px" width="100%">
                    <TextField
                        id="message-input"
                        label="Enter Message"
                        variant="outlined"
                        value={message}
                        onChange={handleMessageChange}
                        fullWidth
                    />
                </Box>
                
                {/* Buttons for sending and clearing messages */}
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="contained" color="primary" onClick={handleMessageSubmit}>
                        Send Message
                    </Button>
                    
                    <Button variant="contained" color="secondary" onClick={() => setMessages([])}>
                        Clear Messages
                    </Button>
                </Box>
            </Box>
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
                {snackMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MessageBoard;
