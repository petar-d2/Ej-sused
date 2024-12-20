import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const UrediProfilTvrtka = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { kvartovi, refreshAccessToken } = useContext(GlobalContext);

    const tekst = "Uredi Profil";
    const tekst2 = "Spremi";
    
    //uzmi podatke o korisniku preko tokena
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', { access: accessToken });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401){
                    try{
                        await refreshAccessToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', { access: newAccessToken });
                        setUser(response.data);
                    }
                    catch(error){
                        navigate('/prijava');
                    }
                }
                else {
                    console.error("An error occurred:", error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/prijava');
                }
            }
        };

        fetchUserData();
    }, []);

    const [adresa, setAdresa] = useState(user.adresa);
    const [naziv, setNaziv] = useState(user.naziv);
    const [kvart, setKvart] = useState(user.kvart);
    const [opis, setOpis] = useState(user.opis);

    //spremi promjene
    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser = {
            email: user.email,
            password: user.password,
            isSusjed: false,
            isTvrtka: true,
            isNadlezna: false,
            adresa: adresa,
            naziv: naziv,
            kvart: kvart,
            mjestoTvrtka: user.mjesto,
            opisTvrtka: opis,
            ocjena: user.ocjena
        };

        try {
            const response = await axios.post( window.location.href.replace(window.location.pathname,'/') + 'user-edit/', newUser);
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješno uređivanje profila. Pokušajte ponovo.");
        }
    };

    return (
        <div className="login_signup-container">
            <h2>{tekst}</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input 
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Naziv:</label>
                    <input 
                        type="text" 
                        value={naziv} 
                        onChange={(e) => setNaziv(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label style={{width: "30vw", maxWidth:"400px"}}>Kvart:</label>
                    <select 
                        id="options" 
                        name="options" 
                        value={kvart}
                        onChange={(e) => setKvart(e.target.value)}
                    >
                        {kvartovi.map((kvart, index) => (
                            <option key={index} value={kvart.name}>{kvart.name}</option>
                        ))}
                    </select>
                </div>
                {/*<div className="form-group">
                    <label>Mjesto:</label>
                    <input 
                        type="text" 
                        value={mjesto} 
                        onChange={(e) => setMjesto(e.target.value)} 
                        required 
                        placeholder="Unesite mjesto tvrtke"
                    />
                </div>*/}
                <div className="form-group">
                    <label>Opis tvrtke:</label>
                    <textarea 
                        value={opis} 
                        onChange={(e) => setOpis(e.target.value)} 
                        placeholder="Unesite opis tvrtke (opcionalno)"
                    />
                </div>
                <button className="button_1" type="submit">{tekst2}</button>
            </form>
        </div>
    );
}

export default UrediProfilTvrtka;