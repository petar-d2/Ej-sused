import React, { useState,useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { jwtDecode } from 'jwt-decode';
import RegistracijaVrsta from './RegistracijaVrsta';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const Registracija = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user2, setUser2] = useState({});

    const { users } = useContext(GlobalContext);

    /*
    const handleSignUpGoogle = (response) => {
        var userObject=jwtDecode(response.credential);
        const newUser={
            email: userObject.email,
            authProvider: 'google'
        };

        const existingUser = users.find((user) => user.email === newUser.email);
        if (existingUser) {
            alert("Korisnik s ovim mailom već postoji.");
        } else {
            setUser2(newUser);
        }
    };

    useEffect(() => {
        // global google
        google.accounts.id.initialize({
            client_id: "696378051112-h9ccj11heq8k72f5pci6ontvfushtltt.apps.googleusercontent.com",
            callback: handleSignUpGoogle
        });

        google.accounts.id.renderButton(
            document.getElementById('GoogleDiv'),
            {theme: "outline", size: "large"}
        );

        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            navigate('/');
        }

    },[navigate]); */



    const handleSignup = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            alert("Molimo unesite i email i lozinku.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Lozinke se ne podudaraju. Molimo pokušajte ponovno.");
            return;
        }

        try {
            await axios.post('http://localhost:8000/registracija/', {
                email,
                password,
            });
            alert("Uspješno ste registrirani!");
            navigate('/prijava');
        } catch (error) {
          console.error('Registration failed:', error.response.data);
          alert("Neuspješna registracija!");
          return;
        }
    };

    //const user = JSON.parse(localStorage.getItem("currentUser"));

    if (! (user2 && user2.email)){
        return (
            <div className="login_signup-container">
                <h2>Registracija</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Lozinka:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Potvrdite lozinku:</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button className="button_1" type="submit">Registracija</button>
                </form>
                <div id='GoogleDiv'></div>
                <div className="horizontalna_crta" style={{ 
                    height: '2px', 
                    backgroundColor: 'black',
                    width: '90%',
                    marginTop: '30px',
                    marginBottom: '10px'
                }}></div>
                <p className='redirect'>
                    Već imate račun? 
                    <button className='button_2' onClick={() => navigate('/prijava')}>Prijava</button>
                </p>
            </div>
        );
    }
    else {
        return (
            <RegistracijaVrsta user2={user2} setUser2={setUser2}/>
        );
    }

};

export default Registracija;