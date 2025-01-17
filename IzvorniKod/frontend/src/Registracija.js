import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaVrsta from './RegistracijaVrsta';
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
            client_id: "371280955009-aguas7h3hg0aao1d6kiq2mo536vitc0n.apps.googleusercontent.com",
            redirect_uri: window.location.href.replace(window.location.pathname,'/') + "google-login/",
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
        /*
        try {
            await axios.post(window.location.href.replace(window.location.pathname,'/') + 'registracija/', {
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
        */
        setUser2({email: email, password: password});
    };

    //ako nije upisan mail i password
    if (! (user2 && user2.email)){
        return (
            <div className="login_signup-container">
                <h2>Registracija</h2>
                <form onSubmit={handleSignup} className='login_form'>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            id="email"
                            className='login_input'
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Lozinka:</label>
                        <input 
                            id="password1"
                            className='login_input'
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Potvrdite lozinku:</label>
                        <input 
                            id="password2"
                            className='login_input'
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button id="button_1" className="button_1" type="submit">Registracija</button>
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