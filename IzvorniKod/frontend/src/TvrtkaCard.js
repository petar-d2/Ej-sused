import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/tvrtka_card.css';

const TvrtkaCard = ({ tvrtka }) => {
    const ocjena = tvrtka.brojOcjena!=0 ? tvrtka.zbrojOcjena/tvrtka.brojOcjena : 0.0;

    const navigate = useNavigate();

    const handleCardClick = () => {
        const tvrtkaId = tvrtka.sifTvrtka ? tvrtka.sifTvrtka.id : tvrtka.korisnik_id;
        navigate(`/tvrtka/${tvrtkaId}`);
    };

    // zvjezdice na temelju ocjene
    const renderStars = () => {
        const totalStars = 5;
        const fullStars = Math.floor(ocjena); // cijele zvjezdice
        const halfStar = ocjena % 1 >= 0.5; // pola zvjezdice ako je ima
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
        <div className="tvrtka-card" onClick={handleCardClick}>
            <h3>{tvrtka.nazivTvrtka}</h3>
            <p><strong>Adresa:</strong> {tvrtka.adresaTvrtka}</p>
            <p><strong>Opis:</strong> {tvrtka.opisTvrtka}</p>
            <p><strong>Ocjena:</strong> <span className="star-rating">{renderStars()}</span> ({tvrtka.brojOcjena!=0 ? tvrtka.zbrojOcjena/tvrtka.brojOcjena : 0.0})</p>
        </div>
    );
};

export default TvrtkaCard;
