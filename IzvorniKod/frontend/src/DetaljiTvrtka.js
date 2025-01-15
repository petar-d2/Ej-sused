import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/detalji_tvrtka.css';

const DetaljiTvrtka = () => {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [tvrtka, setTvrtka] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [komentar, setKomentar] = useState('');
    const [komentari, setKomentari] = useState([]);

    useEffect(() => {
        const fetchTvrtkaDetails = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `tvrtka/${id}/`;
                const response = await axios.post(apiUrl); 
                setTvrtka(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tvrtka details:', error);
                setLoading(false);
            }
        };

        const fetchKomentari = async () => {
            try {
                const apiUrl = window.location.href.replace(window.location.pathname, '/') + `pokazi-komentare/${id}/`;
                const response = await axios.get(apiUrl);
                setKomentari(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchTvrtkaDetails();
        fetchKomentari();
    }, [id]);

    const handleViewOnMapsClick = () => {
        const location = `${tvrtka.adresaTvrtka}`;
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
        window.open(mapsUrl, '_blank');
    };

    const renderStars = (selectedRating = 0, interactive = false, isSecondRow = false) => {
        const totalStars = 5;
        return (
            <div className={`star-rating ${isSecondRow ? 'second-row' : ''}`}>
                {[...Array(totalStars)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <span
                            key={index}
                            className={starValue <= selectedRating ? 'filled' : ''}
                            onClick={() => isSecondRow && interactive && setRating(starValue)}
                        >
                            {starValue <= selectedRating ? '★' : '☆'}
                        </span>
                    );
                })}
            </div>
        );
    };

    // zvjezdice na temelju ocjene
    const renderStars2 = (ocjena) => {
        const totalStars = 5;
        const fullStars = Math.floor(ocjena); // cijele zvjezdice
        const halfStar = ocjena % 1 >= 0.5; // pola zvjezdice ako je ima
        const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {halfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };
    

    const handleSubmitRating = async() => {
        try {
            tvrtka.brojOcjena = tvrtka.brojOcjena + 1;
            tvrtka.zbrojOcjena = tvrtka.zbrojOcjena + rating;
            const apiUrl = window.location.href.replace(window.location.pathname, '/') + `ocjena-edit/`;
            const response = await axios.post(apiUrl, tvrtka);
            console.log('Rating submitted:', rating);
            console.log(tvrtka);
            setRating(0);
        } catch (error) {
            console.error('Error submitting rating:', error);
            setRating(0);
        }
    };

    const handleSubmitComment = async() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        try {
            const newComment = {
                textKom : komentar,
                sifDaje : userData.id,
                sifPrima : id
            }
            const apiUrl = window.location.href.replace(window.location.pathname, '/') + `unesi-komentar/`;
            const response = await axios.post(apiUrl, newComment);
            console.log('Comment submitted:', komentar);
            setKomentar('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            setKomentar('');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!tvrtka) {
        return (
            <div className="error-message">
                <h3>Tvrtka nije nađena</h3>
                <p>Nismo uspjeli pronaći tu tvrtku! Molimo pokušajte opet!</p>
                <button onClick={() => navigate(-1)}>Povratak</button> 
            </div>
        );
    }

    return (
        <div className="tvrtka-details-container">
            <h2>Detalji tvrtke</h2>
            <p><strong>Naziv:</strong> {tvrtka.nazivTvrtka}</p>
            <p><strong>Kontakt:</strong> {tvrtka.email}</p>
            <p><strong>Adresa:</strong> {tvrtka.adresaTvrtka}</p>
            <p><strong>Kvart:</strong> {tvrtka.kvartTvrtka}</p>
            <p><strong>Opis:</strong> {tvrtka.opisTvrtka || 'N/A'}</p>
            <button className="view-map-button" onClick={(e) => {e.stopPropagation(); handleViewOnMapsClick();}}>
                Pogledaj lokaciju na karti
            </button>
            <p className="ocjena">
                <strong>Ocjena:</strong>
                <span className="star-rating">{renderStars2(tvrtka.brojOcjena!=0 ? tvrtka.zbrojOcjena/tvrtka.brojOcjena : 0.0)}</span>
                ({tvrtka.brojOcjena!=0 ? Math.round(tvrtka.zbrojOcjena/tvrtka.brojOcjena,2) : 0.0})
            </p>

            <p className='ocjena'>
                <strong>Ocijeni:</strong>
                <div className="star-rate">
                    {renderStars(rating, true, true)} {/* Second row with interactivity */}
            </div>
            </p>

            <button onClick={handleSubmitRating}>Pošalji ocjenu</button>
            
            <textarea
                className='textarea2'
                value={komentar} 
                onChange={(e) => setKomentar(e.target.value)} 
                placeholder="Dodaj komentar..."
                rows="5"
                cols="50"
            />
            
            <button onClick={handleSubmitComment}>Pošaljite komentar</button>
            
            <h3>Komentari:</h3>
            <div className="komentari-container">
                {komentari.length > 0 ? (
                    komentari.map((komentar) => (
                        <div key={komentar.sifKom} className="komentar">
                            <p>&emsp;{komentar.textKom}</p>

                        </div>
                    ))
                ) : (
                    <p>&emsp;Nema dostupnih komentara.</p>
                )}
            </div>

            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
};

export default DetaljiTvrtka;
