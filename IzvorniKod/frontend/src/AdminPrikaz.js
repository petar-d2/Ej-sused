import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminPrikaz = () => {
    const [susjeds, setSusjeds] = useState([]);
    const [tvrtkas, setTvrtkas] = useState([]);
    const [komentari, setKomentari] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.isNadlezna) {
            navigate('/unauthorized');
        }
    }, [navigate]);
    // Fetch Susjeds, Tvrtkas, and Komentari
    useEffect(() => {
        const fetchData = async () => {
            try {
                const susjedsResponse = await axios.get('/search/?model=susjed');
                const tvrtkasResponse = await axios.get('/search/?model=tvrtka');
                const komentariResponse = await axios.get('/komentari/');
                setSusjeds(susjedsResponse.data);
                setTvrtkas(tvrtkasResponse.data);
                setKomentari(komentariResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error.response || error.message || error);
                console.error('Response data:', error.response.data); // Backend error message
                console.error('Response status:', error.response.status); // HTTP status code
                console.error('Response headers:', error.response.headers); // Headers info
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (korisnikId, isSusjed) => {
        try {
            await axios.delete(`/delete/user/${korisnikId}/`);
            if (isSusjed) {
                setSusjeds(susjeds.filter((user) => user.korisnik_id !== korisnikId));
            } else {
                setTvrtkas(tvrtkas.filter((user) => user.korisnik_id !== korisnikId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteKomentar = async (komentarId) => {
        try {
            await axios.delete(`/delete/komentar/${komentarId}/`);
            setKomentari(komentari.filter((komentar) => komentar.sifKom !== komentarId));
        } catch (error) {
            console.error('Error deleting komentar:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-prikaz">

            <div className="section">
                <h2>Susjedi</h2>
                <div className="susjed-card-container">
                    {susjeds.map((user) => (
                        <div key={user.korisnik_id} className="susjed-card">
                            <h3>{user.ime} {user.prezime}</h3>
                            <button
                                className="view-map-button"
                                onClick={() => handleDeleteUser(user.korisnik_id, true)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Tvrtke</h2>
                <div className="susjed-card-container">
                    {tvrtkas.map((user) => (
                        <div key={user.korisnik_id} className="susjed-card">
                            <h3>{user.nazivTvrtka}</h3>
                            <p>{user.opisTvrtka}</p>
                            <button
                                className="view-map-button"
                                onClick={() => handleDeleteUser(user.korisnik_id, false)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Komentari</h2>
                <div className="susjed-card-container">
                    {komentari.map((komentar) => (
                        <div key={komentar.id} className="susjed-card">
                            <p>{komentar.textKom}</p>
                            <small><em>{komentar.sifDaje.email}</em></small>
                            <button
                                className="view-map-button"
                                onClick={() => handleDeleteKomentar(komentar.sifKom)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPrikaz;


