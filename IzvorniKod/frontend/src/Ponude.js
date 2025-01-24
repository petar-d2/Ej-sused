import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PonudaCard from './PonudaCard';
import './styles/ponude.css';

const Ponude = () => {
  const [ponude, setPonude] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [sortBy, setSortBy] = useState(''); // State for sorting
  const [loading, setLoading] = useState(true); // Loading state
  const inputRef = useRef(null); // Reference for input

  // Fetch all zahtjevi
  const fetchPonude = async (query = '', sort = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(
          window.location.pathname,
          '/'
        ) + 'search/'}?search=${query}&model=ponuda&sort_by=${sort}`
      );
      setPonude(response.data);
    } catch (error) {
      console.error('Error fetching ponude:', error);
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
      fetchPonude(searchQuery, sortBy);
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
    <div className="body_ponude">
      <div className="header-ponude" id="search">
        <input
          id="search1"
          type="text"
          ref={inputRef}
          placeholder="Pretraži po nazivu ponude..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select id="sort_ponude"
          className="filter-dropdown"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sortiraj</option>
          <option value="cijenaNovac">Cijena - Uzlazno</option>
          <option value="-cijenaNovac">Cijena - Silazno</option>
        </select>
      </div>

      <div className="ponude-container">
        {ponude.map((event) => (
          <PonudaCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Ponude;