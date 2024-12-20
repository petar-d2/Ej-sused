import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/susjed_card.css';

const SusjedCard = ({ user }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const userId = user.sifSusjed ? user.sifSusjed.id : user.korisnik_id;
        navigate(`/susjed/${userId}`);
    };
    /*
    const handleViewOnMapsClick = () => {
        const location = `${user.mjestoSusjed}, ${user.kvartSusjed}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };
    */
   
    const skillsArray = user.skills ? user.skills.split(',').map(skill => skill.trim()) : [];

    // zvjezdice na temelju ocjene
    const renderStars = () => {
        const totalStars = 5;
        const fullStars = Math.floor(user.ocjena); // cijele zvjezdice
        const halfStar = user.ocjena % 1 >= 0.5; // pola zvjezdice ako je ima
        const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <div className="susjed-card" onClick={handleCardClick}>
            <h3>{user.ime} {user.prezime}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Vještine:</strong></p>
            <div className="skills-container">
                {skillsArray.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                ))}
            </div>
            <p><strong>Ocjena:</strong> <span className="star-rating">{renderStars()}</span> ({user.ocjena})</p>
        </div>
    );
};

export default SusjedCard;
