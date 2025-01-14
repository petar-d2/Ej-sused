import React, { useState, useContext } from 'react';
import axios from 'axios';
import './styles/kreirajZahtjev.css'; // Stilovi, ako ih koristiš
import { GlobalContext } from './GlobalContext'; // Ispravi ime fajla ako je drugačije

const NapraviZahtjev = () => {
  const userData = JSON.parse(localStorage.getItem('user')); // Uzmi podatke o korisniku
  const { skills } = useContext(GlobalContext); // Preuzmi skillove iz konteksta

  const [formData, setFormData] = useState({
    kadZadan: Date.now(),
    sifSusjed: userData.id,
    nazivZahtjev: '',
    adresaZahtjev: '',
    statusZahtjev: 'ČEKANJE',
    opisZahtjev: '',
    cijenaBod: 0,
    sifVrsta: '', // ID vrste usluge (izabran skill)
    sifIzvrsitelj: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nazivZahtjev || !formData.adresaZahtjev || !formData.cijenaBod || !formData.sifVrsta) {
      setErrorMessage('Sva polja osim opisa su obavezna.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/') + 'napravi-zahtjev/',
        formData
      );
      setSuccessMessage('Zahtjev uspešno kreiran!');
      setErrorMessage('');
      setFormData({
        kadZadan: Date.now(),
        sifSusjed: userData.id,
        nazivZahtjev: '',
        adresaZahtjev: '',
        statusZahtjev: 'ČEKANJE',
        opisZahtjev: '',
        cijenaBod: 0,
        sifVrsta: '',
        sifIzvrsitelj: '',
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Greška prilikom kreiranja zahtjeva.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="napravi-zahtjev-container">
      <h1>Napravi Zahtjev</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="zahtjev-form">
        <div className="form-group">
          <label htmlFor="nazivZahtjev">Naziv Zahtjeva:</label>
          <input
            type="text"
            id="nazivZahtjev"
            name="nazivZahtjev"
            value={formData.nazivZahtjev}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="adresaZahtjev">Adresa:</label>
          <input
            type="text"
            id="adresaZahtjev"
            name="adresaZahtjev"
            value={formData.adresaZahtjev}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cijenaBod">Cijena (bodovi):</label>
          <input
            type="number"
            id="cijenaBod"
            name="cijenaBod"
            value={formData.cijenaBod}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opisZahtjev">Opis:</label>
          <textarea
            id="opisZahtjev"
            name="opisZahtjev"
            value={formData.opisZahtjev}
            onChange={handleChange}
            className="form-control"
            rows="4"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="sifVrsta">Vrsta Usluge:</label>
          <select
            id="sifVrsta"
            name="sifVrsta"
            value={formData.sifVrsta}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="" disabled>Izaberi vrstu usluge</option>
            {skills.map((skill, index) => (
              <option key={index} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Kreiraj Zahtjev</button>
      </form>
    </div>
  );
};

export default NapraviZahtjev;
