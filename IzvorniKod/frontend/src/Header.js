import React from 'react';
import './styles/header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/');
    };

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("accessToken");

    return (
        <div className="header">
            <h1>EJ SUSED</h1>
            <div className="header_grid">
                <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                <button style={{ minWidth: "120px" }} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>

                 {/*Conditionally render buttons based on login status*/} 
                {isLoggedIn ? (
                    <>
                        <button className="header_gumb" onClick={handleLogout}>Odjavi se</button>
                        <button className="header_gumb" onClick={() => navigate('/uredi-profil')}>Uredi profil</button>
                    </>
                ) : (
                    <>
                        <button className="header_gumb" onClick={() => navigate('/prijava')}>Prijava</button>
                        <button className="header_gumb" onClick={() => { navigate('/registracija'); window.location.reload(); }}>Registracija</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
