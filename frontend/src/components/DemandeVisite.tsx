import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function DemandeVisite() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prisonnierId: '',
    nomMembreFamille: '',
    lienFamilial: '',
  });
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'prisonnierId') {
      newForm.prisonnierId = value;
    } else if (name === 'nomMembreFamille') {
      newForm.nomMembreFamille = value;
    } else if (name === 'lienFamilial') {
      newForm.lienFamilial = value;
    }
    
    setForm(newForm);
  }

  async function envoyerDemande() {
    if (form.prisonnierId === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.nomMembreFamille === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.lienFamilial === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      await axios.post('http://localhost:3000/visites/demande', {
        prisonnierId: Number(form.prisonnierId),
        nomMembreFamille: form.nomMembreFamille,
        lienFamilial: form.lienFamilial,
      });
      setMessage('Demande envoyée avec succès. Vous serez contacté pour confirmation.');
      setErreur('');
      setForm({ prisonnierId: '', nomMembreFamille: '', lienFamilial: '' });
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        let msg = e.response.data.message;
        if (Array.isArray(msg)) {
          msg = msg[0];
        }
        setErreur(msg);
      } else {
        setErreur('Erreur lors de l\'envoi de la demande');
      }
    }
  }

  const barresArray = [];
  for (let i = 0; i < 8; i++) {
    barresArray.push(i);
  }

  let dateTexte = new Date().toLocaleDateString('fr-CA');

  function retourAccueil() {
    navigate('/');
  }

  return (
    <div className="prison-wrap">
      <div className="bars">
        {barresArray.map(function(i) {
          return <div className="bar" key={i} />;
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="badge">ÉTABLISSEMENT PÉNITENTIAIRE</div>
          <h1>Demande<br />de Visite</h1>
        </div>

        <div className="field-group">
          <label>Numéro d'identification du prisonnier</label>
          <input
            name="prisonnierId"
            type="number"
            placeholder="ex: 1042"
            value={form.prisonnierId}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Votre nom complet</label>
          <input
            name="nomMembreFamille"
            type="text"
            placeholder="ex: Marie Dupont"
            value={form.nomMembreFamille}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Lien familial</label>
          <input
            name="lienFamilial"
            type="text"
            placeholder="ex: Mère, Frère, Conjoint..."
            value={form.lienFamilial}
            onChange={handleChange}
          />
        </div>

        <button className="btn" onClick={envoyerDemande}>Soumettre la demande</button>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="card-footer">
          <button
            onClick={retourAccueil}
            style={{ background: 'none', border: 'none', color: '#888780', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
          >
            Retour à l'accueil
          </button>
          <span>{dateTexte}</span>
        </div>
      </div>
    </div>
  );
}