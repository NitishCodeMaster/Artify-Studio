import React from 'react'
import { Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';

import Community from './pages/Community';
import Discover from './pages/Discover'; 
import Home from './pages/Home';
import Learn from './pages/Learn';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Events from './pages/Events';
import MarketPlace from './pages/MarketPlace';

const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/community" element={<Community />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/events" element={<Events />} />
          <Route path="/marketplace" element={<MarketPlace />} />
        </Routes>
      </div>
    </>
  )
}

export default App