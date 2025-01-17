import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DogadajCard from './DogadajCard';
import './styles/dogadaji.css';

const Dogadaji = () => {
  const [events, setEvents] = useState([]); // State for holding fetched events
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortBy, setSortBy] = useState(''); // State for sorting
  const inputRef = useRef(null); // Reference for the input field

  // Fetch data from the server
  const fetchData = async (query = '', sort = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(
          window.location.pathname,
          '/'
        ) + 'search/'}?search=${query}&model=dogadaj&sort_by=${sort}`
      );
      setEvents(response.data); // Update events with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchData whenever searchQuery or sortBy changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery, sortBy);
    }, 500); // Delay to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, sortBy]);

  // Auto-focus the input field when the component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  // Handle sorting dropdown change
  const handleSortChange = (event) => {
    setSortBy(event.target.value); // Update sortBy state
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="headera" id="search">
        <input
          type="text"
          id="search1"
          ref={inputRef}
          placeholder="Pretraži po nazivu događaja..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select id="sort_dogadaji"
          className="filter-dropdown"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sortiraj</option>
          <option value="datumDogadaj">Datum - Uzlazno</option>
          <option value="-datumDogadaj">Datum - Silazno</option>
          <option value="nagradaBod">Bodovi - Uzlazno</option>
          <option value="-nagradaBod">Bodovi - Silazno</option>
        </select>
      </div>

      <div className="dogadaj-card-container">
        {events.map((event) => (
          <DogadajCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Dogadaji;
