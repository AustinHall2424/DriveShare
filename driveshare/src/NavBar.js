import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DriveShare App
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/dashbaord/rentalHistory">Rental History</Button>
          <Button color="inherit" component={Link} to="/dashboard/review">Review</Button>
          <Button color="inherit" component={Link} to="/dashboard/rent/payment">Payment</Button>
          <Button color="inherit" component={Link} to="/dashboard/messageboard">Message Board</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
