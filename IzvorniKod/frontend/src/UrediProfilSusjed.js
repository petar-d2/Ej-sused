import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login_signup.css';
import { GlobalContext } from './GlobalContext';
import axios from 'axios';


const UrediProfilSusjed = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const { kvartovi, skills, refreshAccessToken } = useContext(GlobalContext);

    const tekst = "Uredi Profil";
    const tekst2 = "Spremi";
    
    //uzmi podatke o korisniku preko tokena
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/user-info/', { access: accessToken });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401){
                    try{
                        await refreshAccessToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        const response = await axios.get('http://localhost:8000/user-info/', { access: newAccessToken });
                        setUser(response.data);
                    }
                    catch(error){
                        navigate('/prijava');
                    }
                }
                else {
                    console.error("An error occurred:", error);
                    navigate('/prijava');
                }
            }
        };

        fetchUserData();
    }, []);

    const [adresa, setAdresa] = useState(user.adresa);
    const [ime, setIme] = useState(user.ime);
    const [prezime, setPrezime] = useState(user.prezime);
    const [kvart, setKvart] = useState(user.kvart);
    const [userSkills, setUserSkills] = useState(user.skills);

    //spremi promjene u listi userSkills
    const handleSkillChange = (skill) => {
        setUserSkills((prevSkills) =>
            prevSkills.includes(skill)
                ? prevSkills.filter((s) => s !== skill)
                : [...prevSkills, skill]
        );
    };

    //spremi promjene
    const handleSignup = async (e) => {
        e.preventDefault();

        const newUser={
            email: user.email,
            password: user.password,
            vrsta: user.vrsta,
            adresa: adresa,
            kvart: kvart,
            ime: ime,
            prezime: prezime,
            skills: userSkills
        };

        try {
            const response = await axios.post('http://localhost:8000/user-edit/', newUser);
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Neuspješno uređivanje profila. Pokušajte ponovo.");
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

export default UrediProfilSusjed;