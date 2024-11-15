import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';

const RegistracijaSusjed = ({ user2, setUser2 }) => {
    const navigate = useNavigate();
    const { kvartovi, skills } = useContext(GlobalContext);

    const tekst = "Registracija";
    const tekst2 = "Registracija";

    // State for form fields
    const [adresa, setAdresa] = useState("");
    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [kvart, setKvart] = useState("Trešnjevka");
    const [userSkills, setUserSkills] = useState([]);
    const [isVolonter, setIsVolonter] = useState(false); // Volunteer status
    const [mjestoSusjed, setMjestoSusjed] = useState(""); // New field for location
    const [opisSusjed, setOpisSusjed] = useState(""); // New field for description

    const handleSkillChange = (skill) => {
        setUserSkills((prevSkills) =>
            prevSkills.includes(skill)
                ? prevSkills.filter((s) => s !== skill)
                : [...prevSkills, skill]
        );
    };

    // Request for registration
    const handleSignup = async (e) => {
        e.preventDefault();

        // Check that fields are filled out
        if (!ime || !prezime || !adresa || userSkills.length === 0) {
            alert('Molimo popunite sva polja i odaberite barem jednu vještinu.');
            return;
        }
        const skillsString = userSkills.join(", ")
        // New user object for Susjed registration
        const newUser = {
            email: user2.email,
            password: user2.password,
            adresa: adresa,
            kvart: kvart,
            ime: ime,
            prezime: prezime,
            skills: skillsString,
            bodovi: 5,  // Fixed number of points
            isVolonter: isVolonter,
            mjestoSusjed: mjestoSusjed,
            opisSusjed: opisSusjed,
            isSusjed: true,  // Set isSusjed to true
            isTvrtka: false,
            isNadlezna: false,
            ocjena: 0.0
        };

        try {
            const response = await axios.post(window.location.href.replace(window.location.pathname,'/') + 'registracija/', newUser);

            alert("Uspješno ste registrirani!");

            // Clear fields after successful registration
            setAdresa('');
            setIme('');
            setPrezime('');
            setKvart('Trešnjevka');
            setUserSkills([]);
            setIsVolonter(false);
            setMjestoSusjed('Zagreb');
            setOpisSusjed('');
            navigate('/prijava');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješna registracija. Pokušajte ponovo.");
            setUser2({});
            navigate('/registracija');
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
                    <select 
                        id="options" 
                        name="options" 
                        value={kvart}
                        onChange={(e) => setKvart(e.target.value)}
                    >
                        {kvartovi.map((kvart, index) => (
                            <option key={index} value={kvart.name}>{kvart.name}</option>
                        ))}
                    </select>
                </div>

                {/* <div className="form-group">
                    <label>Mjesto:</label>
                    <input 
                        type="text" 
                        value={mjestoSusjed} 
                        onChange={(e) => setMjestoSusjed(e.target.value)} 
                        required 
                    />
                </div> */}
                <div className="form-group">
                    <label>Opis Susjeda:</label>
                    <textarea 
                        value={opisSusjed} 
                        onChange={(e) => setOpisSusjed(e.target.value)} 
                        placeholder="Unesite opis (opcionalno)"
                        rows="6"      // Increase the height with more rows
                        cols="50"     // Increase the width with more columns
                    />
                </div>
                <div className="form-group">
                    <label>Volonter:</label>
                    <input 
                        type="checkbox" 
                        checked={isVolonter} 
                        onChange={(e) => setIsVolonter(e.target.checked)} 
                    />
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
