// DogadajCard.js
import React from 'react';
import './styles/dogadaji.css'; // Assuming a separate CSS file for styling individual cards

const DogadajCard = ({ event }) => {
  return (
    <div className="dogadaj-card">
      <h3>{event.nazivDogadaj}</h3>
      <p><strong>Datum:</strong> {event.datumDogadaj}</p>
      <p><strong>Vrijeme:</strong> {event.vrijemeDogadaj}</p>
      <p><strong>Adresa:</strong> {event.adresaDogadaj}</p>
      <p><strong>Vrsta:</strong> {event.vrstaDogadaj}</p>
      <p><strong>Status:</strong> {event.statusDogadaj}</p>
      <p><strong>Nagrada:</strong> {event.nagradaBod} bodova</p>
      {event.opisDogadaj && <p><strong>Opis:</strong> {event.opisDogadaj}</p>}
    </div>
  );
};

export default DogadajCard;