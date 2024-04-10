import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { db } from './firebase/config';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


    const Owner = () => {
        const navigate = useNavigate();
        const [model, setModel] = useState('');
        const [year, setYear] = useState('');
        const [mileage, setMileage] = useState('');
        const [availabilityStart, setAvailabilityStart] = useState('');
        const [availabilityEnd, setAvailabilityEnd] = useState('');
        const [location, setLocation] = useState('');
        const [price, setPrice] = useState('');

        const [openSnackbar, setOpenSnackbar] = useState(false);
        const [message, setMessage] = useState('');
        const [severity, setSeverity] = useState('');


        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!model || !year || !mileage || !availabilityStart || !availabilityEnd || !location || !price) {
                setMessage('Please fill out all fields.');
                setSeverity('error');
                setOpenSnackbar(true);
                return;
            }

            const userEmail = localStorage.getItem('userEmail');
            const mileageInt = parseInt(mileage, 10);
            const priceFloat = parseFloat(price);
            // Convert data types to be usable
            const startTemp = new Date(availabilityStart + "T00:00:00");
            const endTemp = new Date(availabilityEnd + "T00:00:00");

            if (isNaN(mileageInt) || isNaN(priceFloat)){
                setMessage('Mileage or price is not a number.');
                setSeverity('error');
                setOpenSnackbar(true);
                return;
            }

            console.log(startTemp);
            console.log(endTemp);

            const data = {
                hostEmail: userEmail,
                model: model,
                year: year,
                mileage: mileageInt,
                startDate: startTemp,
                endDate: endTemp,
                location: location,
                price: priceFloat,
                available: true
            }

            try {
                const carRef = await addDoc(collection(db, 'CarListings'), data);
                setMessage('Car Listing Posted!');
                setSeverity('success');
                setOpenSnackbar(true);
                navigate('/dashboard');
            } catch(error) {
                console.error("Error adding car:", error);
            }

        };

        const handleBackButton = () => {
            navigate('/dashboard');
        }
        const handleSnackbarClose = () => {
            setOpenSnackbar(false);
        }
        const handleManage = () => {
            navigate('/dashboard/owner/manage')
        }
            
        return (
            <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: "25px"}}>
                <Typography variant='h4'>Host Vehicle</Typography>
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
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: "15"}}>
                    <TextField 
                        name="model" 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)} 
                        label="Model" 
                        required 
                    />
                    <TextField 
                        name="year" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        label="Year" 
                        required 
                    />
                    <TextField 
                        name="mileage" 
                        value={mileage} 
                        onChange={(e) => setMileage(e.target.value)} 
                        label="Mileage" 
                        required 
                    />
                    <TextField 
                        name="availability From" 
                        type='date'
                        variant='outlined'
                        label="Available from:"
                        value={availabilityStart} 
                        onChange={(e) => setAvailabilityStart(e.target.value)} 
                        required
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField 
                        name="availability To" 
                        type='date'
                        variant='outlined'
                        label="Available To:"
                        value={availabilityEnd} 
                        onChange={(e) => setAvailabilityEnd(e.target.value)} 
                        required 
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField 
                        name="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        label="Location" 
                        required 
                    />
                    <TextField 
                        name="price" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        label="Price per day" 
                        required 
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        Add Car
                    </Button>
                </form>
                <Button 
                    variant='contained' 
                    color='primary' 
                    onClick={handleManage}
                    style={{ marginTop: "25px"}}
                >
                    Manage Listings
                </Button>
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
        );
    };

export default Owner;