import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import axios from 'axios';
import GoogleButton from "react-google-button";

const Prijava = () => {
    const navigate=useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const onGoogleLoginSuccess = () => {
        const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
        
        const scope = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(' ');
        
        const params = {
            response_type: "code",
            client_id: "371280955009-aguas7h3hg0aao1d6kiq2mo536vitc0n.apps.googleusercontent.com",
            redirect_uri: window.location.href.replace(window.location.pathname,'/') + "google-login/",
            prompt: "select_account",
            access_type: "offline",
            scope
        };
        const urlParams = new URLSearchParams(params).toString();
        window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    };

    //ako je prijava uspjesna spremi tokene i posalji na pocetnu stranicu
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post( window.location.href.replace(window.location.pathname,'/') + 'prijava/', {
            email,
            password,
          });
          localStorage.setItem('accessToken', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);
          const response2 = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          localStorage.setItem('user',JSON.stringify(response2.data));
          //console.log(response2.data);
          navigate('/');
        } catch (error) {
          console.error('Login failed:', error.response.data);
          alert("Neuspješna prijava!");
          return;
        }
    };

    return (
        <div className="login_signup-container">
            <h2>Prijava</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input id="email"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Lozinka:</label>
                    <input id="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button className="button_1" type="submit" id="submit" >Prijava</button>
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
                Nemate račun? 
                <button className='button_2' onClick={() => navigate('/registracija')}>Registracija</button>
            </p>
        </div>
    );
}

export default Prijava;
