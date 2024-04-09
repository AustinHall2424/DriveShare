import {React , useState, useEffect }from "react";
import { useParams } from 'react-router-dom';
import { Typography, Button, Container, TextField,  Snackbar, Alert  } from '@mui/material';
import { db } from './firebase/config';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const RentPage = () => {
    const { carId } = useParams();
    const [carDetails, setCarDetails] = useState(null);
    const [rentStart, setRentStart] = useState('');
    const [rentEnd, setRentEnd] = useState('');
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('');


    useEffect(() => {
        async function fetchCarDetails() {
            try {
                const docRef = doc(db, 'CarListings', carId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCarDetails(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching car details:', error.message);
            }
        }

        fetchCarDetails();
    }, [carId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rentStart || !rentEnd){
            setMessage('Please fill out all fields.');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        const userEmail = localStorage.getItem('userEmail');
        const startTemp = new Date(rentStart + "T00:00:00");
        const endTemp = new Date(rentEnd + "T00:00:00");

        // Check dates to make sure they are valid
        if(startTemp < carDetails.startDate.toDate() ||
            endTemp > carDetails.endDate.toDate() || 
            endTemp < startTemp){
            setMessage('Invalid dates.');
            setSeverity('error');
            setOpenSnackbar(true);     
            return;
        }
        const differentInMs = endTemp.getTime() - startTemp.getTime();
        let differentInDays = Math.ceil(differentInMs / (1000 * 60 * 60 * 24));
        differentInDays = differentInDays + 1;
        const totalCost = differentInDays * carDetails.price;


        const data = {
            listID: carId,
            rentEmail: userEmail,
            startDate: startTemp,
            endDate: endTemp,
            totalCost: totalCost,
            paid: false,
            renterReview: 0,
            hostReview:0
        }
        setMessage('Success.');
        setSeverity('success');
        setOpenSnackbar(true);

        try{
            const bookingRef = await addDoc(collection(db, 'Bookings'), data);
            setMessage('Booking successful!');
            setSeverity('success');
            setOpenSnackbar(true);

            await updateDoc(doc(db, 'CarListings', carId), {
                available: false
            })

            navigate('/dashboard/rent/payment');
        }catch(error){
            setMessage('Error adding booking.');
            setSeverity('error');
            setOpenSnackbar(true);
            console.error("Error adding booking:", error.message);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }
    const handleBackButton = () => {
        navigate('/dashboard')
    }

    if (!carDetails) {
        return <Typography>Loading...</Typography>;
    }

    return(
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: "25px"}}>
            <Typography variant='h4'>Rent this Vehicle</Typography>
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
       
            <Card style={{ maxWidth: 345, margin: 'auto', marginTop: 50, padding: 20, backgroundColor: '#f5f5f5' }}>
                <CardContent>
                    <Typography variant="h4">{carDetails.model}</Typography>
                    <Typography>Host: {carDetails.hostEmail}</Typography>
                    <Typography>Year: {carDetails.year}</Typography>
                    <Typography>Mileage: {carDetails.mileage}</Typography>
                    <Typography>Start: {new Date(carDetails.startDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                    <Typography>End: {new Date(carDetails.endDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                    <Typography>Location: {carDetails.location}</Typography>
                    <Typography>Price per day: {carDetails.price}</Typography>
                    <Typography>Available: {carDetails.available ? "Available" : "Not Available"}</Typography>
                    <br />
                </CardContent>
            </Card>
            <form onSubmit={handleSubmit} style={{ marginTop: "25px", display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                <TextField 
                    name="Rent From" 
                    type='date'
                    variant='outlined'
                    label="Rent Start Date:"
                    value={rentStart} 
                    style={{ marginBottom: "15px"}}
                    onChange={(e) => setRentStart(e.target.value)} 
                    required
                    InputLabelProps={{ shrink: true }}
                />

                <TextField 
                    name="Rent To" 
                    type='date'
                    variant='outlined'
                    label="Rent End Date:"
                    value={rentEnd} 
                    style={{ marginBottom: "15px"}}
                    onChange={(e) => setRentEnd(e.target.value)} 
                    required 
                    InputLabelProps={{ shrink: true }}
                />
                
                <Button variant="contained" onClick={handleSubmit} color="primary" style={{ marginBottom: '15px'}}>Rent</Button>
            </form>
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

export default RentPage;