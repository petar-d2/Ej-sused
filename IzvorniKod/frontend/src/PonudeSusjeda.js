import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SusjedCard from './SusjedCard';
import './styles/ponude_susjeda.css';

const PonudeSusjeda = () => {
  const [users, setSusjedi] = useState([]); // State for holding fetched users
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const inputRef = useRef(null); // Reference for the input field

  // Fetch data from the API
  const fetchData = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(window.location.pathname, '/') + 'search/'}?search=${query}&model=susjed`
      );
      setSusjedi(response.data); // Update users with search results
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce fetchData to reduce API calls (optional but recommended)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery);
    }, 500); // Wait 300ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
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
    <div>
      <div className="header" id="search">
        <h2>Ponude susjeda</h2>
        <input
          type="text"
          ref={inputRef} // Reference the input field
          placeholder="Pretraži po imenu..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="susjed-card-container">
        {users.map((user) => (
          <SusjedCard key={user.korisnik_id} user={user} /> // Render card for each user
        ))}
      </div>
    </div>
  );
};

export default PonudeSusjeda;
