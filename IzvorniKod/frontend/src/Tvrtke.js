import React, { useState, useEffect } from 'react';
import './styles/tvrtke.css'; // Assuming this CSS is already created
import TvrtkaCard from './TvrtkaCard';
import axios from 'axios';

const Tvrtke = () => {
  const [users, setTvrtke] = useState([]); // State for 
  const [loading, setLoading] = useState(true); // Loading state
  //dohvati popis tvrtki
  const fetchData = async () => {
    try {
      const response = await axios.get(
        window.location.href.replace(window.location.pathname, '/') + 'tvrtke/'
      );
      setTvrtke(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

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
      <h2>Tvrtke</h2>
      
      {/* Display list of users using SusjedCard */}
      <div className="susjed-card-container">
        {users.map((tvrtka) => (
          <TvrtkaCard key={tvrtka.korisnik_id} tvrtka={tvrtka} /> // Load SusjedCard for each user
        ))}
      </div>
    </div>
  );
}

export default Tvrtke;
