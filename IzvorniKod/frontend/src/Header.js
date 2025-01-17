import React, { useEffect, useState } from 'react';
import './styles/header.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('');

    const pageTitles = {
        '/': 'Početna',
        '/tvrtke': 'Tvrtke',
        '/susjedi': 'Susjedi',
        '/dogadaji': 'Događaji',
        '/moji-zahtjevi': 'Moji zahtjevi',
        '/zahtjevi': 'Zahtjevi',
        '/napravi-zahtjev': 'Novi zahtjev',
        '/moji-dogadaji': 'Moji događaji',
        '/kreiraj-dogadaj': 'Novi događaj',
        '/moje-ponude': 'Moje ponude',
        '/napravi-ponudu': 'Nova ponuda',
        '/uredi-profil': 'Uredi profil',
        '/prijava': 'Prijava',
        '/registracija': 'Registracija',

        '/home': 'Početna',
        '/home/': 'Početna',
        '/tvrtke/': 'Tvrtke',
        '/Susjedi/': 'Susjedi',
        '/dogadaji/': 'Događaji',
        '/moji-zahtjevi/': 'Moji zahtjevi',
        '/zahtjevi/': 'Zahtjevi',
        '/napravi-zahtjev/': 'Novi zahtjev',
        '/moji-dogadaji/': 'Moji događaji',
        '/kreiraj-dogadaj/': 'Novi događaj',
        '/moje-ponude/': 'Moje ponude',
        '/napravi-ponudu/': 'Nova ponuda',
        '/uredi-profil/': 'Uredi profil',
        '/prijava/': 'Prijava',
        '/registracija/': 'Registracija',
    };

    useEffect(() => {
        // Postavljanje naslova na temelju trenutne lokacije
        const pageTitle = pageTitles[location.pathname] || '';
        setCurrentPage(pageTitle);
    }, [location.pathname]);

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
    
    const isAdmin = () => {
        if (typeof(localStorage.getItem("accessToken")) != undefined && localStorage.getItem("accessToken") != null) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData==null){
                handleLogout();
            }
            return userData.isNadlezna;
        } else {
            return false;
        }
    }


    { // login cookie provjera
        var refresh = Cookies.get("refresh");
        var access = Cookies.get("access");
        var google = Cookies.get("google");
        if (typeof(refresh) != undefined && typeof(access) != undefined && refresh != null && access != null){
            localStorage.setItem('accessToken', refresh);
            localStorage.setItem('refreshToken', access);
            if (typeof(google) != undefined && google != null) localStorage.setItem('googleToken', google);
        }
    }

    /*useEffect(() => {
        if (isLoggedIn()) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setLoggedUser(userData); // Update state with user data
            console.log(userData);
        } else {
            setLoggedUser(null); // Reset state if logged out
        }
    }, []);*/


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
                                    <button className="header_gumb" onClick={() => handleNavigate('/susjedi')}>Susjedi</button>
                                    <button className="header_gumb" onClick={() => handleNavigate('/dogadaji')}>Događaji</button>
                                    {isSusjed2() && (
                                        <>
                                            <button className="header_gumb" onClick={() => handleNavigate('/zahtjevi')}>Zahtjevi</button>
                                            <button className="header_gumb" onClick={() => handleNavigate('/moji-zahtjevi')}>Moji zahtjevi</button>
                                            <button className="header_gumb" onClick={() => handleNavigate('/napravi-zahtjev')}>Novi zahtjev</button>
                                            {isVolonter2() && (
                                                <>
                                                    <button className="header_gumb" onClick={() => handleNavigate('/moji-dogadaji')}>Moji događaji</button>
                                                    <button className="header_gumb" onClick={() => handleNavigate('/kreiraj-dogadaj')}>Novi događaj</button>
                                                </>
                                            )}
                                            {isAdmin() && (
                                                 <button className="header_gumb" onClick={() => handleNavigate('/admin-prikaz')}>Brisanje komentara i korisnika</button>
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
                                <button className="header_gumb" onClick={() => handleNavigate('/susjedi')}>Susjedi</button> 
                                <button className="header_gumb" onClick={() => handleNavigate('/dogadaji')}>Događaji</button>
                                {isSusjed2() && (
                                    <>
                                        <button className="header_gumb" onClick={() => handleNavigate('/zahtjevi')}>Zahtjevi</button>
                                        <button className="header_gumb" onClick={() => handleNavigate('/moji-zahtjevi')}>Moji zahtjevi</button>
                                        <button className="header_gumb" onClick={() => handleNavigate('/napravi-zahtjev')}>Novi zahtjev</button>
                                        {isVolonter2() && (
                                            <>
                                                <button className="header_gumb" onClick={() => handleNavigate('/moji-dogadaji')}>Moji događaji</button>
                                                <button className="header_gumb" onClick={() => handleNavigate('/kreiraj-dogadaj')}>Novi događaj</button>
                                            </>
                                        )}
                                         {isAdmin() && (
                                                 <button className="header_gumb" onClick={() => handleNavigate('/admin-prikaz')}>Brisanje komentara i korisnika</button>
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
}

export default Header;
