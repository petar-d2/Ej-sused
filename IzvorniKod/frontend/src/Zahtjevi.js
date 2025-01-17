import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/zahtjevi.css';

const Zahtjevi = () => {
  const [zahtjevi, setZahtjevi] = useState([]); // State for all zahtjevi
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(true); // Loading state
  const inputRef = useRef(null); // Reference for input

  // Fetch all zahtjevi
  const fetchZahtjevi = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(window.location.href.replace(window.location.pathname, '/')+`list?naziv=${query}/`);
      setZahtjevi(response.data);
    } catch (error) {
      console.error('Error fetching zahtjevi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Auto-focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Fetch zahtjevi whenever searchQuery changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchZahtjevi(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="body_zahtjevi">
      <div className="header-zahtjevi" id="search">
        <input
          id="search1"
          type="text"
          ref={inputRef}
          placeholder="Pretraži po nazivu zahtjeva..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="zahtjevi-container">
        {zahtjevi.map((zahtjev) => (
          <div key={zahtjev.id} className="zahtjev-card">
            <h3>{zahtjev.nazivZahtjev}</h3>
            <p><strong>Adresa:</strong> {zahtjev.adresaZahtjev}</p>
            <p><strong>Status:</strong> {zahtjev.statusZahtjev}</p>
            <p><strong>Opis:</strong> {zahtjev.opisZahtjev || 'Nema opisa'}</p>
            <p><strong>Cijena Bodova:</strong> {zahtjev.cijenaBod}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zahtjevi;
