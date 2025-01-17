import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TvrtkaCard from './TvrtkaCard';
import './styles/tvrtke.css';

const Tvrtke = () => {
  const [users, setTvrtke] = useState([]); // State for holding fetched companies
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortBy, setSortBy] = useState(''); // State for sorting
  const inputRef = useRef(null); // Reference for the input field

  // Fetch data from the API
  const fetchData = async (query = '', sort = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(
          window.location.pathname,
          '/'
        ) + 'search/'}?search=${query}&model=tvrtka&sort_by=${sort}`
      );
      setTvrtke(response.data); // Update tvrtke with search results
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce fetchData to reduce API calls (optional but recommended)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery, sortBy);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sortBy]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  // Handle sorting dropdown change
  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update sortBy state
  };

  // Auto-focus the input field when the component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the input field
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tvrtke_body">
      <div className="header-tvrtke" id="search">
        <input
          id="search1"
          type="text"
          ref={inputRef} // Reference the input field
          placeholder="Pretraži po nazivu..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select id="sort_tvrtke"
          className="filter-dropdown"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sortiraj</option>
          <option value="ocjena">Ocjena - Uzlazno</option>
          <option value="-ocjena">Ocjena - Silazno</option>
        </select>
      </div>

      <div className="tvrtka-card-container">
        {users.map((tvrtka) => (
          <TvrtkaCard key={tvrtka.korisnik_id} tvrtka={tvrtka} /> // Render card for each company
        ))}
      </div>
    </div>
  );
};

export default Tvrtke;
