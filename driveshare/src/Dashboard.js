import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
//import { auth } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Owner from './Owner';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CarCard from './carCard';
import Message from './Message'; // Import Message component
import NavBar from './NavBar';

    const Dashboard =  () => {
        const navigate = useNavigate();
        const image = process.env.PUBLIC_URL + '/images/car2.png';
       
        const handleLogout = async () => {
            try {
                localStorage.removeItem('sessionToken'); // Clear session token
                localStorage.removeItem('userEmail'); // Clear user's email
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        };

        const handleSessionLogout = () => {
            localStorage.removeItem('sessionToken'); // Clear session token
            localStorage.removeItem('userEmail'); // Clear user's email
            // Redirect or perform other actions after logout
        };

        return (
            <main style={{ 
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'flex-start',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.5, 
                    zIndex: -1,
                }} />
                <NavBar></NavBar>
                <Container style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '50px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                    width: '100%',
                    position: 'relative',
                }}>
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
                </Container>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'flex-start', // Changed back to 'flex-start'
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '40px', // Increased margin-top
                    paddingLeft: '40px', // Increased padding-left
                    marginLeft: '250px', // Added margin-left
                }}>
                <CarCard />
                
                </div>
            
            </main>
        );
    }

export default Dashboard;
