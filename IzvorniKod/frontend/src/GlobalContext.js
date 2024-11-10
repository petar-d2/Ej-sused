import React, { createContext, useState } from 'react';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });
    const [kvartovi, setKvartovi] = useState([
        { id: 1, name: "Trešnjevka", image: "/static/images/header1.jpeg" },
        { id: 2, name: "Maksimir", image: "/static/images/header1.jpeg" },
        { id: 3, name: "Dubrava", image: "/static/images/header1.jpeg" },
        { id: 4, name: "Trnje", image: "/static/images/header1.jpeg" },
        { id: 5, name: "Žitnjak", image: "/static/images/header1.jpeg" },
        { id: 6, name: "Črnomerec", image: "/static/images/header1.jpeg" },
        { id: 7, name: "Vrapče", image: "/static/images/header1.jpeg" },
        { id: 8, name: "Novi Zagreb", image: "/static/images/header1.jpeg" },
        { id: 9, name: "Medveščak", image: "/static/images/header1.jpeg" },

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
        "Zdravstvena podrška (npr. prva pomoć, medicinski savjeti)"
    ]);

    return (
        <GlobalContext.Provider value={{ users, setUsers, kvartovi, setKvartovi, skills, setSkills }}>
            {children}
        </GlobalContext.Provider>
    );
};