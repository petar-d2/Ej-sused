import React, { useState } from 'react';
import './styles/header.css';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate('/');
    };

    const isLoggedIn = localStorage.getItem("accessToken");

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen); 
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsDropdownOpen(false); 
    };

    return (
        <div className="header">
            {isMobile ? (
                <>
                    <button className="hamburger" onClick={handleDropdownClick}>
                        ☰
                    </button>
                    <h1 className="header-title">EJ SUSED</h1>
                    {isDropdownOpen && (
                        <div className="dropdown_menu">
                            <button className="header_gumb" onClick={() => handleNavigate('/')}>Početna</button>
                            <button style={{ minWidth: "120px" }} className="header_gumb" onClick={() => handleNavigate('/napravi-ponudu')}>Napravi ponudu</button>
                            <button className="header_gumb" onClick={() => handleNavigate('/ponude')}>Ponude</button>
                            <button className="header_gumb" onClick={() => handleNavigate('/dogadaji')}>Događaji</button>
                            {isLoggedIn ? (
                                <>
                                    <button className="header_gumb" onClick={() => { handleLogout(); setIsDropdownOpen(false); }}>Odjavi se</button>
                                    <button className="header_gumb" onClick={() => handleNavigate('/uredi-profil')}>Uredi profil</button>
                                </>
                            ) : (
                                <>
                                    <button className="header_gumb" onClick={() => handleNavigate('/prijava')}>Prijava</button>
                                    <button className="header_gumb" onClick={() => { handleNavigate('/registracija'); window.location.reload(); }}>Registracija</button>
                                </>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1 className="header-title">EJ SUSED</h1>
                    <div className="header_grid">
                        <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                        <button style={{ minWidth: "120px" }} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                        <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                        <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>
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
                </>
            )}
        </div>
    );
};

export default Header;
