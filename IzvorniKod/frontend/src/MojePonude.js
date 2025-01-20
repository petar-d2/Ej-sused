import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ponude.css';
import PonudaCard from './PonudaCard';

const MojePonude = () => {
  const [ponude, setPonude] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchPonude = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/')+`moje-ponude/${userData.id}/`
      );
      setPonude(response.data);
    } catch (error) {
      console.error('Error fetching ponude:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPonude();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className='body_ponude'>
      <h2>Moje Ponude</h2>
      <div className="ponude-container">
        {ponude.length > 0 ? (
          /*ponude.map((ponuda) => (
            <div key={ponuda.id} className="ponuda-card">
              <h3>{ponuda.nazivPonuda}</h3>
              <p><strong>Adresa:</strong> {ponuda.adresaPonuda}</p>
              <p><strong>Opis:</strong> {ponuda.opisPonuda || 'Nema opisa'}</p>
              <p><strong>Cijena:</strong> {ponuda.cijena}</p>
            </div>
          ))*/
          ponude.map((event) => (
            <PonudaCard key={event.id} event={event} />
          ))
        ) : (
          <p>Nemate nijednu ponudu.</p>
        )}
      </div>
    </div>
  );
};

export default MojePonude;
