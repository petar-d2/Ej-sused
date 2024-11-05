import React, { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Prijava from './Prijava';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Registracija from './Registracija';
import NapraviPonudu from './NapraviPonudu';
import UrediProfil from './UrediProfil';
import { GlobalProvider } from './GlobalContext';

function App() {

  return (
    <GlobalProvider>
    <Router>
      <div className="App">
        <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/napravi-ponudu" element={<NapraviPonudu />} />
            <Route path="/ponude" element={<Prijava />} />
            <Route path="/dogadaji" element={<Prijava />} />
            <Route path="/prijava" element={<Prijava/>} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/uredi-profil" element={<UrediProfil />} />
        </Routes>
      </div>
    </Router>
    </GlobalProvider>
  );
}

export default App;
