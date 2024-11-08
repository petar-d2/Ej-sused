import React, { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';


const RegistracijaSusjed = ({user2}) => {

    const navigate = useNavigate();

    const { users, setUsers, kvartovi, skills } = useContext(GlobalContext);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const tekst = user ? "Uredi profil" : "Registracija";
    const tekst2 = user ? "Spremi" : "Registracija";

    const [adresa, setAdresa] = useState(user && user.adresa ? user.adresa : "");
    const [ime, setIme] = useState(user && user.ime ? user.ime : "");
    const [prezime, setPrezime] = useState(user && user.prezime ? user.prezime : "");
    const [kvart, setKvart] = useState(user && user.kvart ? user.kvart : "Trešnjevka");
    const [userSkills, setUserSkills] = useState(user && user.skills ? user.skills : []);

    const handleSkillChange = (skill) => {
        setUserSkills((prevSkills) =>
            prevSkills.includes(skill)
                ? prevSkills.filter((s) => s !== skill)
                : [...prevSkills, skill]
        );
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser={
            email: user2.email,
            password: user2.password,
            vrsta: user2.vrsta,
            adresa: adresa,
            kvart: kvart,
            ime: ime,
            prezime: prezime,
            skills: userSkills,
            bodovi: user && user.bodovi ? user.bodovi : null
        };

        try {
            const response = await axios.post('http://localhost:8000/registracija', newUser);

            alert("Uspješno ste registrirani!");

            localStorage.setItem("currentUser", JSON.stringify(newUser));
            localStorage.setItem("users", JSON.stringify([...users, newUser]));
            setUsers([...users, newUser]);
            setAdresa('');
            setIme('');
            setPrezime('');
            setKvart('Trešnjevka');

            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješna registracija. Pokušajte ponovo.");
        }
    };

    return (
        <div className="login_signup-container">
            <h2>{tekst}</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label>Ime:</label>
                    <input 
                        type="text" 
                        value={ime} 
                        onChange={(e) => setIme(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Prezime:</label>
                    <input 
                        type="text" 
                        value={prezime} 
                        onChange={(e) => setPrezime(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Adresa:</label>
                    <input 
                        type="text" 
                        value={adresa} 
                        onChange={(e) => setAdresa(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Kvart:</label>
                    <select id="options" 
                    name="options" 
                    value={kvart}
                    onChange={(e) => setKvart(e.target.value)}
                    >
                        {kvartovi.map((kvart, index) => (
                            <option key={index} value={kvart.name}>{kvart.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group-skills">
                    <label>Vještine:</label>
                    <div className="skills-box">
                        {skills.map((skill, index) => (
                            <div key={index} className="skill-item">
                                <input
                                    type="checkbox"
                                    id={`skill-${index}`}
                                    checked={userSkills.includes(skill)}
                                    onChange={() => handleSkillChange(skill)}
                                />
                                <label htmlFor={`skill-${index}`}>{skill}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="button_1" type="submit">{tekst2}</button>
            </form>
        </div>
    );
}

export default RegistracijaSusjed;