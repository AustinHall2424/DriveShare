import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Select, Divider} from '@mui/material';
import { db } from './firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import NavBar from './NavBar';
import { Box } from '@mui/material';


const Payment = () => {
    const [totalCost, setTotalCost] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
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
                console.log(bookings);
                //setCarListings(carListingsData);
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
        // Handle payment logic here
    };

return(
 <Container style={{ textAlign: 'center', marginTop: "25px"}}>
    <Box mt={3} sx={{ textAlign: 'left', position: 'absolute', top: 0, left: '10px' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>Back</Button>
    </Box>
    <Typography variant="h4" gutterBottom>Payment</Typography>
    <Divider />
    {bookings.map(booking => (
        <div key={booking.id}>
             <Typography variant="subtitle1">Booking ID: {booking.id}</Typography>
             <Typography variant="body1">Cost: ${booking.totalCost}</Typography>
             <Button variant="contained" color="primary" onClick={() => handlePay(booking.id)}>Pay</Button>
             <Divider />
        </div>
    ))}
    
 </Container>
)
};
export default Payment;