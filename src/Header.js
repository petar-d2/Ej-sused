import React from 'react';
import './styles/header.css';
import {useNavigate} from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();

    return(
        <div className="header">
            <img className="header_slika" src='/images/header1.jpeg' />
            <div className="header_grid">
                <button className="header_gumb" onClick={() => navigate('/')}>Početna</button>
                <button style={{minWidth : "120px"}} className="header_gumb" onClick={() => navigate('/napravi-ponudu')}>Napravi ponudu</button>
                <button className="header_gumb" onClick={() => navigate('/ponude')}>Ponude</button>
                <button className="header_gumb" onClick={() => navigate('/dogadaji')}>Dogadaji</button>
                <button className="header_gumb" onClick={() => navigate('/prijava')}>Prijava</button>
                <button className="header_gumb" onClick={() => navigate('/registracija')}>Registracija</button>
            </div>
        </div>
    );
}

export default Header;