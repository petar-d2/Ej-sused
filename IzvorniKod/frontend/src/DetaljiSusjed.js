import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_susjed.css';

const DetaljiSusjed = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetchaj podatke o korisniku preko id-a
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `susjed/${id}/`;
                const response = await axios.post(apiUrl); 
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
    const renderStars = () => {
        const totalStars = 5;
        const ocjena = user.brojOcjena!=0 ? user.zbrojOcjena/user.brojOcjena : 0.0;
        const fullStars = Math.floor(ocjena);
        const halfStar = ocjena % 1 >= 0.5;
        const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    /*
    const handleViewOnMapsClick = () => {
        const location = `${user.mjestoSusjed}, ${user.kvartSusjed}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    */
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
                <h3>Susjed nije pronađen</h3>
                <p>Nismo uspjeli pronaći tog susjeda! Molimo pokušajte opet!</p>
                <button onClick={() => navigate('/')}>Povratak</button> 
            </div>
        );
    }
    return (
        <div className="user-details-container">
            <h2>Detalji korisnika</h2>
            <p><strong>Ime:</strong> {user.ime}</p>
            <p><strong>Prezime:</strong> {user.prezime}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Kvart:</strong> {user.kvartSusjed}</p>
            <p><strong>Broj bodova:</strong> {user.bodovi || 'N/A'}</p>
            <p><strong>Opis:</strong> {user.opis || 'N/A'}</p>
            <p>
                <strong>Ocjena:</strong> <span className="star-rating">{renderStars()}</span> 
                <p style={{textAlign:"center"}}>({user.brojOcjena!=0 ? Math.round((user.zbrojOcjena / user.brojOcjena) * 100) / 100 : 0.0})</p>
            </p>
            <button onClick={() => navigate(-1)}>Povratak</button> {/* vrati se nazad */}
            
        </div>
    );
};
export default DetaljiSusjed;
