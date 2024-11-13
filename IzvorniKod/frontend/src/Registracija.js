import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaVrsta from './RegistracijaVrsta';
import axios from 'axios';
import GoogleButton from "react-google-button";

const Registracija = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user2, setUser2] = useState({});
    
    const onGoogleLoginSuccess = () => {
        const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
        
        const scope = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(' ');
        
        const params = {
            response_type: "code",
            client_id: "696378051112-h9ccj11heq8k72f5pci6ontvfushtltt.apps.googleusercontent.com",
            redirect_uri: "http://localhost:8000/google-login/",
            prompt: "select_account",
            access_type: "offline",
            scope
        };
        
        const urlParams = new URLSearchParams(params).toString();
        window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    };
    
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

    //ako nije upisan mail i password
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
                <GoogleButton type="light" onClick={onGoogleLoginSuccess} label="Sign in with Google"/>
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
    //kad se upise mail i password
    else {
        return (
            <RegistracijaVrsta user2={user2} setUser2={setUser2}/>
        );
    }

};

export default Registracija;