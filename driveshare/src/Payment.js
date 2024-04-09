import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Divider} from '@mui/material';
import { db } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Payment = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBookings(){
            try{
                const userEmail = localStorage.getItem('userEmail');
                const dataSnapshot = await getDocs(query(collection(db, 'Bookings'), where('rentEmail', '==', userEmail), where('paid', '==', false)));
                const unPaidBookings = dataSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }));
                setBookings(unPaidBookings);
                console.log("Fetch success");
            }catch(error){
                console.error("Error fetching car listings:", error.message);
            }
        }

        fetchBookings();
    }, []);


    const handlePay = async (bookingId) => {

        try{
            const bookingDocRef = doc(db, 'Bookings', bookingId);
            await updateDoc(bookingDocRef, {
                paid: true
            });

            console.log('Booking payment successful');
        }catch(error){
            console.error('Error updating booking:', error.message);
        }
    };
    const handleBackButton = () => {
        navigate('/dashboard')
    }

return(
 <Container style={{ textAlign: 'center', marginTop: "25px"}}>
    <Box mt={3} sx={{ textAlign: 'left', position: 'absolute', top: 0, left: '10px' }}>
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
    </Box>
    <Typography variant="h4" gutterBottom>Payment</Typography>
    <Divider />
    {bookings.length === 0 ? (
            <Typography variant="h6" style={{ marginTop: "25px"}}>No Unpaid Bookings</Typography>
        ) : (
            bookings.map(booking => (
                <div key={booking.id}>
                    <Typography variant="subtitle1">Booking ID: {booking.id}</Typography>
                    <Typography variant="body1">Cost: ${booking.totalCost}</Typography>
                    <Button variant="contained" color="primary" onClick={() => handlePay(booking.id)}>Pay</Button>
                    <Divider />
                </div>
            ))
        )}
    
 </Container>
)
};
export default Payment;