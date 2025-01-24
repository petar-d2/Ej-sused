import React from 'react';
import './styles/zahtjev_card.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ZahtjevCard = ({ event, onIzvrsiteljAssigned }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const zahtjevId = event.id;
    navigate(`/zahtjev/${zahtjevId}`);
  };

  const alertUser = (message, type) => {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('custom-alert', type);

    const alertMessage = document.createElement('p');
    alertMessage.textContent = message;
    alertContainer.appendChild(alertMessage);

    document.body.appendChild(alertContainer);

    setTimeout(() => {
      alertContainer.style.opacity = 0;
    }, 3000);

    setTimeout(() => {
      document.body.removeChild(alertContainer);
    }, 3500);
  };
  const getStatusClass = (status) => {
    if (status === 'ČEKANJE') return 'status-waiting';
    if (status === 'PREKINUTO') return 'status-rejected';
    if (status === 'PRIHVAĆENO') return 'status-other';
    if (status === 'OBAVLJENO') return 'status-other';
    return 'status-other';
  };
  const handleAssignIzvrsitelj = async (e) => {
    e.stopPropagation(); // Prevent the card's onClick from triggering
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log(userData.id)
      const response = await axios.post(`/zahtjev/assign-izvrsitelj/${event.id}/`, {
        user_id: userData.id,
      });
  
      if (response.status === 200) {
        alertUser('Izvršitelj uspješno dodijeljen!', 'success');
        setTimeout(() => { navigate(`/zahtjev/${event.id}`); }, 3500);
        if (onIzvrsiteljAssigned) {
          onIzvrsiteljAssigned(event.id, userData.id);
        }
      }
    } catch (error) {
      console.error('Error assigning izvršitelj:', error);
      alertUser('Greška prilikom dodjele izvršitelja.', 'error');
    }
  };
  
  return (
    <div id="zahtjev-card" className="zahtjev-card" onClick={handleCardClick}>
      <h3>{event.nazivZahtjev}</h3>
      <p>
        <strong>Adresa:</strong> {event.adresaZahtjev}
      </p>

      {/* Status with dynamic color */}
      <p>
        <strong>Status:</strong>{' '}
        <span className={getStatusClass(event.statusZahtjev)}>
          {event.statusZahtjev}
        </span>
      </p>

      {/* sifVrsta inside a container with skill-badge style */}
      <div className="skills-container">
        <span className="skill-badge">{event.sifVrsta}</span>
      </div>

      {event.opisZahtjev && <p><strong>Opis:</strong> {event.opisZahtjev}</p>}
      <p>
        <strong>Cijena (bodovi):</strong> {event.cijenaBod}
      </p>

      {/* Prihvati button */}
      {event.statusZahtjev !== 'PRIHVAĆENO' && (
        <button className="prihvati-button" onClick={handleAssignIzvrsitelj}>
          <span className="button-icon">✓</span> Prihvati
        </button>
      )}
    </div>
  );
};

export default ZahtjevCard;
