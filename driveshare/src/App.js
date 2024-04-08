import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import Login from './LoginPage';
import Payment from './Payment';
import Owner from './Owner';
import PasswordRecovery from './PasswordRecovery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login/>}></Route>
        <Route path='/register' element={ <RegisterPage/>}></Route>
        <Route path='/dashboard' element={ <Dashboard/>}></Route>
        <Route path='/dashboard/payment' element={ <Payment/>}></Route>
        <Route path='/dashboard/owner' element={<Owner/>}></Route>
        <Route path='/PasswordRecovery' element={<PasswordRecovery/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
