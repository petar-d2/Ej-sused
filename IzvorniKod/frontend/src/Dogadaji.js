// Dogadaji.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DogadajCard from './DogadajCard'; // Import DogadajCard component
import './styles/dogadaji.css'; // Assuming this CSS is already created

const Dogadaji = () => {
  const [events, setEvents] = useState([]); // State for holding fetched events
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the views.py/API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        window.location.href.replace(window.location.pathname, '/') + 'dogadaji/'
      );
      setEvents(response.data); // Set fetched data to state
    } catch (error) {
      console.error('Error fetching events:', error); // Log errors
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  // Fetch data when page opens
  useEffect(() => {
    fetchData();
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
      <h2>Događaji</h2>
      
      <div className="dogadaj-card-container">
        {events.map((event) => (
          <DogadajCard key={event.id} event={event} /> // Show a card for each event
        ))}
      </div>
    </div>
  );
};


export default Dogadaji;