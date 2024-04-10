import { React, useEffect, useState} from 'react';
import { db } from './firebase/config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Typography, TextField, Snackbar, Divider, Card, CardContent, Alert } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Review = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [renterReview, setRenterReview] = useState(0);
    const [hostReview, setHostReview] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');

    // Fetch all the bookings of the user
    useEffect(() => {
        async function fetchUserBookings(){
            try{
                const userEmail = localStorage.getItem('userEmail');
                const dataSnapshot = await getDocs(query(collection(db, 'Bookings'), where('rentEmail', '==', userEmail)));
                const history = [];

                for (const doc1 of dataSnapshot.docs) {
                    const bookingData = doc1.data();
                    const currentID = bookingData.listID;
                    const carListingRef = doc(db, 'CarListings', currentID);
                    const carListingDoc = await getDoc(carListingRef);

                    if (carListingDoc.exists()) {
                        const carListingData = carListingDoc.data();
                        history.push({
                            id: doc1.id,
                            ownerEmail: carListingData.hostEmail,
                            rentEmail: bookingData.rentEmail,
                            carModel: carListingData.model,
                            carYear: carListingData.year,
                            rentalCost: bookingData.totalCost,
                            startDate: bookingData.startDate,
                            endDate: bookingData.endDate,
                            renterReview: bookingData.renterReview,
                            hostReview: bookingData.hostReview
                        });
                    }
                }
                setBookings(history);
            } catch(error) {
                console.error("Error fetching car listings:", error.message);
            }
        }

        fetchUserBookings();
    }, []);

    const handleBackButton = () => {
        navigate('/dashboard')
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async (rentalId) => {
        try {
            const docRef = doc(db, 'Bookings', rentalId);
            await updateDoc(docRef, {
                renterReview: renterReview,
                hostReview: hostReview
            });
            console.log('Reviews updated successfully');
            setMessage('Reviews updated successfully.');
            setSeverity('success');
            setOpenSnackbar(true);  
        } catch(error) {
            console.error('Error updating reviews:', error.message);
            setMessage('Error updating reviews. Please try again.');
            setSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container>
            <Typography variant="h4">Review</Typography>
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
            <Divider />
            {bookings.map((rental, index) => (
                <Card key={index} variant="outlined" style={{ margin: '10px 0' }}>
                    <CardContent>
                        <Typography variant="h6">Car Mode: {rental.carModel}</Typography>
                        <Typography variant="body1">Car Year: {rental.carYear}</Typography>
                        <Typography variant="body1">Rental Cost: ${rental.rentalCost}</Typography>
                        <Typography variant="body2">Owner Email: {rental.ownerEmail}</Typography>
                        <Typography variant="body2">Renter Email: {rental.rentEmail}</Typography>
                        <Typography variant="body2">Start Date: {new Date(rental.startDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                        <Typography variant="body2">End Date: {new Date(rental.endDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                        <Typography variant="body2">Renter Review: {rental.renterReview}</Typography>
                        <Typography variant="body2">Host Review: {rental.hostReview}</Typography>
                        <TextField
                            label="Renter Review"
                            variant="outlined"
                            type='number'
                            fullWidth
                            inputProps={{ min: 0, max: 5 }}
                            value={renterReview}
                            onChange={(e) => setRenterReview(e.target.value)}
                            style={{ marginBottom: '10px', marginTop: "15px" }}
                        />
                        <TextField
                            label="Host Review"
                            variant="outlined"
                            type='number'
                            fullWidth
                            inputProps={{ min: 0, max: 5 }}
                            value={hostReview}
                            onChange={(e) => setHostReview(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleSubmit(rental.id)}
                            >
                            Submit Review
                        </Button>
                    </CardContent>
                </Card>
            ))}
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
}

export default Review;
