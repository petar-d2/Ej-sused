import React from 'react';
import './styles/zahtjev_card.css';
import { useNavigate } from 'react-router-dom';

const ZahtjevCard = ({ event }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
      const zathjevId = event.id;
      navigate(`/zahtjev/${zathjevId}`);
  };

  return (
    <div id="zahtjev-card" className="zahtjev-card" onClick={handleCardClick}>
        <h3>{event.nazivZahtjev}</h3>
        <p><strong>Adresa:</strong> {event.adresaZahtjev}</p>
        <p><strong>Status:</strong> {event.statusZahtjev}</p>
        {event.opisZahtjev && <p><strong>Opis:</strong> {event.opisZahtjev}</p>}
        <p><strong>Cijena (bodovi):</strong> {event.cijenaBod}</p>
    </div>
  );
};

export default ZahtjevCard;