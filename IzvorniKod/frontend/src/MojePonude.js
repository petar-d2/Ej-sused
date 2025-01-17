import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/zahtjevi.css';

const MojePonude = () => {
  const [ponude, setPonude] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchPonude = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')); 
      const response = await axios.post(
        `/api/ponude/moje-ponude/${userData.id}/` 
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
    <div>
      <div className="zahtjevi-container">
        {ponude.length > 0 ? (
          ponude.map((ponuda) => (
            <div key={ponuda.id} className="zahtjev-card">
              <h3>{ponuda.nazivPonuda}</h3>
              <p><strong>Adresa:</strong> {ponuda.adresaPonuda}</p>
              <p><strong>Opis:</strong> {ponuda.opisPonuda || 'Nema opisa'}</p>
              <p><strong>Cijena:</strong> {ponuda.cijena}</p>
            </div>
          ))
        ) : (
          <p>Nemate nijednu ponudu.</p>
        )}
      </div>
    </div>
  );
};

export default MojePonude;
