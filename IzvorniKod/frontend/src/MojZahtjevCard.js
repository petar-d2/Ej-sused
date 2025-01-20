import React from 'react';
import './styles/zahtjev_card.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MojZahtjevCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const zahtjevId = event.id;
    navigate(`/zahtjev/${zahtjevId}`);
  };

  const getStatusClass = (status) => {
    if (status === 'ČEKANJE') return 'status-waiting';
    if (status === 'PREKINUTO') return 'status-rejected';
    return 'status-other';
  };

  const updateStatus = async (zahtjevId, status) => {
    try {
      const response = await axios.post(`zahtjev/update-status/${zahtjevId}/`, { status });
      alertUser(response.data.message, 'success');
      setTimeout(() => { navigate(`/zahtjev/${zahtjevId}`); }, 3500);
    } catch (error) {
      alertUser('Failed to update status', 'error');
    }
    setTimeout(() => { navigate(`/zahtjev/${zahtjevId}`); }, 3500);
  };

  const handleObavljenoClick = async (e) => {
    e.stopPropagation(); // Prevent the card click event
    await updateStatus(event.id, 'OBAVLJENO');
    navigate('/moji-zahtjevi');
  };

  const handleNeprihvacenoClick = async (e) => {
    e.stopPropagation(); // Prevent the card click event
    await updateStatus(event.id, 'PREKINUTO');
    navigate('/moji-zahtjevi');
  };

  const alertUser = (message, type) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alert", type);

    const alertMessage = document.createElement("p");
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

  return (
    <div id="zahtjev-card" className="zahtjev-card" onClick={handleCardClick}>
      <h3>{event.nazivZahtjev}</h3>
      <p><strong>Adresa:</strong> {event.adresaZahtjev}</p>
      <p><strong>Status:</strong> <span className={getStatusClass(event.statusZahtjev)}>{event.statusZahtjev}</span></p>
      <div className="skills-container">
        <span className="skill-badge">{event.sifVrsta}</span>
      </div>
      {event.opisZahtjev && <p><strong>Opis:</strong> {event.opisZahtjev}</p>}
      <p><strong>Cijena (bodovi):</strong> {event.cijenaBod}</p>
      <p><strong>Izvršitelj:</strong> {event.sifIzvrsitelj}</p>
      <div className="action-buttons">
        <button className="btn-obavljeno" onClick={handleObavljenoClick}>OBAVLJENO</button>
        <button className="btn-neprihvaceno" onClick={handleNeprihvacenoClick}>PREKINUTO</button>
      </div>
    </div>
  );
};

export default MojZahtjevCard;
