import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';


const RegistracijaTvrtka = ({kvartovi, user2}) => {

    const navigate = useNavigate();
    const [adresa, setAdresa] = useState('');
    const [naziv, setNaziv] = useState('');
    const [kvart, setKvart] = useState('Trešnjevka');

    const handleSignup = (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            vrsta: user2.vrsta,
            adresa: adresa,
            naziv: naziv,
            kvart: kvart
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setAdresa('');
        setNaziv('');
        setKvart('Trešnjevka');
        navigate('/');
    };

    return (
        <div className="login_signup-container">
            <h2>Registracija</h2>
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
                <select id="options" 
                name="options" 
                value={kvart}
                onChange={(e) => setKvart(e.target.value)}
                >
                    {kvartovi.map((kvart, index) => (
                        <option key={index} value={kvart.name}>{kvart.name}</option>
                    ))}
                </select>
                <button className="button_1" type="submit">Registracija</button>
            </form>
        </div>
    );
}

export default RegistracijaTvrtka;
