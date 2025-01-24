import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_dogadaj.css';

const DetaljiDogadaj = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [dogadaj, setDogadaj] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDogadajDetails = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `dogadaj/${id}/`;
                const response = await axios.post(apiUrl); 
                setDogadaj(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dogadaj details:', error);
                setLoading(false);
            }
        };

        fetchDogadajDetails();
    }, [id]);

    const handleViewOnMapsClick = () => {
        const location = `${dogadaj.adresaDogadaj}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    

    const handleConfirm = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('Dolazak potvrden:', userData.id);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!dogadaj) {
        return (
            <div className="error-message">
                <h3>Događaj nije nađen</h3>
                <p>Nismo uspjeli pronaći taj događaj! Molimo pokušajte opet!</p>
                <button onClick={() => navigate(-1)}>Povratak</button> 
            </div>
        );
    }
    const getStatusClass = (status) => {
        if (status === 'ODOBRAVANJE') return 'status-waiting'; // Orange for ČEKANJE
        if (status === 'ODBIJENO') return 'status-rejected'; // Red for PREKINUTO
        return 'status-other'; // Green for other statuses
      };
    return (
        <div className="dogadaj-details-container">
            <h2>Detalji događaja</h2>
            <p><strong>Datum:</strong> {dogadaj.datumDogadaj}</p>
            <p><strong>Vrijeme:</strong> {dogadaj.vrijemeDogadaj}</p>
            <p><strong>Adresa:</strong> {dogadaj.adresaDogadaj}</p>
            <p><strong>Vrsta:</strong> {dogadaj.vrstaDogadaj}</p>
            <p><strong>Opis:</strong> {dogadaj.opisDogadaj || 'N/A'}</p>
            <p><strong>Status:</strong> <span className={getStatusClass(dogadaj.statusDogadaj)}>{dogadaj.statusDogadaj}</span></p>
            <p><strong>Broj bodova za dolazak:</strong> {dogadaj.nagradaBod}</p>
            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                Pogledaj lokaciju na karti
            </button>

            <button onClick={handleConfirm}>Potvrdi dolazak</button>

            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};

export default DetaljiDogadaj;
