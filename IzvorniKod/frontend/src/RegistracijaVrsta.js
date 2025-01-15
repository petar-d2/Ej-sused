import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import RegistracijaTvrtka from './RegistracijaTvrtka';
import RegistracijaSusjed from './RegistracijaSusjed';

const RegistracijaVrsta = ({user2, setUser2}) => {
    const navigate = useNavigate();
    const [vrstaKorisnika, setVrstaKorisnika] = useState('tvrtka');

    //unos vrste korisnika
    const handleSignup = (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            vrsta: vrstaKorisnika
        };
        setUser2(newUser);
        setVrstaKorisnika('tvrtka');
    };

    //ako nije odabrana vrsta
    if (!(user2 && user2.vrsta)){
        return (
            <div className="login_signup-container">
                <h2>Vrsta registracije:</h2>
                <form onSubmit={handleSignup}>
                    <h3>Odaberite vrstu korisnika:</h3>
                    <div className='reg_vrsta'>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="tvrtka"
                                    checked={vrstaKorisnika === 'tvrtka'}
                                    onChange={(e) => setVrstaKorisnika(e.target.value)}
                                    style = {{width : "50px"}}
                                />
                                Tvrtka
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="susjed"
                                    checked={vrstaKorisnika === 'susjed'}
                                    onChange={(e) => setVrstaKorisnika(e.target.value)}
                                    style = {{width : "50px"}}
                                />
                                Susjed
                            </label>
                        </div>
                        {/*<div>
                            <label>
                                <input
                                    type="radio"
                                    value="volonter"
                                    checked={vrstaKorisnika === 'volonter'}
                                    onChange={(e) => setVrstaKorisnika(e.target.value)}
                                    style = {{width : "50px"}}
                                />
                                Volonter
                            </label>
                        </div>*/}
                    </div>
                    <button className="button_1" type="submit">Nastavi</button>
                </form>
            </div>
        );
    }

    //ako je odabrana tvrtka
    else if (user2.vrsta==="tvrtka") {
        return (
            <RegistracijaTvrtka user2={user2} setUser2={setUser2}/>
        );
    }

    //ako je odabran susjed/volonter
    else if (user2.vrsta==="susjed" || user2.vrsta==="volonter") {
        return (
            <RegistracijaSusjed user2={user2} setUser2={setUser2}/>
        );
    }

};

export default RegistracijaVrsta;