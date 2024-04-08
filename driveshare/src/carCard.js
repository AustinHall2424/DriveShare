import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CarCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image=""
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Car
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Car Information
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Rent</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}