import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // For extracting user ID from the URL
import './styles/detalji_susjed.css';
const DetaljiSusjed = () => {
    const { id } = useParams();  // Extract user ID from URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user details based on ID
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(window.location.href.replace(window.location.pathname,'/') + `susjed/${id}/`);  // API call to get user details by ID
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id]); // Re-fetch when the ID changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }
    {/* DETALJI npr strong je generirano sa ChatGPT-om */}
    return (
        <div className="user-details-container">
            <h2>Detalji korisnika</h2>
            <p><strong>Ime:</strong> {user.ime}</p>
            <p><strong>Prezime:</strong> {user.prezime}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Adresa:</strong> {user.adresa}</p>
            <p><strong>Broj bodova:</strong> {user.bodovi || 'N/A'}</p>
            <p><strong>Opis:</strong> {user.opis || 'N/A'}</p>

            {/* Placeholder for map button */}
            <button onClick={() => alert('Prikazivanje na karti...')}>
                Prikazivanje na karti
            </button>
            <button onClick={() => navigate(-1)}>Back</button> {/* Navigate back */}
        </div>
    );
};

export default DetaljiSusjed;
