import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/adminpanel.css';

const AdminPrikaz = () => {
    const [susjeds, setSusjeds] = useState([]);
    const [tvrtkas, setTvrtkas] = useState([]);
    const [komentari, setKomentari] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('susjedi');  // State to track the selected section
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.isNadlezna) {
            navigate('/unauthorized');
        }
    }, [navigate]);

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

    const handleSectionChange = (section) => {
        setSelectedSection(section);
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
            <div className="section-selector">
                <button className="view-map-button" onClick={() => handleSectionChange('susjedi')}>Susjedi</button>
                <button className="view-map-button" onClick={() => handleSectionChange('tvrtke')}>Tvrtke</button>
                <button className="view-map-button" onClick={() => handleSectionChange('komentari')}>Komentari</button>
            </div>

            
                {selectedSection === 'susjedi' && (
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
                )}

                {selectedSection === 'tvrtke' && (
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
                )}

                {selectedSection === 'komentari' && (
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
                )}
            
        </div>
    );
};

export default AdminPrikaz;
