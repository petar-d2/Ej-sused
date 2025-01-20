// DogadajCard.js
import React from 'react';
import './styles/dogadaj_card.css';
import { useNavigate } from 'react-router-dom';

const ModeratorDogadajCard = ({ event, onStatusChange }) => {
  const navigate = useNavigate();
  const getStatusClass = (status) => {
    if (status === 'ODOBRAVANJE') return 'status-waiting'; // Orange for ČEKANJE
    if (status === 'ODBIJENO') return 'status-rejected'; // Red for PREKINUTO
    return 'status-other'; // Green for other statuses
  };

  const handleCardClick = () => {
    const dogadajId = event.id;
    navigate(`/dogadaj/${dogadajId}`);
  };
  

  const handleApprove = (e) => {
    e.stopPropagation();
    onStatusChange(event.id, 'ODOBRENO');
  };
  
  const handleReject = (e) => {
    e.stopPropagation();
    onStatusChange(event.id, 'ODBIJENO');
  };
  return (
    <div id="dogadaj-card" className="dogadaj-card" onClick={handleCardClick}>
      <h3>{event.nazivDogadaj}</h3>
      <p><strong>Datum:</strong> {event.datumDogadaj}</p>
      <p><strong>Vrijeme:</strong> {event.vrijemeDogadaj}</p>
      <p><strong>Adresa:</strong> {event.adresaDogadaj}</p>
      <p><strong>Vrsta:</strong> {event.vrstaDogadaj}</p>
      <p>
        <strong>Status:</strong> <span className={getStatusClass(event.statusDogadaj)}>{event.statusDogadaj}</span>
      </p>
      <p><strong>Nagrada:</strong> {event.nagradaBod} bodova</p>
      {event.opisDogadaj && <p><strong>Opis:</strong> {event.opisDogadaj}</p>}

      {/* Buttons to approve or reject */}
      <div className='button-container'>
        <button onClick={handleApprove} className="view-map-button">Odobri</button>
        <button onClick={handleReject} className="view-map-button">Odbij</button>
      </div>
    </div>
  );
};

export default ModeratorDogadajCard;
