import React, { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Prijava from './Prijava';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Registracija from './Registracija';
import UrediProfil from './UrediProfil';
import DetaljiSusjed from './DetaljiSusjed';
import { GlobalProvider } from './GlobalContext';
import Susjedi from './Susjedi';
import RegistracijaVrsta from './RegistracijaVrsta';
import Tvrtke from './Tvrtke';
import DetaljiTvrtka from './DetaljiTvrtka';
import Dogadaji from './Dogadaji';
import KreirajDogadaj from './KreirajDogadaj';
import DetaljiDogadaj from './DetaljiDogadaj';
import MojiDogadaji from './MojiDogadaji';
import NapraviZahtjev from './NapraviZahtjev';
import Zahtjevi from './Zahtjevi';
import MojiZahtjevi from './MojiZahtjevi';
import AdminPrikaz from './AdminPrikaz';
import MojePonude from './MojePonude';
import NapraviPonudu from './NapraviPonudu';
import DetaljiZahtjev from './DetaljiZahtjev';
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
            <Route path="/tvrtke" element={<Tvrtke />} />
            <Route path="/dogadaji" element={<Dogadaji />} />
            <Route path="/prijava" element={<Prijava/>} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/registracija-vrsta" element={<RegistracijaVrsta />} />
            <Route path="/uredi-profil" element={<UrediProfil />} />
            <Route path="/susjedi" element={<Susjedi />} />
            <Route path="/susjed/:id" element={<DetaljiSusjed />} />
            <Route path="/tvrtka/:id" element={<DetaljiTvrtka />} />
            <Route path="/dogadaj/:id" element={<DetaljiDogadaj />} />
            <Route path="/zahtjev/:id" element={<DetaljiZahtjev />} />
            <Route path="/kreiraj-dogadaj" element={<KreirajDogadaj />} />
            <Route path="/moji-dogadaji" element={<MojiDogadaji />} />
            <Route path="/napravi-zahtjev" element={<NapraviZahtjev />} />
            <Route path="/moji-zahtjevi" element={<MojiZahtjevi />} />
            <Route path="/zahtjevi" element={<Zahtjevi />} />
            <Route path="/admin-prikaz" element={<AdminPrikaz />} />
            <Route path="/moje-ponude" element={<MojePonude/>} />
            <Route path="/napravi-ponudu" element={<NapraviPonudu/>} />
        </Routes>
      </div>
    </Router>
    </GlobalProvider>
  );}
//}

export default App;
