import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
//import { auth } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import SearchBar from './SearchBar';
import Owner from './Owner';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CarCard from './carCard';
import Message from './Message'; // Import Message component
import NavBar from './NavBar';

    const Dashboard =  () => {
        const navigate = useNavigate();
        const image = process.env.PUBLIC_URL + '/images/backgroundCars.PNG';
        const [carListings, setCarListings] = useState([]);
        

        useEffect(() => {
            async function fetchCarListings(){
                try{
                    //const data = await query(collection(db, 'CarListings'));
                    const dataSnapshot = await getDocs(query(collection(db, 'CarListings')));
                    //console.log(dataSnapshot.docs);
                    const carListingsData = dataSnapshot.docs.map(doc => doc.data());
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

        // const handleSessionLogout = () => {
        //     localStorage.removeItem('sessionToken'); // Clear session token
        //     localStorage.removeItem('userEmail'); // Clear user's email
        //     // Redirect or perform other actions after logout
        // };

        return (
            <main style={{ 
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
                // backgroundImage: `url(${image})`,
                // backgroundPosition: 'center',
                // backgroundSize: 'cover',
                // backgroundRepeat: 'no-repeat',
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
                    paddingTop: '50px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <SearchBar style={{ flex: 0.6 }} />
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
                                    {/* <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell> */}
                                    <TableCell>Location</TableCell>
                                    <TableCell>Price</TableCell>
                                    {/* <TableCell>Status</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {carListings.map((car, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{car.hostEmail}</TableCell>
                                        <TableCell>{car.model}</TableCell>
                                        <TableCell>{car.year}</TableCell>
                                        <TableCell>{car.mileage}</TableCell>
                                        {/* <TableCell>{car.startDate}</TableCell>
                                        <TableCell>{car.endDate}</TableCell> */}
                                        <TableCell>{car.location}</TableCell>
                                        <TableCell>{car.price}</TableCell>
                                        {/* <TableCell>{car.available}</TableCell> */}
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                {/* <div style={{ 
                    display: 'flex',
                    justifyContent: 'flex-start', // Changed back to 'flex-start'
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '40px', // Increased margin-top
                    paddingLeft: '40px', // Increased padding-left
                    marginLeft: '250px', // Added margin-left
                }}> */}
                {/* <CarCard /> */}
                
                {/* </div> */}
            
            </main>
        );
    }

export default Dashboard;