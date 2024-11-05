import React, { useState,useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from './GlobalContext';

const Prijava = () => {
    const navigate=useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { users } = useContext(GlobalContext);

    const handleLogInGoogle = (response) => {
        var userObject=jwtDecode(response.credential);
        const loggedUser={
            email: userObject.email,
            password: "abc"
        };

        const existingUser = users.find(
            (user) => user.email === loggedUser.email && user.password === loggedUser.password
        );
        
        if (existingUser){
            localStorage.setItem("currentUser", JSON.stringify(existingUser));
            navigate('/');
        }
        else {
            alert('Pogrešan mail i/ili lozinka.');
            setPassword('');
        }
    };

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "696378051112-h9ccj11heq8k72f5pci6ontvfushtltt.apps.googleusercontent.com",
            callback: handleLogInGoogle
        });

        google.accounts.id.renderButton(
            document.getElementById('GoogleDiv'),
            {theme: "outline", size: "large"}
        );

        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            navigate('/');
        }

    },[navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Molimo unesite i email i lozinku.");
            return;
        }

        setEmail('');
        setPassword('');
        const loggedUser={
            email: email,
            password: password
        };

        const existingUser = users.find(
            (user) => user.email === loggedUser.email && user.password === loggedUser.password
        );
        
        if (existingUser){
            localStorage.setItem("currentUser", JSON.stringify(existingUser));
            navigate('/');
        }
        else {
            alert('Pogrešan mail i/ili lozinka.');
            setPassword('');
        }
    };

    return (
        <div className="login_signup-container">
            <h2>Prijava</h2>
            <form onSubmit={handleLogin}>
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
                <button className="button_1" type="submit">Prijava</button>
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
                Nemate račun? 
                <button className='button_2' onClick={() => navigate('/registracija')}>Registracija</button>
            </p>
        </div>
    );
}

export default Prijava;
