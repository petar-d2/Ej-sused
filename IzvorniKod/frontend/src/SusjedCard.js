import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SusjedCard.css';

const SusjedCard = ({ user }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const userId = user.sifSusjed ? user.sifSusjed.id : user.korinsnik_id;
        navigate(`/susjed/${userId}`);
    };

    // Function to handle the "View on Maps" button click
    const handleViewOnMapsClick = () => {
        const location = `${user.mjestoSusjed}, ${user.kvartSusjed}`; // Combine the city and neighborhood
        const encodedLocation = encodeURIComponent(location);  // URL-encode the location
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;  // Google Maps URL with the encoded location
        
        // Open the location in a new tab (or you can use window.location.href to navigate in the same window)
        window.open(mapsUrl, '_blank');
    };

    return (
        <div className="susjed-card" onClick={handleCardClick}>
            <h3>{user.ime} {user.prezime}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Vještine:</strong> {user.skills ? user.skills.split(',').map(skill => skill.trim()).join(', ') : 'N/A'}</p>
            <p><strong>Ocjena:</strong> {user.ocjena}</p>
            <p><strong>Bodovi:</strong> {user.bodovi}</p>
            <button className="view-map-button" onClick={handleViewOnMapsClick}>View on Maps</button>
        </div>
    );
};

export default SusjedCard;
