import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead,Snackbar,Alert, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';
import SearchBar from './SearchBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavBar from './NavBar';

    const Dashboard =  () => {
        const navigate = useNavigate();
        const image = process.env.PUBLIC_URL + '/images/newbackground2.png';
        const [carListings, setCarListings] = useState([]);
        const [searchQuery, setSearchQuery] = useState('');

        const [openSnackbar, setOpenSnackbar] = useState(false);
        const [message, setMessage] = useState('');
        const [severity, setSeverity] = useState('');

        useEffect(() => {
            async function fetchCarListings(){
                try{
                    const dataSnapshot = await getDocs(query(collection(db, 'CarListings')));
                    const carListingsData = dataSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setCarListings(carListingsData);
                    console.log("Fetch success");
                }catch(error){
                    console.error("Error fetching car listings:", error.message);
                }
            }

            fetchCarListings();
        }, []);

        const handleLogout = async () => {
            try {
                localStorage.removeItem('sessionToken'); // Clear session token
                localStorage.removeItem('userEmail'); // Clear user's email
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        };
        const handleSearchChange = (event) => {
            setSearchQuery(event.target.value);
        };

        const filteredCarListings = carListings.filter(car => {
            return (
                car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

        const handleRent = (carId, available) => {
            if(available){
                console.log("Car is available");
                navigate(`/dashboard/rent/${carId}`);
            }
            else{
                setMessage('Car is not available');
                setSeverity('error');
                setOpenSnackbar(true);
                console.log("Car is not available");
            }
            
        };
        const handleSnackbarClose = () => {
            setOpenSnackbar(false);
        }

        return (
            <main style={{ 
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
            }}>
                { <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.8, 
                    zIndex: -1,
                }} />}
                <NavBar/>
                <Container style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '25px', 
                    paddingBottom: '25px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    borderRadius: '10px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <SearchBar style={{ flex: 0.8 }} 
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by model, location"
                            /> 
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button onClick={() => navigate('./owner')}>
                                <AccountCircleIcon />
                                <Typography variant="caption">Host</Typography>
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                    
                </Container>
                <TableContainer component={Paper} style={{ marginTop: '20px', width: '75%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Host</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Mileage</TableCell>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCarListings.map((car, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{car.hostEmail}</TableCell>
                                        <TableCell>{car.model}</TableCell>
                                        <TableCell>{car.year}</TableCell>
                                        <TableCell>{car.mileage}</TableCell>
                                        <TableCell>{new Date(car.startDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                        <TableCell>{new Date(car.endDate.toDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                        <TableCell>{car.location}</TableCell>
                                        <TableCell>{car.price}</TableCell>
                                        <TableCell>{car.available ? "Available" : "Not Available"}</TableCell>
                                        <TableCell> <Button variant='contained' color='primary' onClick={() => handleRent(car.id, car.available)}>Rent</Button> 
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
            </main>
        );
    }

export default Dashboard;