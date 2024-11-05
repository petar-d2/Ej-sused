import React, { createContext, useState } from 'react';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });
    const [kvartovi, setKvartovi] = useState([
        { id: 1, name: "Trešnjevka", image: "/images/header1.jpeg" },
        { id: 2, name: "Maksimir", image: "/images/header1.jpeg" },
        { id: 3, name: "Dubrava", image: "/images/header1.jpeg" },
    ]);

    return (
        <GlobalContext.Provider value={{ users, setUsers, kvartovi, setKvartovi }}>
            {children}
        </GlobalContext.Provider>
    );
};