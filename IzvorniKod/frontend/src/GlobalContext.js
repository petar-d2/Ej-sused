import axios from 'axios';
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    //kad istekne access zatrazi novi, ako je istekao refresh odlogiraj korisnika(makni tokene iz localStoragea)
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(window.location.href.replace(window.location.pathname,'/') + 'refresh/', { refresh: refreshToken });
            localStorage.setItem('accessToken', response.data.access);
        } catch (error) {
            console.error("Greška prilikom osvježavanja tokena:", error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw new Error("Token refresh failed");
        }
    };

    const [kvartovi, setKvartovi] = useState([
        { id: 1, name: "Trešnjevka", image: "/static/images/tresnjevka.jpg" },
        { id: 2, name: "Maksimir", image: "/static/images/maksimir.jpg" },
        { id: 3, name: "Dubrava", image: "/static/images/dubrava.jpg" },
        { id: 4, name: "Trnje", image: "/static/images/trnje.jpg" },
        { id: 5, name: "Žitnjak", image: "/static/images/zitnjak.jpg" },
        { id: 6, name: "Črnomerec", image: "/static/images/crnomerec.jpg" },
        { id: 7, name: "Vrapče", image: "/static/images/vrapce.jpg" },
        { id: 8, name: "Novi Zagreb", image: "/static/images/novizg.jpg" },
        { id: 9, name: "Medveščak", image: "/static/images/medvescak.jpg" },

    ]);
    const [skills, setSkills] = useState([
        "Popravak namještaja",
        "Električarski radovi",
        "Vodoinstalaterski radovi",
        "Vrtlarstvo i održavanje okućnice",
        "Kuhanje i pečenje",
        "Čuvanje djece (babysitting)",
        "Čuvanje kućnih ljubimaca",
        "Vožnja i dostava",
        "Pomoć pri učenju i instrukcije",
        "Pomoć s računalima i tehnologijom",
        "Slikanje i bojanje zidova",
        "Organizacija i čišćenje prostora",
        "Šivanje i krojački radovi",
        "Savjetovanje o uređenju interijera",
        "Obiteljsko ili poslovno savjetovanje",
        "Pomoć pri organizaciji događaja (npr. rođendani)",
        "Pomoć starijim osobama u kućnim poslovima",
        "Popravak i servisiranje bicikala",
        "Montaža namještaja",
        "Čišćenje i održavanje automobila",
        "Fotografija i video snimanje",
        "Pomoć pri kretanju ili selidbi (fizička pomoć)",
        "Zdravstvena podrška (npr. prva pomoć ili medicinski savjeti)"
    ]);

    return (
        <GlobalContext.Provider value={{ kvartovi, setKvartovi, skills, setSkills, refreshAccessToken }}>
            {children}
        </GlobalContext.Provider>
    );
};