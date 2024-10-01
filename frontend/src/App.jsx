import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Shop from './Pages/Shop';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import UserLogin from './Pages/UserLogin';
import Preferences from './Pages/Preferences';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userlogin" element={(sessionStorage.getItem('UserLoggedIn') === 'true') ? <Navigate to="/preferences" /> : <UserLogin />} />
          <Route path="/dashboard" element={<Dashboard /> } />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
