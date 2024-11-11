import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import UrediProfilSusjed from './UrediProfilSusjed';
import UrediProfilTvrtka from './UrediProfilTvrtka';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const UrediProfil = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { refreshAccessToken } = useContext(GlobalContext);
    
    //uzmi podatke o korisniku preko tokena
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post('http://localhost:8000/user-info/', { access: accessToken });
                setUser(response.data);
            } catch (error) {
                try{
                    await refreshAccessToken();
                    const newAccessToken = localStorage.getItem('accessToken');
                    const response = await axios.post('http://localhost:8000/user-info/', { access: newAccessToken });
                    setUser(response.data);
                }
                catch(error){
                    navigate('/prijava');
                }
            }
        };

        fetchUserData();
    }, []);

    //ako je tvrtka
    if (user && user.vrsta==="tvrtka") {
        return (
           <UrediProfilTvrtka />
        );
    }

    //ako je susjed/volonter
    else if (user && (user.vrsta==="susjed" || user.vrsta==="volonter")) {
        return (
            <UrediProfilSusjed />
        );
    }

    //ovdje ne bi trebao program moći doći
    return null;
};

export default UrediProfil;