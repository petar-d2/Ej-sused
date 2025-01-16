import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SusjedCard from './SusjedCard';
import './styles/ponude_susjeda.css';

const PonudeSusjeda = () => {
  const [users, setSusjedi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const inputRef = useRef(null);

  const fetchData = async (query = '', skill = '', sort = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.href.replace(window.location.pathname, '/') + 'search/'}?search=${query}&model=susjed&skills=${skill}&sort_by=${sort}`
      );
      setSusjedi(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${window.location.href.replace(window.location.pathname, '/') + 'skills/'}`
      );
      setSkillsList(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills(); // Fetch skills list on component mount
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery, skills, sortBy);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, skills, sortBy]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSkillsChange = (event) => {
    setSkills(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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
    <div className ="body">
      <div className="headera" id="search">
        <input
          id="search1"
          type="text"
          ref={inputRef}
          placeholder="Pretraži po imenu..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={skills}
          onChange={handleSkillsChange}
        >
          <option value="">Svi skillovi</option>
          {skillsList.map((skill, index) => (
            <option key={index} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <select

          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sortiraj</option>
          <option value="brojOcjena">Po broju ocjena</option>
          <option value="zbrojOcjena">Po zbroju ocjena</option>
        </select>
      </div>

      <div className="susjed-card-container">
        {users.map((user) => (
          <SusjedCard key={user.korisnik_id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default PonudeSusjeda;
