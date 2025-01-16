import React, { useState } from 'react';
import './styles/header.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const pageTitles = {
        '/': 'Početna',
        '/tvrtke': 'Tvrtke',
        '/ponude-susjeda': 'Ponude susjeda',
        '/dogadaji': 'Događaji',
        '/moji-zahtjevi': 'Moji zahtjevi',
        '/napravi-zahtjev': 'Novi zahtjev',
        '/moji-dogadaji': 'Moji događaji',
        '/kreiraj-dogadaj': 'Novi događaj',
        '/moje-ponude': 'Moje ponude',
        '/napravi-ponudu': 'Nova ponuda',
        '/uredi-profil': 'Uredi profil',
        '/prijava': 'Prijava',
        '/registracija': 'Registracija',
    };

    const currentPage = pageTitles[location.pathname] || '';

    const handleLogout = async () => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");
        const google = localStorage.getItem("googleToken");
        try {
            await axios.post(window.location.href.replace(window.location.pathname, '/') + "odjava/", { access, refresh, google });
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("googleToken");
        Cookies.remove("access");
        Cookies.remove("refresh");
        Cookies.remove("google");
        localStorage.removeItem('user');
        navigate('/');
        alert("Uspješno ste odjavljeni!");
    };

    const isLoggedIn = () => {
        return localStorage.getItem("accessToken") !== null;
    };

    const isSusjed2 = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            handleLogout();
            return false;
        }
        return userData.isSusjed;
    };

    const isVolonter2 = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            handleLogout();
            return false;
        }
        return userData.isVolonter;
    };

    const isTvrtka2 = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            handleLogout();
            return false;
        }
        return userData.isTvrtka;
    };

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
    };

    const isMobile = true; // Set to `useMediaQuery` if necessary

    return (
        <div className="header">
            {isMobile ? (
                <>
                    <button className="hamburger" onClick={handleDropdownClick}>
                        ☰
                    </button>
                    <div className="header-title-container">
                        {currentPage && <div className="header-subtitle">{currentPage}</div>}
                    </div>
                    <h1 className="header-right">
                        Ej Sused
                    </h1>

                    
                    {isDropdownOpen && (
                        <div className="dropdown_menu">
                            <button className="header_gumb" onClick={() => handleNavigate('/')}>Početna</button>
                            {isLoggedIn() ? (
                                <>
                                    <button className="header_gumb" onClick={() => handleNavigate('/tvrtke')}>Tvrtke</button>
                                    <button className="header_gumb" onClick={() => handleNavigate('/ponude-susjeda')}>Ponude susjeda</button>
                                    <button className="header_gumb" onClick={() => handleNavigate('/dogadaji')}>Događaji</button>
                                    {isSusjed2() && (
                                        <>
                                            <button className="header_gumb" onClick={() => handleNavigate('/moji-zahtjevi')}>Moji zahtjevi</button>
                                            <button className="header_gumb" onClick={() => handleNavigate('/napravi-zahtjev')}>Novi zahtjev</button>
                                            {isVolonter2() && (
                                                <>
                                                    <button className="header_gumb" onClick={() => handleNavigate('/moji-dogadaji')}>Moji događaji</button>
                                                    <button className="header_gumb" onClick={() => handleNavigate('/kreiraj-dogadaj')}>Novi događaj</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {isTvrtka2() && (
                                        <>
                                            <button className="header_gumb" onClick={() => handleNavigate('/moje-ponude')}>Moje ponude</button>
                                            <button className="header_gumb" onClick={() => handleNavigate('/napravi-ponudu')}>Nova Ponuda</button>
                                        </>
                                    )}
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
                    <h1 className="header-title">
                        Ej Sused
                        {currentPage && <div className="header-subtitle">{currentPage}</div>}
                    </h1>
                    <div className="header_grid">
                        <button className="header_gumb" onClick={() => handleNavigate('/')}>Početna</button>
                        {isLoggedIn() ? (
                            <>
                                
                                <button className="header_gumb" onClick={() => handleNavigate('/tvrtke')}>Tvrtke</button>
                                <button className="header_gumb" onClick={() => handleNavigate('/ponude-susjeda')}>Ponude susjeda</button> 
                                <button className="header_gumb" onClick={() => handleNavigate('/dogadaji')}>Događaji</button>
                                {isSusjed2() && (
                                    <>
                                        <button className="header_gumb" onClick={() => handleNavigate('/moji-zahtjevi')}>Moji zahtjevi</button>
                                        <button className="header_gumb" onClick={() => handleNavigate('/napravi-zahtjev')}>Novi zahtjev</button>
                                        {isVolonter2() && (
                                            <>
                                                <button className="header_gumb" onClick={() => handleNavigate('/moji-dogadaji')}>Moji događaji</button>
                                                <button className="header_gumb" onClick={() => handleNavigate('/kreiraj-dogadaj')}>Novi događaj</button>
                                            </>
                                        )}
                                    </>
                                )}
                                {isTvrtka2() && (
                                    <>
                                        <button className="header_gumb" onClick={() => handleNavigate('/moje-ponude')}>Moje ponude</button>
                                        <button className="header_gumb" onClick={() => handleNavigate('/napravi-ponudu')}>Nova Ponuda</button>
                                    </>
                                )}
                                <button className="header_gumb" onClick={handleLogout}>Odjavi se</button>
                                <button className="header_gumb" onClick={() => handleNavigate('/uredi-profil')}>Uredi profil</button> 
                            </>
                        ) : (
                            <>
                                <button className="header_gumb" onClick={() => handleNavigate('/prijava')}>Prijava</button>
                                <button className="header_gumb" onClick={() => { handleNavigate('/registracija'); window.location.reload(); }}>Registracija</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Header;
