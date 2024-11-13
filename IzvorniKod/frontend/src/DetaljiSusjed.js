import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/detalji_susjed.css';

const DetaljiSusjed = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user details with ID
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Adjust API URL to correctly fetch user details
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `susjed/${id}/`;
                const response = await axios.get(apiUrl); 
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);
    const handleViewOnMapsClick = () => {
        alert("POLAKO, NISMO TOLIKO BAŠ BRZI")
    }
    /*
    const handleViewOnMapsClick = () => {
        const location = `${user.mjestoSusjed}, ${user.kvartSusjed}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    */
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="user-details-container">
            <h2>Detalji korisnika</h2>
            <p><strong>Ime:</strong> {user.ime}</p>
            <p><strong>Prezime:</strong> {user.prezime}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Adresa:</strong> {user.adresa}</p>
            <p><strong>Kvart:</strong> {user.kvartSusjed}</p>
            <p><strong>Broj bodova:</strong> {user.bodovi || 'N/A'}</p>
            <p><strong>Opis:</strong> {user.opis || 'N/A'}</p>

            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                View On Map
            </button>
            <button onClick={() => navigate(-1)}>Back</button> {/* Navigate back */}
            
        </div>
    );
};
export default DetaljiSusjed;
