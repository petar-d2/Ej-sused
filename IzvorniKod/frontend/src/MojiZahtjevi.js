import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/zahtjevi.css';

const MojiZahtjevi = () => {
  const [zahtjevi, setZahtjevi] = useState([]); // State for user's zahtjevi
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch zahtjevi created by the logged-in user
  const fetchZahtjevi = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')); // Retrieve user data
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/')+`moji-zahtjevi/${userData.id}/` // Backend endpoint for user's zahtjevi
      );
      setZahtjevi(response.data);
    } catch (error) {
      console.error('Error fetching zahtjevi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch zahtjevi on component mount
  useEffect(() => {
    fetchZahtjevi();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className='body_zahtjevi'>
      <h2>Moji Zahtjevi</h2>
      <div className="zahtjevi-container">
        {zahtjevi.length > 0 ? (
          zahtjevi.map((zahtjev) => (
            <div key={zahtjev.id} className="zahtjev-card">
              <h3>{zahtjev.nazivZahtjev}</h3>
              <p><strong>Adresa:</strong> {zahtjev.adresaZahtjev}</p>
              <p><strong>Status:</strong> {zahtjev.statusZahtjev}</p>
              <p><strong>Opis:</strong> {zahtjev.opisZahtjev || 'Nema opisa'}</p>
              <p><strong>Cijena Bodova:</strong> {zahtjev.cijenaBod}</p>
            </div>
          ))
        ) : (
          <p>Nemate nijedan zahtjev.</p>
        )}
      </div>
    </div>
  );
};

export default MojiZahtjevi;
