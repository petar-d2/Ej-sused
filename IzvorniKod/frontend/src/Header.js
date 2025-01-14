import React, { useState, useEffect } from 'react';
import './styles/header.css';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        var access = localStorage.getItem("accessToken");
        var refresh = localStorage.getItem("refreshToken");
        var google = localStorage.getItem("googleToken");
        try{
            await axios.post(window.location.href.replace(window.location.pathname,'/') + "odjava/", { access, refresh, google });
        } catch(error){ 
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
        return typeof(localStorage.getItem("accessToken")) != undefined && localStorage.getItem("accessToken") != null;
    };
    
    const isSusjed2 = () => {
        if (typeof(localStorage.getItem("accessToken")) != undefined && localStorage.getItem("accessToken") != null) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData==null){
                handleLogout();
            }
            return userData.isSusjed;
        } else {
            return false;
        }
    }
    const isVolonter2 = () => {
        if (typeof(localStorage.getItem("accessToken")) != undefined && localStorage.getItem("accessToken") != null) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData==null){
                handleLogout();
            }
            return userData.isVolonter;
        } else {
            return false;
        }
    }
    const isTvrtka2 = () => {
        if (typeof(localStorage.getItem("accessToken")) != undefined && localStorage.getItem("accessToken") != null) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData==null){
                handleLogout();
            }
            return userData.isTvrtka;
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

    const isMobile = true; //useMediaQuery({ query: '(max-width: 875px)' });

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
                    <h1 className="header-title">Ej Sused</h1>
                    {isDropdownOpen && (
                        <div className="dropdown_menu">
                            <button className="header_gumb" onClick={() => handleNavigate('/')}>Početna</button>
                            {isLoggedIn() ? (
                                <>
                                    <button className="header_gumb" onClick={() => handleNavigate('/tvrtke')}>Tvrtke</button>
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
                    <h1 className="header-title">Ej Sused</h1>
                    <div className="header_grid">
                        <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                        {isLoggedIn() ? (
                            <>
                                
                                <button className="header_gumb" onClick={() => navigate('/tvrtke')}>Tvrtke</button>
                                <button className="header_gumb" onClick={() => navigate('/ponude-susjeda')}>Ponude susjeda</button> 
                                <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>
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
