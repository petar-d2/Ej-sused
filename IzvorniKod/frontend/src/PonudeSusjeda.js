// PonudeSusjeda.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SusjedCard from './SusjedCard'; // Import SusjedCard component
import './styles/ponude_susjeda.css'; // Assuming this CSS is already created

const PonudeSusjeda = () => {
  const [users, setSusjedi] = useState([]); // State for holding fetched users
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the views.py/API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        window.location.href.replace(window.location.pathname, '/') + 'ponude-susjeda/'
      );
      setSusjedi(response.data); // Set fetched data to state
    } catch (error) {
      console.error('Error fetching data:', error); // Log errors
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  // Fetch data when page opens
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Ponude Susjeda</h2>
      
      {/* Display list of users using SusjedCard */}
      <div className="susjed-card-container">
        {users.map((user) => (
          <SusjedCard key={user.korisnik_id} user={user} /> // Load SusjedCard for each user
        ))}
      </div>
    </div>
  );
};

export default PonudeSusjeda;