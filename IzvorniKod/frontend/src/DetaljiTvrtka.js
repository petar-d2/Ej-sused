import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/detalji_tvrtka.css';

const DetaljiTvrtka = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [tvrtka, setTvrtka] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch tvrtka details with ID
    useEffect(() => {
        const fetchTvrtkaDetails = async () => {
            try {
                // Adjust API URL to correctly fetch tvrtka details
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `tvrtka/${id}/`;
                const response = await axios.get(apiUrl); 
                setTvrtka(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tvrtka details:', error);
                setLoading(false);
            }
        };

        fetchTvrtkaDetails();
    }, [id]);
    
    const handleViewOnMapsClick = () => {
        const location = `${tvrtka.adresaTvrtka}`;
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

    if (!tvrtka) {
        return (
            <div className="error-message">
                <h3>Tvrtka nije nađena</h3>
                <p>Nismo uspjeli pronaći tu tvrtku! Molimo pokušajte opet!</p>
                <button onClick={() => navigate(-1)}>Povratak</button> 
            </div>
        );
    }

    return (
        <div className="tvrtka-details-container">
                <h2>Detalji tvrtke</h2>
                <p><strong>Naziv:</strong> {tvrtka.nazivTvrtka}</p>
                <p><strong>Kontakt:</strong> {tvrtka.email}</p>
                <p><strong>Adresa:</strong> {tvrtka.adresaTvrtka}</p>
                <p><strong>Kvart:</strong> {tvrtka.kvartTvrtka}</p>
                <p><strong>Opis:</strong> {tvrtka.opisTvrtka || 'N/A'}</p>
                <p><strong>Ocjena:</strong> <span className="star-rating">{renderStars()}</span> ({tvrtka.ocjena})</p>
                <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                        Pogledaj lokaciju na karti
                </button>
                <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};
export default DetaljiTvrtka;
