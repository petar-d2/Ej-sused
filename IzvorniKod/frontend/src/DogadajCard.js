// DogadajCard.js
import React from 'react';
import './styles/dogadaj_card.css';
import { useNavigate } from 'react-router-dom';

const DogadajCard = ({ event }) => {
  const navigate = useNavigate();
  // Function to determine the status color (similar to "DetaljiZahtjev" logic)
  const getStatusClass = (status) => {
    if (status === 'ODOBRAVANJE') return 'status-waiting'; // Orange for ČEKANJE
    if (status === 'PREKINUTO') return 'status-rejected'; // Red for PREKINUTO
    return 'status-other'; // Green for other statuses
  };
  const handleCardClick = () => {
      const dogadajId = event.id;
      navigate(`/dogadaj/${dogadajId}`);
  };

  return (
    <div id="dogadaj-card" className="dogadaj-card" onClick={handleCardClick}>
      <h3>{event.nazivDogadaj}</h3>
      <p><strong>Datum:</strong> {event.datumDogadaj}</p>
      <p><strong>Vrijeme:</strong> {event.vrijemeDogadaj}</p>
      <p><strong>Adresa:</strong> {event.adresaDogadaj}</p>
      <p><strong>Vrsta:</strong> {event.vrstaDogadaj}</p>
      <p><strong>Status:</strong> <span className={getStatusClass(event.statusDogadaj)}>{event.statusDogadaj}</span></p>
      <p><strong>Nagrada:</strong> {event.nagradaBod} bodova</p>
      {event.opisDogadaj && <p><strong>Opis:</strong> {event.opisDogadaj}</p>}
    </div>
  );
};

export default DogadajCard;