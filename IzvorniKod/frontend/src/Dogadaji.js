import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DogadajCard from './DogadajCard';
import './styles/dogadaji.css';

const Dogadaji = () => {
  const [events, setEvents] = useState([]); // State for holding fetched events
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const inputRef = useRef(null); // Reference for the input field

  const fetchData = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(window.location.pathname, '/') + 'search/'}?search=${query}&model=dogadaj`
      );
      setEvents(response.data); // Update users with search results
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


  
  // Ensure filteredEvents is an array before calling .map
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
        <h2>Događaji</h2>
        <input
          type="text"
          ref={inputRef}
          placeholder="Pretraži po nazivu događaja..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="dogadaj-card-container">
        {/* Check if filteredEvents is an array before calling map */}
          {events.map((event) => (
            <DogadajCard key={event.id} event={event} />
          ))}

      </div>
    </div>
  );
};

export default Dogadaji;
