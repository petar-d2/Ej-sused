import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/detalji_tvrtka.css';

const DetaljiTvrtka = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user details with ID
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Adjust API URL to correctly fetch user details
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `tvrtka/${id}/`;
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
        const location = `${user.kvartTvrtka}, ${user.adresaTvrtka}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    
    // Function to generate star rating based on `ocjena`
    const renderStars = () => {
        const totalStars = 5;
        const fullStars = Math.floor(tvrtka.ocjena); // Full stars based on ocjena
        const halfStar = tvrtka.ocjena % 1 >= 0.5; // Check if there's a half star
        const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="error-message">
                <h3>Tvrtka Not Found</h3>
                <p>Nismo uspjeli pronaći tu tvrtku! Molimo pokušajte opet!</p>
                <button onClick={() => navigate('/')}>Povratak</button> 
            </div>
        );
    }

    return (
        <div className="user-details-container">
                <h2>Detalji tvrtke</h2>
                <p><strong>Ime:</strong> {user.ime}</p>
                <p><strong>Prezime:</strong> {user.prezime}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Adresa:</strong> {user.adresa}</p>
                <p><strong>Kvart:</strong> {user.kvartTvrtka}</p>
                <p><strong>Opis:</strong> {user.opis || 'N/A'}</p>
                <p><strong>Ocjena:</strong> <span className="star-rating">{renderStars()}</span> ({user.ocjena})</p>
                <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                        Pogledaj lokaciju na karti
                </button>
                <button onClick={() => navigate(-1)}>Povratak</button> {/* Navigate back */}
                
        </div>
    );
};
export default DetaljiTvrtka;
