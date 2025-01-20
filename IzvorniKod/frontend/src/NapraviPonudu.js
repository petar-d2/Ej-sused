import React, { useState, useContext } from 'react';
import axios from 'axios';
import './styles/kreirajPonudu.css'; // Stilovi, ako ih koristiš
import { GlobalContext } from './GlobalContext'; // Ispravi ime fajla ako je drugačije

const NapraviPonudu = () => {
  const userData = JSON.parse(localStorage.getItem('user')); // Uzmi podatke o korisniku
  //const adresaTvrtka = userData?.adresaTvrtka || '';
  const { skills } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    kadZadano: Date.now(),
    sifTvrtka: userData.id,
    nazivPonuda: '',
    //adresaPonuda: adresaTvrtka,
    opisPonuda: '',
    cijenaNovac: 0,
    isAktivna: true,
    sifVrsta: ''
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

    if (!formData.nazivPonuda || !formData.cijenaNovac || !formData.sifVrsta) {
      setErrorMessage('Sva polja osim opisa su obavezna.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        window.location.href.replace(window.location.pathname, '/') + 'napravi-ponudu/',
        formData
      );
      setSuccessMessage('Ponuda uspješno kreirana!');
      setErrorMessage('');
      setFormData({
        kadZadano: Date.now(),
        sifTvrtka: userData.id,
        nazivPonuda: '',
        //adresaPonuda: adresaTvrtka,
        opisPonuda: '',
        cijenaNovac: 0,
        isAktivna: true,
        sifVrsta: ''
        });
    } catch (error) {
      console.error(error);
      setErrorMessage('Greška prilikom kreiranja ponude.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="napravi-ponudu-container">
      <h1>Napravi Ponudu</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="ponuda-form">
        <div className="form-group">
          <label htmlFor="nazivPonuda">Naziv ponude:</label>
          <input
            type="text"
            id="nazivPonuda"
            name="nazivPonuda"
            value={formData.nazivPonuda}
            onChange={handleChange}
            required
            className="ponuda_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cijena">Cijena (euri):</label>
          <input
            type="number"
            id="cijenaNovac"
            name="cijenaNovac"
            value={formData.cijenaNovac}
            onChange={handleChange}
            required
            className="ponuda_input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="opisPonuda">Opis:</label>
          <textarea
            id="opisPonuda"
            name="opisPonuda"
            value={formData.opisPonuda}
            onChange={handleChange}
            className="ponuda_textarea"
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
            className="ponuda_select"
          >
            <option value="" disabled>Izaberi vrstu usluge</option>
            {skills.map((skill, index) => (
              <option key={index} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary2">Kreiraj Ponudu</button>
      </form>
    </div>
  );
};

export default NapraviPonudu;
