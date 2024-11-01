import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';


const RegistracijaSusjed = ({kvartovi, user2}) => {

    const navigate = useNavigate();
    const [adresa, setAdresa] = useState('');
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [kvart, setKvart] = useState('Trešnjevka');

    const handleSignup = (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            vrsta: user2.vrsta,
            adresa: adresa,
            kvart: kvart,
            ime: ime,
            prezime: prezime,
            bodovi: 0
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setAdresa('');
        setIme('');
        setPrezime('');
        setKvart('Trešnjevka');
        navigate('/');
    };

    return (
        <div className="login_signup-container">
            <h2>Registracija</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label>Ime:</label>
                    <input 
                        type="text" 
                        value={ime} 
                        onChange={(e) => setIme(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Prezime:</label>
                    <input 
                        type="text" 
                        value={prezime} 
                        onChange={(e) => setPrezime(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input 
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
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

export default RegistracijaSusjed;