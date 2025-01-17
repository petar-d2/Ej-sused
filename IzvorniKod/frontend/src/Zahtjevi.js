import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ZahtjevCard from './ZahtjevCard';
import './styles/zahtjevi.css';

const Zahtjevi = () => {
  const [zahtjevi, setZahtjevi] = useState([]); // State for all zahtjevi
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [sortBy, setSortBy] = useState(''); // State for sorting
  const [loading, setLoading] = useState(true); // Loading state
  const inputRef = useRef(null); // Reference for input

  // Fetch all zahtjevi
  const fetchZahtjevi = async (query = '', sort = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(
          window.location.pathname,
          '/'
        ) + 'search/'}?search=${query}&model=zahtjev&sort_by=${sort}`
      );
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

  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update sortBy state
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
      fetchZahtjevi(searchQuery, sortBy);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sortBy]);

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
        <select id="sort_zahtjevi"
          className="filter-dropdown"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sortiraj</option>
          <option value="cijenaBod">Bodovi - Uzlazno</option>
          <option value="-cijenaBod">Bodovi - Silazno</option>
        </select>
      </div>

      <div className="zahtjevi-container">
        {zahtjevi.map((event) => (
          <ZahtjevCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Zahtjevi;
