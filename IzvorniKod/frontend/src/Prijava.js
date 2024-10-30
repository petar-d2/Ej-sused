import React,{useState} from 'react';
import './styles/login_signup.css';
import {useNavigate} from 'react-router-dom';

const Prijava = () => {
    const navigate=useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Molimo unesite i email i lozinku.");
            return;
        }

        setEmail('');
        setPassword('');
        navigate('/home');

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

export default Prijava
