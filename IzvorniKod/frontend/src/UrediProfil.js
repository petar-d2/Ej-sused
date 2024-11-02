import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaTvrtka from './RegistracijaTvrtka';
import RegistracijaSusjed from './RegistracijaSusjed';

const UrediProfil = ({kvartovi}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [vrstaKorisnika, setVrstaKorisnika] = useState(user.vrstaKorisnika);
    const [user2, setUser2] = useState(user);

    if (user2.vrsta==="tvrtka") {
        return (
            <RegistracijaTvrtka kvartovi={kvartovi} user2={user2}/>
        );
    }

    else if (user2.vrsta==="susjed" || user2.vrsta==="volonter") {
        return (
            <RegistracijaSusjed kvartovi={kvartovi} user2={user2}/>
        );
    }

};

export default UrediProfil;