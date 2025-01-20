import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_ponuda.css';

const DetaljiPonuda = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [ponuda, setPonuda] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPonudaDetails = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `ponuda/${id}/`;
                const response = await axios.post(apiUrl); 
                setPonuda(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ponuda details:', error);
                setLoading(false);
            }
        };

        fetchPonudaDetails();
    }, [id]);

    const handleViewOnMapsClick = () => {
        const location = `${ponuda.adresaTvrtka}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    

    const handleConfirm = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('Ponuda prihvaćena:', userData.id);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!ponuda) {
        return (
            <div className="error-message">
                <h3>Ponuda nije nađena</h3>
                <p>Nismo uspjeli pronaći tu ponudu! Molimo pokušajte opet!</p>
                <button onClick={() => navigate(-1)}>Povratak</button> 
            </div>
        );
    }

    return (
        <div className="ponuda-details-container">
            <h2>Detalji ponude</h2>
            <p><strong>Adresa:</strong> {ponuda.adresaTvrtka}</p>
            <p><strong>Opis:</strong> {ponuda.opisPonuda || 'N/A'}</p>
            <p><strong>Cijena:</strong> {ponuda.cijenaNovac}</p>
            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                Pogledaj lokaciju na karti
            </button>

            <button onClick={handleConfirm}>Prihvati ponudu</button>

            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};

export default DetaljiPonuda;