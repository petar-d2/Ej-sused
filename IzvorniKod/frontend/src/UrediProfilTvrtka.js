import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const UrediProfilTvrtka = ({ user, setUser2 }) => {

    const navigate = useNavigate();

    const { kvartovi, refreshAccessToken, setUser } = useContext(GlobalContext);

    const tekst = "Uredi Profil";
    const tekst2 = "Spremi";
    
    //uzmi podatke o korisniku preko tokena
    /*useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', { access: accessToken });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401){
                    try{
                        await refreshAccessToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + 'user-info/', { access: newAccessToken });
                        setUser(response.data);
                    }
                    catch(error){
                        navigate('/prijava');
                    }
                }
                else {
                    console.error("An error occurred:", error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/prijava');
                }
            }
        };

        fetchUserData();
    }, []);*/

    const [adresa, setAdresa] = useState(user.adresaTvrtka);
    const [naziv, setNaziv] = useState(user.nazivTvrtka);
    const [kvart, setKvart] = useState(user.kvartTvrtka);
    const [opis, setOpis] = useState(user.opisTvrtka);

    //spremi promjene
    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser = {
            id: user.id,
            email: user.email,
            password: user.password,
            isSusjed: false,
            isTvrtka: true,
            isNadlezna: false,
            adresa: adresa,
            nazivTvrtka: naziv,
            kvart: kvart,
            mjestoTvrtka: user.mjesto,
            opisTvrtka: opis,
            brojOcjena: user.brojOcjena,
            zbrojOcjena: user.zbrojOcjena
        };

        try {
            const response = await axios.post( window.location.href.replace(window.location.pathname,'/') + 'user-edit/', newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješno uređivanje profila. Pokušajte ponovo.");
        }
    };

    return (
        <div className="login_signup-container">
            <h2>{tekst}</h2>
            <form onSubmit={handleSignup} className='login_form'>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input 
                        id="adresa"
                        className='login_input'
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Naziv:</label>
                    <input 
                        id="naziv"
                        className='login_input'
                        type="text" 
                        value={naziv} 
                        onChange={(e) => setNaziv(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label style={{width: "30vw", maxWidth:"400px"}}>Kvart:</label>
                    <select 
                        id="options" 
                        className='login_select'
                        name="options" 
                        value={kvart}
                        onChange={(e) => setKvart(e.target.value)}
                    >
                        {kvartovi.map((kvart, index) => (
                            <option key={index} value={kvart.name}>{kvart.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Opis tvrtke:</label>
                    <textarea 
                        id="opis"
                        className='login_textarea'
                        value={opis} 
                        onChange={(e) => setOpis(e.target.value)} 
                        placeholder="Unesite opis tvrtke (opcionalno)"
                    />
                </div>
                <button className="button_1" type="submit">{tekst2}</button>
            </form>
        </div>
    );
}

export default UrediProfilTvrtka;