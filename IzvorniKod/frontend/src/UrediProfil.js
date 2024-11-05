import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaTvrtka from './RegistracijaTvrtka';
import RegistracijaSusjed from './RegistracijaSusjed';

const UrediProfil = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    //const [vrstaKorisnika, setVrstaKorisnika] = useState(user.vrstaKorisnika);
    //const [user2, setUser2] = useState(user);

    if (user.vrsta==="tvrtka") {
        return (
            <RegistracijaTvrtka user2={user}/>
        );
    }

    else if (user.vrsta==="susjed" || user.vrsta==="volonter") {
        return (
            <RegistracijaSusjed user2={user}/>
        );
    }

    else {
        navigate('/');
    }

};

export default UrediProfil;