import React, { useContext, useEffect, useState } from 'react';
import './styles/header.css';
import {useNavigate} from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    //odjava
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/');
    };

    //ako ne postoji token, tj. ako nije ulogiran
    if (!(localStorage.getItem("accessToken"))){
        return(
            <div className="header">
                <img className="header_slika" src='/static/images/header1.jpeg' />
                <div className="header_grid">
                    <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                    <button style={{minWidth : "120px"}} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                    <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                    <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>
                    <button className="header_gumb" onClick={() => navigate('/prijava')}>Prijava</button>
                    <button className="header_gumb" onClick={() => { navigate('/registracija'); window.location.reload();}}>Registracija</button>
                </div>
            </div>
        );
    }
    //ako je ulogiran onda makni "prijava" i "registracija" i prikaži "odjavi se" i "uredi profil"
    else{
        return(
            <div className="header">
                <img className="header_slika" src='/static/images/header1.jpeg' />
                <div className="header_grid">
                    <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                    <button style={{minWidth : "120px"}} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                    <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                    <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>
                    <button className="header_gumb" onClick={handleLogout}>Odjavi se</button>
                    <button className="header_gumb" onClick={() => navigate('/uredi-profil')}>Uredi profil</button>
                </div>
            </div>
        );
    }
}

export default Header;