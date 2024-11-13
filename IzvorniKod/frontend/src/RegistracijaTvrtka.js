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

    // State for form fields
    const [adresa, setAdresa] = useState("");
    const [naziv, setNaziv] = useState("");
    const [kvart, setKvart] = useState("Trešnjevka");
    const [mjesto, setMjesto] = useState(""); // New field for mjestoTvrtka
    const [opis, setOpis] = useState(""); // New field for opisTvrtka

    // Request to register a new Tvrtka
    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser = {
            email: user2.email,
            password: user2.password,
            isSusjed: false, // Indicates that this user is not a Susjed
            isTvrtka: true,  // Indicates that this user is a Tvrtka
            isNadlezna: false, // If Nadlezna is applicable, you can adjust this
            adresa: adresa,
            naziv: naziv,
            kvart: kvart,
            mjestoTvrtka: mjesto, // Add mjestoTvrtka to the request data
            opisTvrtka: opis, // Add opisTvrtka to the request data
            ocjena: 0.0
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
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
                        required 
                        placeholder="Unesite adresu"
                    />
                </div>
                <div className="form-group">
                    <label>Naziv:</label>
                    <input 
                        type="text" 
                        value={naziv} 
                        onChange={(e) => setNaziv(e.target.value)} 
                        required 
                        placeholder="Unesite naziv tvrtke"
                    />
                </div>
                <div className="form-group">
                    <label>Kvart:</label>
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
                    <label>Opis Tvrtke:</label>
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

export default RegistracijaTvrtka;
