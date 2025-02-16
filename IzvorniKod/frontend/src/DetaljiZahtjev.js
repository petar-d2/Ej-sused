import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_zahtjev.css';

const DetaljiZahtjev = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [zahtjev, setZahtjev] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0); // Added state for user points
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

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

        const fetchUserPoints = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    const userId = userData.id;
                    const pointsApiUrl = window.location.href.replace(window.location.pathname, '/') + `user/${userId}/points/`;
                    const response = await axios.get(pointsApiUrl); 
                    setUserPoints(response.data.points); // Assume response contains `points`
                }
            } catch (error) {
                console.error('Error fetching user points:', error);
            }
        };

        fetchZahtjevDetails();
        //fetchUserPoints(); // Fetch user points
    }, [id]);

    const handleViewOnMapsClick = () => {
        const location = `${zahtjev.adresaZahtjev}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };

    const handleConfirm = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) {
                setErrorMessage('Korisnik nije prijavljen!');
                return;
            }

            const confirmApiUrl = window.location.href.replace(window.location.pathname, '/') + `zahtjev/${id}/accept/`;
            const response = await axios.post(confirmApiUrl, { userId: userData.id });

            if (response.data.success) {
                setUserPoints((prevPoints) => prevPoints - zahtjev.cijenaBod);
                setErrorMessage(''); // Clear any previous errors
                alert('Zahtjev uspješno prihvaćen!');
            } else {
                setErrorMessage(response.data.message || 'Došlo je do greške prilikom prihvaćanja zahtjeva!');
            }
        } catch (error) {
            console.error('Error confirming zahtjev:', error);
            setErrorMessage('Došlo je do greške prilikom prihvaćanja zahtjeva!');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ČEKANJE':
                return 'status-waiting';
            case 'PREKINUTO':
                return 'status-canceled';
            default:
                return 'status-accepted';
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

            {/* User Points Display */}
            <div className="skills-container">
                {Array.isArray(zahtjev.sifVrsta) 
                    ? zahtjev.sifVrsta.map((service, index) => (
                        <span key={index} className="skill-badge">{service}</span>
                    ))
                    : <span className="skill-badge">{zahtjev.sifVrsta}</span>}
            </div>

            <p><strong>Status:</strong> <span className={getStatusClass(zahtjev.statusZahtjev)}>{zahtjev.statusZahtjev}</span></p>
            <p><strong>Cijena (bodovi):</strong> {zahtjev.cijenaBod}</p>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                Pogledaj lokaciju na karti
            </button>

            <button onClick={handleConfirm}>Prihvati zahtjev</button>

            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};

export default DetaljiZahtjev;
