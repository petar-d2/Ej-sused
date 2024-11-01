import React, { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Prijava from './Prijava';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Registracija from './Registracija';
import NapraviPonudu from './NapraviPonudu';

function App() {

  const kvartovi = [
    {
        id: 1,
        image: "/images/header1.jpeg",
        name: "Trešnjevka"
    },
    {
        id: 2,
        image: "/images/header1.jpeg",
        name: "Špansko"
    },
    {
        id: 3,
        image: "/images/header1.jpeg",
        name: "Dubrava"
    }
  ];

  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
            <Route path="/" element={<Home kvartovi={kvartovi}/>} />
            <Route path="/napravi-ponudu" element={<NapraviPonudu />} />
            <Route path="/ponude" element={<Prijava />} />
            <Route path="/dogadaji" element={<Prijava />} />
            <Route path="/prijava" element={<Prijava/>} />
            <Route path="/registracija" element={<Registracija kvartovi={kvartovi}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
