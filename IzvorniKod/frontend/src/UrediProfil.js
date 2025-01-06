import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import UrediProfilSusjed from './UrediProfilSusjed';
import UrediProfilTvrtka from './UrediProfilTvrtka';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const UrediProfil = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { refreshAccessToken } = useContext(GlobalContext);
    
    //uzmi podatke o korisniku preko tokena
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401){
                    try{
                        await refreshAccessToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', {
                            headers: {
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        });
                        setUser(response.data);
                    }
                    catch(error){
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("googleToken");
                        Cookies.remove("access");
                        Cookies.remove("refresh");
                        Cookies.remove("google");
                        navigate('/prijava');
                    }
                }
                else {
                    console.error("An error occurred:", error);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("googleToken");
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    Cookies.remove("google");
                    navigate('/prijava');
                }
            }
        };

        fetchUserData();
    }, []);

    //ako je tvrtka
    if (user && user.isTvrtka) {
        return (
           <UrediProfilTvrtka user={user} setUser={setUser}/>
        );
    }

    //ako je susjed/volonter
    else if (user && user.isSusjed) {
        return (
            <UrediProfilSusjed user={user} setUser={setUser}/>
        );
    }

    //ovdje ne bi trebao program moći doći
    return null;
};

export default UrediProfil;