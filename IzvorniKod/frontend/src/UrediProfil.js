import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaTvrtka from './RegistracijaTvrtka';
import RegistracijaSusjed from './RegistracijaSusjed';

const UrediProfil = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || !user.vrsta) {
            navigate('/');
        }
    }, [user, navigate]);

    if (user && user.vrsta==="tvrtka") {
        return (
            <RegistracijaTvrtka user2={user}/>
        );
    }

    else if (user && (user.vrsta==="susjed" || user.vrsta==="volonter")) {
        return (
            <RegistracijaSusjed user2={user}/>
        );
    }

    return null;
};

export default UrediProfil;