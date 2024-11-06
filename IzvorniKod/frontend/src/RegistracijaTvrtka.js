import React, { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';


const RegistracijaTvrtka = ({user2}) => {

    const navigate = useNavigate();

    const { users, setUsers, kvartovi } = useContext(GlobalContext);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const tekst = user ? "Uredi profil" : "Registracija";
    const tekst2 = user ? "Spremi" : "Registracija";

    const [adresa, setAdresa] = useState(user && user.adresa ? user.adresa : "");
    const [naziv, setNaziv] = useState(user && user.naziv ? user.naziv : "");
    const [kvart, setKvart] = useState(user && user.kvart ? user.kvart : "Trešnjevka");

    const handleSignup = (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            authProvider: user2.authProvider,
            vrsta: user2.vrsta,
            adresa: adresa,
            naziv: naziv,
            kvart: kvart
        };

        const existingUser = users.find(
            (user) => user.email === newUser.email
        );
        if (existingUser){
            const updatedUsers = users.map((user) =>
                user.email === existingUser.email ? newUser : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
        }
        else {
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            setUsers([...users, newUser]);
        }

        localStorage.setItem("currentUser", JSON.stringify(newUser));
        setAdresa('');
        setNaziv('');
        setKvart('Trešnjevka');
        navigate('/');
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
