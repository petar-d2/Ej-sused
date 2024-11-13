import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import navigate for routing
import './styles/ponude_susjeda.css'; // Assuming this CSS is already created

const PonudeSusjeda = () => {
  const [users, setSusjedi] = useState([]);  // State for holding fetched users
  const [loading, setLoading] = useState(true);  // Loading state
  const navigate = useNavigate(); // Initialize navigate

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ponude-susjeda/');
      setSusjedi(response.data);  // Set fetched data to state
    } catch (error) {
      console.error('Error fetching data:', error);  // Log errors
    } finally {
      setLoading(false);  // Set loading to false when data is fetched
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to navigate to the user's detail page when clicked
  const handleUserClick = (userId) => {
    navigate(`/susjed/${userId}`);  // Navigate to user details page using the user ID
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Ponude Susjeda</h2>

      {/* Display list of users */}
      <ul>
        {users.map((user) => (
          <li key={user.korisnik_id} onClick={() => handleUserClick(user.korisnik_id)}>  {/* Make each list item clickable */}
            <strong>Ime i Prezime:</strong> {user.ime} {user.prezime} <br />
            <strong>Vještine:</strong> {user.skills ? user.skills.split(',').map(skill => skill.trim()).join(', ') : 'N/A'} <br />
            <strong>Ocjena:</strong> {user.ocjena} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PonudeSusjeda;
