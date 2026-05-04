import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Incidents.css';

interface Incident {
  id: number;
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniers: any[];
}

interface IncidentForm {
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniersIds: string;
}

export default function Incidents() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [form, setForm] = useState<IncidentForm>({ 
    type: '', 
    description: '', 
    dateHeure: '', 
    rapportePar: '',
    prisonniersIds: '',
  });
  const [vue, setVue] = useState<'liste' | 'creer'>('liste');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  let isGarde = false;
  if (user !== null && user.profile === 1) {
    isGarde = true;
  }

  let isDirecteur = false;
  if (user !== null && user.profile === 2) {
    isDirecteur = true;
  }

  useEffect(() => {
    chargerIncidents();
  }, []);

  async function chargerIncidents() {
    try {
      const res = await axios.get('http://localhost:3000/incidents');
      setIncidents(res.data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des incidents');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const newForm = { ...form };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'type') {
      newForm.type = value;
    } else if (name === 'description') {
      newForm.description = value;
    } else if (name === 'dateHeure') {
      newForm.dateHeure = value;
    } else if (name === 'rapportePar') {
      newForm.rapportePar = value;
    } else if (name === 'prisonniersIds') {
      newForm.prisonniersIds = value;
    }
    
    setForm(newForm);
  }

  async function creerIncident() {
    if (form.type === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.description === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.dateHeure === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.rapportePar === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.prisonniersIds === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      const idsTab = form.prisonniersIds.split(',');
      const numericIds = [];
      for (let i = 0; i < idsTab.length; i++) {
        const strId = idsTab[i].trim();
        numericIds.push(Number(strId));
      }

      await axios.post('http://localhost:3000/incidents', {
        type: form.type,
        description: form.description,
        dateHeure: form.dateHeure,
        rapportePar: form.rapportePar,
        prisonniersIds: numericIds,
      });

      setMessage('Incident créé avec succès');
      setErreur('');
      setForm({ type: '', description: '', dateHeure: '', rapportePar: '', prisonniersIds: '' });
      setVue('liste');
      chargerIncidents();
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur('Erreur lors de la création');
      }
    }
  }

  async function supprimerIncident(id: number) {
    const isConfirmed = confirm('Confirmer la suppression ?');
    if (isConfirmed === false) {
      return;
    }
    
    try {
      await axios.delete('http://localhost:3000/incidents/' + id);
      chargerIncidents();
    } catch (e: any) {
      setErreur('Erreur lors de la suppression');
    }
  }

  function allerAuxIncidents() { navigate('/incidents'); }
  function allerAuxPrisonniers() { navigate('/prisonniers'); }
  function allerAuxCellules() { navigate('/cellules'); }
  function allerAuxVisites() { navigate('/visites'); }
  function allerAuxComptes() { navigate('/comptes'); }
  function deconnexion() { navigate('/'); }
  
  function changerVueListe() { setVue('liste'); }
  function changerVueCreer() { setVue('creer'); }
  
  function modifierIncident(id: number) {
    navigate('/incidents/' + id + '/modifier');
  }

  let userName = '';
  if (user !== null && user.name) {
    userName = user.name;
  }

  let roleTexte = 'Directeur';
  if (isGarde) {
    roleTexte = 'Garde';
  }

  let classVueListe = 'tab-btn';
  if (vue === 'liste') {
    classVueListe = 'tab-btn active';
  }

  let classVueCreer = 'tab-btn';
  if (vue === 'creer') {
    classVueCreer = 'tab-btn active';
  }

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>
        <div className="dash-user">
          <p className="dash-user-name">{userName}</p>
          <p className="dash-user-role">{roleTexte}</p>
        </div>
        <nav className="dash-nav">
          <button className="active" onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Incidents</h1>
          <div className="header-actions">
            <button className={classVueListe} onClick={changerVueListe}>
              Liste
            </button>
            {isGarde && (
              <button className={classVueCreer} onClick={changerVueCreer}>
                + Créer
              </button>
            )}
          </div>
        </div>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        {vue === 'liste' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date / Heure</th>
                  <th>Rapporté par</th>
                  {isDirecteur && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucun incident</td></tr>
                )}
                {incidents.map(function(inc) {
                  return (
                    <tr key={inc.id}>
                      <td>{inc.id}</td>
                      <td><span className="tag">{inc.type}</span></td>
                      <td>{inc.description}</td>
                      <td>{inc.dateHeure}</td>
                      <td>{inc.rapportePar}</td>
                      {isDirecteur && (
                        <td>
                          <button className="action-btn edit" onClick={function() { modifierIncident(inc.id); }}>
                            Modifier
                          </button>
                          <button className="action-btn delete" onClick={function() { supprimerIncident(inc.id); }}>
                            Supprimer
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {vue === 'creer' && isGarde && (
          <div className="form-card">
            <div className="field-group">
              <label>Type d'incident</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value="Bagarre">Bagarre</option>
                <option value="Évasion">Évasion</option>
                <option value="Contrebande">Contrabande</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="field-group">
              <label>Description</label>
              <textarea name="description" placeholder="Décrivez l'incident..." value={form.description} onChange={handleChange} rows={4} />
            </div>
            <div className="row">
              <div className="field-group">
                <label>Date et heure</label>
                <input name="dateHeure" type="datetime-local" value={form.dateHeure} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label>Rapporté par</label>
                <input name="rapportePar" type="text" placeholder="Nom du garde..." value={form.rapportePar} onChange={handleChange} />
              </div>
            </div>
            <div className="field-group">
              <label>IDs des prisonniers impliqués</label>
              <input name="prisonniersIds" type="text" placeholder="ex: 1, 2, 3" value={form.prisonniersIds} onChange={handleChange} />
            </div>
            <button className="btn" onClick={creerIncident}>Créer l'incident</button>
          </div>
        )}
      </div>
    </div>
  );
}