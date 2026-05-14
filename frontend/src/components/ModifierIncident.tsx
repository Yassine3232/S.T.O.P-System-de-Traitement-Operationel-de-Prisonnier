import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getIncident, updateIncident } from '../api/incidents.service';
import './Incidents.css';

interface IncidentForm {
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniersIds: string;
}

export default function ModifierIncident() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<IncidentForm>({
    type: '',
    description: '',
    dateHeure: '',
    rapportePar: '',
    prisonniersIds: '',
  });
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  let isDirecteur = false;
  if (user !== null && user.profile === 2) {
    isDirecteur = true;
  }

  // Redirect non-directors away
  useEffect(() => {
    if (user !== null && !isDirecteur) {
      navigate('/incidents');
    }
  }, [user]);

  useEffect(() => {
    if (!id) return;
    chargerIncident(Number(id));
  }, [id]);

  async function chargerIncident(incidentId: number) {
    try {
      const data = await getIncident(incidentId);
      const idsStr = data.prisonniers
        .map((p: any) => p.numeroIdentification)
        .join(', ');

      // Format dateHeure for datetime-local input (strip seconds/ms if needed)
      let dateHeure = data.dateHeure || '';
      if (dateHeure.length > 16) {
        dateHeure = dateHeure.substring(0, 16);
      }

      setForm({
        type: data.type,
        description: data.description,
        dateHeure: dateHeure,
        rapportePar: data.rapportePar,
        prisonniersIds: idsStr,
      });
    } catch (e: any) {
      setErreur('Impossible de charger l\'incident');
    } finally {
      setChargement(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function sauvegarder() {
    if (!form.type || !form.description || !form.dateHeure || !form.rapportePar) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      const idsTab = form.prisonniersIds.split(',');
      const numericIds: number[] = [];
      for (let i = 0; i < idsTab.length; i++) {
        const strId = idsTab[i].trim();
        if (strId !== '') numericIds.push(Number(strId));
      }

      await updateIncident(Number(id), {
        type: form.type,
        description: form.description,
        dateHeure: form.dateHeure,
        rapportePar: form.rapportePar,
        prisonniersIds: numericIds.length > 0 ? numericIds : undefined,
      });

      setMessage('Incident modifié avec succès');
      setErreur('');
      setTimeout(() => navigate('/incidents'), 1200);
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur('Erreur lors de la modification');
      }
    }
  }

  function allerAuxIncidents() { navigate('/incidents'); }
  function allerAuxPrisonniers() { navigate('/prisonniers'); }
  function allerAuxCellules() { navigate('/cellules'); }
  function allerAuxVisites() { navigate('/visites'); }
  function allerAuxComptes() { navigate('/comptes'); }
  function deconnexion() { navigate('/'); }

  let userName = '';
  if (user !== null && user.name) {
    userName = user.name;
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
          <p className="dash-user-role">Directeur</p>
        </div>
        <nav className="dash-nav">
          <button className="active" onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          <button onClick={allerAuxComptes}>Comptes</button>
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Modifier l'incident #{id}</h1>
          <div className="header-actions">
            <button className="tab-btn" onClick={allerAuxIncidents}>
              ← Retour
            </button>
          </div>
        </div>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        {chargement ? (
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#888780' }}>
            Chargement...
          </p>
        ) : (
          <div className="form-card">
            <div className="field-group">
              <label>Type d'incident</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value="Bagarre">Bagarre</option>
                <option value="Évasion">Évasion</option>
                <option value="Contrebande">Contrebande</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="field-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Décrivez l'incident..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="row">
              <div className="field-group">
                <label>Date et heure</label>
                <input
                  name="dateHeure"
                  type="datetime-local"
                  value={form.dateHeure}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label>Rapporté par</label>
                <input
                  name="rapportePar"
                  type="text"
                  placeholder="Nom du garde..."
                  value={form.rapportePar}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field-group">
              <label>IDs des prisonniers impliqués</label>
              <input
                name="prisonniersIds"
                type="text"
                placeholder="ex: 1, 2, 3"
                value={form.prisonniersIds}
                onChange={handleChange}
              />
            </div>
            <button className="btn" onClick={sauvegarder}>
              Sauvegarder les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}