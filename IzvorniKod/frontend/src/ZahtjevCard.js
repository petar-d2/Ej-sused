import React from 'react';
import './styles/zahtjev_card.css';
import { useNavigate } from 'react-router-dom';

const ZahtjevCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const zahtjevId = event.id;
    navigate(`/zahtjev/${zahtjevId}`);
  };

  // Function to determine the status color (similar to "DetaljiZahtjev" logic)
  const getStatusClass = (status) => {
    if (status === 'ČEKANJE') return 'status-waiting'; // Orange for ČEKANJE
    if (status === 'PREKINUTO') return 'status-rejected'; // Red for PREKINUTO
    if (status === 'OBAVLJENO') return 'status-other'; // Red for
    return 'status-other'; // Green for other statuses
  };

  return (
    <div id="zahtjev-card" className="zahtjev-card" onClick={handleCardClick}>
      <h3>{event.nazivZahtjev}</h3>
      <p><strong>Adresa:</strong> {event.adresaZahtjev}</p>
      
      {/* Status with dynamic color (like in "DetaljiZahtjev") */}
      <p><strong>Status:</strong> <span className={getStatusClass(event.statusZahtjev)}>{event.statusZahtjev}</span>
      </p>

      {/* sifVrsta inside a container with skill-badge style */}
      <div className="skills-container">
        <span className="skill-badge">{event.sifVrsta}</span>
      </div>

      {event.opisZahtjev && <p><strong>Opis:</strong> {event.opisZahtjev}</p>}
      <p><strong>Cijena (bodovi):</strong> {event.cijenaBod}</p>
    </div>
  );
};

export default ZahtjevCard;
