import React from 'react';
import './styles/ponuda_card.css';
import { useNavigate } from 'react-router-dom';

const PonudaCard = ({ event }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
      const ponudaId = event.id;
      navigate(`/ponuda/${ponudaId}`);
  };

  return (
    <div id="ponuda-card" className="ponuda-card" onClick={handleCardClick}>
        <h3>{event.nazivPonuda}</h3>
        <p><strong>Adresa:</strong> {event.adresaTvrtka}</p>
        {event.opisZahtjev && <p><strong>Opis:</strong> {event.opisPonuda}</p>}
        <p><strong>Cijena:</strong> {event.cijenaNovac} €</p>
    </div>
  );
};

export default PonudaCard;