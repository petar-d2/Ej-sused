import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const RegistracijaTvrtka = ({ user2, setUser2 }) => {
    const navigate = useNavigate();
    const { kvartovi } = useContext(GlobalContext);

    const tekst = "Registracija";
    const tekst2 = "Registracija";

    // stanja za polja u formu
    const [adresa, setAdresa] = useState("");
    const [naziv, setNaziv] = useState("");
    const [kvart, setKvart] = useState("Trešnjevka");
    const [mjesto, setMjesto] = useState("Zagreb");
    const [opis, setOpis] = useState("");

    // signup zahtjev
    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser = {
            email: user2.email,
            password: user2.password,
            isSusjed: false,
            isTvrtka: true, 
            isNadlezna: false,
            adresa: adresa,
            nazivTvrtka: naziv,
            kvart: kvart,
            mjestoTvrtka: mjesto, //zasad samo Zagreb
            opisTvrtka: opis,
            brojOcjena: 0,
            zbrojOcjena: 0
        };

        try {
            const response = await axios.post(window.location.href.replace(window.location.pathname,'/') + 'registracija/', newUser);

            alert("Uspješno ste registrirani!");

            setAdresa('');
            setNaziv('');
            setKvart('Trešnjevka');
            setMjesto('Zagreb');
            setOpis('');

            navigate('/prijava');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješna registracija. Pokušajte ponovo.");
            setUser2({});
            navigate('/registracija');
        }
    };

    return (
        <div className="login_signup-container">
            <h2>{tekst}</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input 
                        id="adresa"
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Naziv:</label>
                    <input 
                        id="naziv"
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
                        id="mjesto"
                        type="text" 
                        value={mjesto} 
                        onChange={(e) => setMjesto(e.target.value)} 
                        required 
                        placeholder="Unesite mjesto tvrtke"
                    />
                </div>*/}
                <div className="form-group">
                    <label>Opis Tvrtke:</label>
                    <textarea 
                        id="opis"
                        value={opis} 
                        onChange={(e) => setOpis(e.target.value)} 
                        placeholder="Unesite opis tvrtke (opcionalno)"
                        rows="5"
                        cols="50"
                    />
                </div>
                <button className="button_1" type="submit">{tekst2}</button>
            </form>
        </div>
    );
}

export default RegistracijaTvrtka;
