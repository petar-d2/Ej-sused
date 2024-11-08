import React, { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';


const RegistracijaTvrtka = ({user2}) => {

    const navigate = useNavigate();

    const { users, setUsers, kvartovi } = useContext(GlobalContext);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const tekst = user ? "Uredi profil" : "Registracija";
    const tekst2 = user ? "Spremi" : "Registracija";

    const [adresa, setAdresa] = useState(user && user.adresa ? user.adresa : "");
    const [naziv, setNaziv] = useState(user && user.naziv ? user.naziv : "");
    const [kvart, setKvart] = useState(user && user.kvart ? user.kvart : "Trešnjevka");

    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            vrsta: user2.vrsta,
            adresa: adresa,
            naziv: naziv,
            kvart: kvart
        };

        try {
            const response = await axios.post('http://localhost:8000/registracija', newUser);

            alert("Uspješno ste registrirani!");

            localStorage.setItem("currentUser", JSON.stringify(newUser));
            localStorage.setItem("users", JSON.stringify([...users, newUser]));
            setUsers([...users, newUser]);
            setAdresa('');
            setNaziv('');
            setKvart('Trešnjevka');

            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješna registracija. Pokušajte ponovo.");
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
                        placeholder={adresa}
                    />
                </div>
                <div className="form-group">
                    <label>Naziv:</label>
                    <input 
                        type="text" 
                        value={naziv} 
                        onChange={(e) => setNaziv(e.target.value)} 
                        required 
                        placeholder={naziv}
                    />
                </div>
                <select id="options" 
                name="options" 
                value={kvart}
                onChange={(e) => setKvart(e.target.value)}
                >
                    {kvartovi.map((kvart, index) => (
                        <option key={index} value={kvart.name}>{kvart.name}</option>
                    ))}
                </select>
                <button className="button_1" type="submit">{tekst2}</button>
            </form>
        </div>
    );
}

export default RegistracijaTvrtka;
