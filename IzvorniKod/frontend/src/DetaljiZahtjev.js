import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_zahtjev.css';

const DetaljiZahtjev = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [zahtjev, setZahtjev] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZahtjevDetails = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `zahtjev/${id}/`;
                const response = await axios.post(apiUrl); 
                setZahtjev(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching zahtjev details:', error);
                setLoading(false);
            }
        };

        fetchZahtjevDetails();
    }, [id]);

    const handleViewOnMapsClick = () => {
        const location = `${zahtjev.adresaZahtjev}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };

    const handleConfirm = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('Zahtjev potvrden:', userData.id);
    };

    // Function to determine the status class
    const getStatusClass = (status) => {
        switch (status) {
            case 'ČEKANJE':
                return 'status-waiting';  // Orange color for ČEKANJE
            case 'PREKINUTO':
                return 'status-canceled'; // Red color for PREKINUTO
            default:
                return 'status-accepted'; // Green color for any other status
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!zahtjev) {
        return (
            <div className="error-message">
                <h3>Zahtjev nije nađen</h3>
                <p>Nismo uspjeli pronaći taj zahtjev! Molimo pokušajte opet!</p>
                <button onClick={() => navigate(-1)}>Povratak</button> 
            </div>
        );
    }

    return (
        <div className="zahtjev-details-container">
            <h2>Detalji zahtjeva</h2>
            <p><strong>Adresa:</strong> {zahtjev.adresaZahtjev}</p>
            <p><strong>Opis:</strong> {zahtjev.opisZahtjev || 'N/A'}</p>
            
            {/* Vrsta usluge container with badges */}
            <div className="skills-container">
                {Array.isArray(zahtjev.sifVrsta) 
                    ? zahtjev.sifVrsta.map((service, index) => (
                        <span key={index} className="skill-badge">{service}</span>
                    ))
                    : <span className="skill-badge">{zahtjev.sifVrsta}</span>}
            </div>

            <p><strong>Status:</strong> <span className={getStatusClass(zahtjev.statusZahtjev)}>{zahtjev.statusZahtjev}</span></p>
            <p><strong>Cijena (bodovi):</strong> {zahtjev.cijenaBod}</p>

            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                Pogledaj lokaciju na karti
            </button>

            <button onClick={handleConfirm}>Prihvati zahtjev</button>

            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};

export default DetaljiZahtjev;
