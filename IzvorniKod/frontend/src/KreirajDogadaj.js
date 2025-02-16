import React, { useState } from 'react';
import axios from 'axios';
import './styles/kreirajDogadaj.css'; // Stilovi, ako ih koristiš
//promjeniti ID volontera
const KreirajDogadaj = () => {

  const userData = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    kadZadano: Date.now(),
    sifVolonter: userData.id, // ID povezanog komentara
    datumDogadaj: '',
    vrijemeDogadaj: '',
    nazivDogadaj: '',
    adresaDogadaj: '',
    statusDogadaj: 'ODOBRAVANJE',
    vrstaDogadaj: '',
    opisDogadaj: '',
    nagradaBod: 0,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Funkcija za rukovanje promenom u formi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funkcija za slanje podataka na backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Proveravamo da li su obavezna polja popunjena
    if (!formData.datumDogadaj || !formData.vrijemeDogadaj || !formData.nazivDogadaj || !formData.adresaDogadaj || !formData.vrstaDogadaj || !formData.nagradaBod) {
      setErrorMessage('Sva polja osim opisa su obavezna.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/') + 'kreiraj-dogadaj/',
        formData
      );
      setSuccessMessage('Događaj uspješno kreiran!');
      setErrorMessage('');
      setFormData({
        kadZadano: Date.now(),
        sifVolonter: userData.id,
        datumDogadaj: '',
        vrijemeDogadaj: '',
        nazivDogadaj: '',
        adresaDogadaj: '',
        statusDogadaj: 'ODOBRAVANJE',
        vrstaDogadaj: '',
        opisDogadaj: '',
        nagradaBod: 0,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Greška prilikom kreiranja događaja.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="kreiraj-dogadaj-container">
      <h1>Kreiraj Događaj</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="dogadaj-form">
        <div className="form-group">
          <label htmlFor="nazivDogadaj">Naziv Događaja:</label>
          <input
            type="text"
            id="nazivDogadaj"
            name="nazivDogadaj"
            value={formData.nazivDogadaj}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="datumDogadaj">Datum:</label>
          <input
            type="date"
            id="datumDogadaj"
            name="datumDogadaj"
            value={formData.datumDogadaj}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vrijemeDogadaj">Vrijeme:</label>
          <input
            type="time"
            id="vrijemeDogadaj"
            name="vrijemeDogadaj"
            value={formData.vrijemeDogadaj}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="adresaDogadaj">Adresa:</label>
          <input
            type="text"
            id="adresaDogadaj"
            name="adresaDogadaj"
            value={formData.adresaDogadaj}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vrstaDogadaj">Vrsta:</label>
          <input
            type="text"
            id="vrstaDogadaj"
            name="vrstaDogadaj"
            value={formData.vrstaDogadaj}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opisDogadaj">Opis:</label>
          <textarea
            id="opisDogadaj"
            name="opisDogadaj"
            value={formData.opisDogadaj}
            onChange={handleChange}
            className="dogadaj_textarea"
            rows="4"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="nagradaBod">Nagrada (bodovi):</label>
          <input
            type="number"
            id="nagradaBod"
            name="nagradaBod"
            value={formData.nagradaBod}
            onChange={handleChange}
            required
            className="dogadaj_input"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Kreiraj Događaj</button>
      </form>
    </div>
  );
};

export default KreirajDogadaj;
