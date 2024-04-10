import {React, useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert  } from '@mui/material';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ManageListings = () => {

    const [carListings, setCarListings] = useState([]);
    const navigate = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    // Fetch all Listings the current user is hosting
    useEffect(() => {
        async function fetchUserCarListings(){
            try{
                const userEmail = localStorage.getItem('userEmail');
                const dataSnapshot = await getDocs(query(collection(db, 'CarListings'), where('hostEmail', '==', userEmail)));
                const userCarListingsData = dataSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCarListings(userCarListingsData);
                console.log("Fetch success");
            }catch(error){
                console.error("Error fetching car listings:", error.message);
            }
        }

        fetchUserCarListings();
    }, []);

    const handleUpdateListing = async (id, updatedFields) => {
        try {
            const docRef = doc(db, 'CarListings', id);
            await updateDoc(docRef, updatedFields);
            console.log('Listing updated successfully');
            setMessage('Listing updated successfully.');
            setSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setMessage('Error updating listing.');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Error updating listing:', error);
        }
    };

    const handleRemoveListing = async (id) => {
        try {
            await deleteDoc(doc(db, 'CarListings', id));
            console.log('Listing removed successfully');
            setMessage('Listing removed successfully.');
            setSeverity('success');
            setOpenSnackbar(true);
            setCarListings(carListings.filter(car => car.id !== id));
        } catch (error) {
            setMessage('Error removing listing.');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error('Error removing listing:', error);
        }
    }

    const handleFieldChange = (id, field, value) => {
        const updatedListings = carListings.map((car) => {
            if (car.id === id) {
                return { ...car, [field]: value };
            }
            return car;
        });
        setCarListings(updatedListings);
    };

    const handleBackButton = () => {
        navigate('/dashboard/owner');
    };
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return(
        <Container>
            <Typography variant="h4" gutterBottom>Manage Your Listings</Typography>
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Model</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Mileage</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carListings.map((car) => (
                            <TableRow key={car.id}>
                                <TableCell>
                                <input
                                    type="text"
                                    value={car.model}
                                    onChange={(e) => handleFieldChange(car.id, 'model', e.target.value)}
                                />
                                </TableCell>
                                <TableCell>
                                <input
                                    type="text"
                                    value={car.year}
                                    onChange={(e) => handleFieldChange(car.id, 'year', e.target.value)}
                                />
                                </TableCell>
                                <TableCell>
                                <input
                                    type="text"
                                    value={car.mileage}
                                    onChange={(e) => handleFieldChange(car.id, 'mileage', e.target.value)}
                                />
                                </TableCell>
                                <TableCell>
                                <input
                                    type="text"
                                    value={car.location}
                                    onChange={(e) => handleFieldChange(car.id, 'location', e.target.value)}
                                />
                                </TableCell>
                                <TableCell>
                                <input
                                    type="text"
                                    value={car.price}
                                    onChange={(e) => handleFieldChange(car.id, 'price', e.target.value)}
                                />
                                </TableCell>
                                {/* Add more table cells for other properties */}
                                <TableCell>
                                    <Button variant='outlined' onClick={() => handleUpdateListing(car.id, car)}>Update</Button>
                                    <Button variant='outlined' onClick={() => handleRemoveListing(car.id)}>Remove</Button>
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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

export default ManageListings;