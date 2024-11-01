import React from 'react';
import './styles/header.css';
import {useNavigate} from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate('/');
    };

    if (!(user)){
        return(
            <div className="header">
                <img className="header_slika" src='/images/header1.jpeg' />
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
    else{
        return(
            <div className="header">
                <img className="header_slika" src='/images/header1.jpeg' />
                <div className="header_grid">
                    <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                    <button style={{minWidth : "120px"}} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                    <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                    <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Događaji</button>
                    <button className="header_gumb" onClick={handleLogout}>Odjavi se</button>
                </div>
            </div>
        );
    }
}

export default Header;