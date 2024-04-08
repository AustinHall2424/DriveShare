import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import { db } from './firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import NavBar from './NavBar';

const Payment = () => {

    const [payAmount, setPayAmount] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
       
    }

    return(
        <Container>
            <NavBar/>    
            <br></br><br></br>
            <Typography variant='h4'>Payment</Typography>
            <form onSubmit={handleSubmit}>
            <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                margin="normal"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
            >Submit
            </Button>
            </form>
        <br/><br/>
        <Typography variant='h6'>Balance: {payAmount} </Typography>
        </Container>
    )
}

export default Payment;