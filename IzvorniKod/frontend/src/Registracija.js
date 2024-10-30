import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';

const Registracija = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [korisnik, setKorisnik] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            alert("Molimo unesite i email i lozinku.");
            return;
        }


        if (password !== confirmPassword) {
            alert("Lozinke se ne podudaraju. Molimo pokušajte ponovno.");
            return;
        }

        setEmail('');
        setPassword('');
        setKorisnik('');
        navigate('/prijava');
    };

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
                <select id="options" 
                name="options" 
                value={korisnik}
                onChange={(e) => setKorisnik(e.target.value)}
                >
                    <option value="" disabled>Vrsta korisnika</option>
                    <option value="opcija1">Susjed</option>
                    <option value="opcija2">Tvrtka</option>
                    <option value="opcija3">Volonter</option>
                </select>
                <button className="button_1" type="submit">Registracija</button>
            </form>
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
};

export default Registracija;