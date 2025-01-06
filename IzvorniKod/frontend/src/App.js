import React, { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Prijava from './Prijava';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Registracija from './Registracija';
import NapraviPonudu from './NapraviPonudu';
import UrediProfil from './UrediProfil';
import DetaljiSusjed from './DetaljiSusjed';
import { GlobalProvider } from './GlobalContext';
import PonudeSusjeda from './PonudeSusjeda';
import RegistracijaVrsta from './RegistracijaVrsta';
import Tvrtke from './Tvrtke';
import DetaljiTvrtka from './DetaljiTvrtka';
import Dogadaji from './Dogadaji';
import KreirajDogadaj from './KreirajDogadaj';

function App() {
    //ako ne postoji token, tj. ako nije ulogiran
   /* if (!(localStorage.getItem("accessToken"))){
      return(    
        <GlobalProvider>
        <Router>
        <div className="App">
        <Routes>
            <Route path="/" element={<Prijava />} />
            <Route path="/prijava" element={<Prijava/>} />
            <Route path="/registracija" element={<Registracija />} />
        </Routes>
        </div>
        </Router>
        </GlobalProvider>
        );
        }
    else {*/
    return (
    <GlobalProvider>
    <Router>
      <div className="App">
        
        <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/napravi-ponudu" element={<NapraviPonudu />} />
            <Route path="/tvrtke" element={<Tvrtke />} />
            <Route path="/dogadaji" element={<Dogadaji />} />
            <Route path="/prijava" element={<Prijava/>} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/registracija-vrsta" element={<RegistracijaVrsta />} />
            <Route path="/uredi-profil" element={<UrediProfil />} />
            <Route path="/ponude-susjeda" element={<PonudeSusjeda />} />
            <Route path="/susjed/:id" element={<DetaljiSusjed />} />
            <Route path="/tvrtka/:id" element={<DetaljiTvrtka />} />
            <Route path="/tvrtka/:id" element={<DetaljiTvrtka />} />
            <Route path="/kreiraj-dogadaj" element={<KreirajDogadaj />} />  
        </Routes>
      </div>
    </Router>
    </GlobalProvider>
  );}
//}

export default App;
