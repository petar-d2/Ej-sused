import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles//napravi_ponudu.css';

const NapraviPonudu = () => {
    const navigate = useNavigate();
    const  [naslov, setNaslov] = useState("");
    const  [opis, setOpis] = useState("");
    const  [cijena, setCijena] = useState("");
    const  [brojMobitela, setBrojMobitela] = useState("");

    const handlePonuda = (e) => {
        e.preventDefault();
        const mobileRegex = /^[0-9]{10}$/;

        if (!mobileRegex.test(brojMobitela)) {
            alert("Unesite valjani broj mobitela");
            return;
        }
    
        setNaslov("");
        setCijena("");
        setOpis("");
        setBrojMobitela("");
    };
    
    //ako nije ulogiran, posalji ga na prijavu
    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            navigate("/prijava");
        }
    },[]);

    return (
    <div className='upitnik'>
        <form onSubmit={handlePonuda}>
            <label>Naslov</label>
            <input 
                type="text" 
                value={naslov} 
                onChange={(e) => setNaslov(e.target.value)} 
                required 
            />
            <label>Opis</label>
            <textarea
                className='opis'
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
                required
                rows="4"
            />
            <label>Cijena (EUR)</label>
            <input 
                type="number" 
                value={cijena} 
                onChange={(e) => setCijena(e.target.value)} 
                required 
            />
            <label>Broj mobitela</label>
            <input 
                type="text" 
                value={brojMobitela} 
                onChange={(e) => setBrojMobitela(e.target.value)} 
                required 
            />
            <button className="button_1" type="submit">Napravi ponudu</button>

        </form>   
     </div>
    )
}

export default NapraviPonudu;
