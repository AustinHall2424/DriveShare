import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import Login from './LoginPage';
import Payment from './Payment';
import Owner from './Owner';
import PasswordRecovery from './PasswordRecovery';
import RentPage from './RentPage';
import ManageListings from './ManageListings';
import MessageBoard from './MessageBoard';
import RentalHistory from './RentalHistory';
import Review from './Review';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login/>}></Route>
        <Route path='/register' element={ <RegisterPage/>}></Route>
        <Route path='/dashboard' element={ <Dashboard/>}></Route>
        <Route path='/dashboard/rent/payment' element={ <Payment/>}></Route>
        <Route path='/dashboard/owner' element={<Owner/>}></Route>
        <Route path='/dashboard/owner/manage' element={ <ManageListings/>}></Route>
        <Route path='/dashboard/rent/:carId' element={<RentPage/>}></Route>
        <Route path='/dashbaord/rentalHistory' element={ <RentalHistory/>}></Route>
        <Route path='/dashboard/review' element={ <Review/>}></Route>
        <Route path='/PasswordRecovery' element={<PasswordRecovery/>}></Route>'
        <Route path='/dashboard/messageboard' element={<MessageBoard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
