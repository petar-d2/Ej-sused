import React, { useState, useEffect } from 'react';
import './styles/tvrtke.css';
import TvrtkaCard from './TvrtkaCard';
import axios from 'axios';

const Tvrtke = () => {
  const [users, setTvrtke] = useState([]);
  const [loading, setLoading] = useState(true); // ucitavanje da/ne

  //dohvati popis tvrtki
  const fetchData = async () => {
    try {
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/') + 'tvrtke/'
      );
      setTvrtke(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // kad se ucitalo
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
      
      <div className="susjed-card-container">
        {users.map((tvrtka) => (
          <TvrtkaCard key={tvrtka.korisnik_id} tvrtka={tvrtka} /> // za svaku tvrtku prikazi karticu
        ))}
      </div>
    </div>
  );
}

export default Tvrtke;
