import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Visites.css';

interface Prisonnier {
  numeroIdentification: number;
  nom: string;
  prenom: string;
}

interface Visite {
  id: number;
  prisonnier: Prisonnier;
  nomVisiteur: string;
  date: string;
  heure: string;
  duree: string;
  statut: string;
  nomMembreFamille?: string;
}

interface VisiteForm {
  prisonnierId: string;
  nomVisiteur: string;
  date: string;
  heure: string;
  duree: string;
}

export default function Visites() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  
  const [visites, setVisites] = useState<Visite[]>([]);
  const [prisonniers, setPrisonniers] = useState<Prisonnier[]>([]);
  const [form, setForm] = useState<VisiteForm>({
    prisonnierId: '',
    nomVisiteur: '',
    date: '',
    heure: '',
    duree: '',
  });
  
  const [vue, setVue] = useState<'liste' | 'attente' | 'creer' | 'modifier'>('liste');
  const [visiteIdSelectionnee, setVisiteIdSelectionnee] = useState<number | null>(null);
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
    chargerVisites();
    chargerPrisonniers();
  }, []);

  async function chargerVisites() {
    try {
      const res = await fetch('http://localhost:3000/visites', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setVisites(data);
      } else {
        setErreur('Erreur lors du chargement des visites');
      }
    } catch (e: any) {
      setErreur('Erreur lors du chargement des visites');
    }
  }

  async function chargerPrisonniers() {
    try {
      const res = await fetch('http://localhost:3000/prisonniers', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPrisonniers(data);
      }
    } catch (e: any) {
      // On ignore l'erreur
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const newForm = { ...form };
    const name = e.target.name;
    const value = e.target.value;
    
    if (name === 'prisonnierId') {
      newForm.prisonnierId = value;
    } else if (name === 'nomVisiteur') {
      newForm.nomVisiteur = value;
    } else if (name === 'date') {
      newForm.date = value;
    } else if (name === 'heure') {
      newForm.heure = value;
    } else if (name === 'duree') {
      newForm.duree = value;
    }
    
    setForm(newForm);
  }

  async function creerOuModifierVisite() {
    if (form.prisonnierId === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.nomVisiteur === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.date === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.heure === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    if (form.duree === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      let url = 'http://localhost:3000/visites';
      let method = 'POST';

      if (vue === 'modifier') {
        if (visiteIdSelectionnee !== null) {
          url = 'http://localhost:3000/visites/' + visiteIdSelectionnee;
          method = 'PATCH';
        }
      }

      const bodyData = {
        prisonnierId: Number(form.prisonnierId),
        nomVisiteur: form.nomVisiteur,
        date: form.date,
        heure: form.heure,
        duree: form.duree,
      };

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        if (vue === 'modifier') {
          setMessage('Visite modifiée avec succès');
        } else {
          setMessage('Demande de visite envoyée au directeur');
        }
        
        setTimeout(() => {
          setMessage('');
        }, 3000);

        setErreur('');
        setForm({ prisonnierId: '', nomVisiteur: '', date: '', heure: '', duree: '' });
        
        if (vue === 'modifier') {
          setVue('liste');
        } else {
          setVue('attente');
        }
        
        setVisiteIdSelectionnee(null);
        chargerVisites();
      } else {
        const data = await res.json();
        if (data.message) {
          setErreur(data.message);
        } else {
          setErreur('Erreur lors de la requête');
        }
      }
    } catch (e: any) {
      setErreur('Erreur lors de la requête');
    }
  }

  async function repondreDemande(id: number, decision: 'approuvee' | 'refusee') {
    try {
      const res = await fetch('http://localhost:3000/visites/' + id + '/repondre', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision: decision }),
      });
      
      if (res.ok) {
        if (decision === 'approuvee') {
          setMessage('Demande approuvée');
        } else {
          setMessage('Demande refusée');
        }
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
        
        chargerVisites();
      } else {
        setErreur('Erreur lors de la réponse');
      }
    } catch (e: any) {
      setErreur('Erreur lors de la réponse');
    }
  }

  async function supprimerVisite(id: number) {
    const isConfirmed = confirm('Confirmer la suppression de cette visite ?');
    if (isConfirmed === false) {
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/visites/' + id, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (res.ok) {
        setMessage('');
        chargerVisites();
      } else {
        setErreur('Erreur lors de la suppression');
      }
    } catch (e: any) {
      setErreur('Erreur lors de la suppression');
    }
  }

  function ouvrirModifier(visite: Visite) {
    setVisiteIdSelectionnee(visite.id);
    
    let nomVisiteur = '';
    if (visite.nomVisiteur) {
      nomVisiteur = visite.nomVisiteur;
    }
    
    let date = '';
    if (visite.date) {
      date = visite.date;
    }
    
    let heure = '';
    if (visite.heure) {
      heure = visite.heure;
    }
    
    let duree = '';
    if (visite.duree) {
      duree = visite.duree;
    }

    setForm({
      prisonnierId: visite.prisonnier.numeroIdentification.toString(),
      nomVisiteur: nomVisiteur,
      date: date,
      heure: heure,
      duree: duree,
    });
    setVue('modifier');
    setErreur('');
    setMessage('');
  }

  function allerAuxIncidents() {
    navigate('/incidents');
  }

  function allerAuxPrisonniers() {
    navigate('/prisonniers');
  }

  function allerAuxCellules() {
    navigate('/cellules');
  }

  function allerAuxVisites() {
    navigate('/visites');
  }

  function allerAuxComptes() {
    navigate('/comptes');
  }

  function deconnexion() {
    navigate('/');
  }

  function changerVueListe() {
    setVue('liste');
    setVisiteIdSelectionnee(null);
    setForm({ prisonnierId: '', nomVisiteur: '', date: '', heure: '', duree: '' });
  }

  function changerVueAttente() {
    setVue('attente');
    setVisiteIdSelectionnee(null);
    setForm({ prisonnierId: '', nomVisiteur: '', date: '', heure: '', duree: '' });
  }

  function changerVueCreer() {
    setVue('creer');
    setVisiteIdSelectionnee(null);
    setForm({ prisonnierId: '', nomVisiteur: '', date: '', heure: '', duree: '' });
  }

  let roleTexte = 'Directeur';
  if (isGarde) {
    roleTexte = 'Garde';
  }

  let userName = '';
  if (user !== null && user.name) {
    userName = user.name;
  }

  let classVueListe = 'tab-btn';
  if (vue === 'liste') {
    classVueListe = 'tab-btn active';
  }

  let classVueAttente = 'tab-btn';
  if (vue === 'attente') {
    classVueAttente = 'tab-btn active';
  }

  let classVueCreer = 'tab-btn';
  if (vue === 'creer' || vue === 'modifier') {
    classVueCreer = 'tab-btn active';
  }

  const visitesApprouvees: Visite[] = [];
  const visitesEnAttente: Visite[] = [];

  const safeVisites = Array.isArray(visites) ? visites : [];

  for (let i = 0; i < safeVisites.length; i++) {
    const v = safeVisites[i];
    if (v.statut === 'approuvee' || v.statut === 'planifiee') {
      visitesApprouvees.push(v);
    } else if (v.statut === 'en_attente') {
      visitesEnAttente.push(v);
    }
  }

  let boutonNouvelleDemandeTexte = '+ Nouvelle Demande';
  let boutonEnregistrerTexte = 'Envoyer la demande';
  if (vue === 'modifier') {
    boutonEnregistrerTexte = 'Enregistrer les modifications';
  }

  let labelAttente = 'En attente';
  if (visitesEnAttente.length > 0) {
    labelAttente = 'En attente (' + visitesEnAttente.length + ')';
  }

  let contenuPrincipal: any = null;

  if (vue === 'liste') {
    const lignesTableau: any[] = [];
    
    if (isDirecteur) {
      if (safeVisites.length === 0) {
        lignesTableau.push(
          <tr key="vide"><td colSpan={7} style={{ textAlign: 'center', color: '#888780' }}>Aucune visite</td></tr>
        );
      } else {
        for (let i = 0; i < safeVisites.length; i++) {
          const v = safeVisites[i];
          let nomPrisonnier = 'Inconnu';
          if (v.prisonnier !== null && v.prisonnier !== undefined) {
            nomPrisonnier = v.prisonnier.nom + ' ' + v.prisonnier.prenom;
          }
          
          let visiteur = '';
          if (v.nomVisiteur) {
            visiteur = v.nomVisiteur;
          } else if (v.nomMembreFamille) {
            visiteur = v.nomMembreFamille;
          }
          
          let statutLabel = 'Approuvée';
          if (v.statut === 'en_attente') {
            statutLabel = 'En attente';
          } else if (v.statut === 'refusee') {
            statutLabel = 'Refusée';
          }

          let classNameTag = 'tag';
          if (v.statut === 'en_attente') {
            classNameTag = 'tag warning';
          }

          let actionsCell = null;
          if (v.statut === 'en_attente') {
            actionsCell = (
              <>
                <button className="action-btn edit" onClick={function() { repondreDemande(v.id, 'approuvee'); }}>Approuver</button>
                <button className="action-btn delete" onClick={function() { repondreDemande(v.id, 'refusee'); }}>Refuser</button>
              </>
            );
          } else {
            actionsCell = (
              <button className="action-btn delete" onClick={function() { supprimerVisite(v.id); }}>Supprimer</button>
            );
          }

          lignesTableau.push(
            <tr key={v.id}>
              <td>{nomPrisonnier}</td>
              <td>{visiteur}</td>
              <td>{v.date}</td>
              <td>{v.heure}</td>
              <td>{v.duree}</td>
              <td>
                <span className={classNameTag}>{statutLabel}</span>
              </td>
              <td>{actionsCell}</td>
            </tr>
          );
        }
      }

      contenuPrincipal = (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prisonnier</th>
                <th>Nom du visiteur</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lignesTableau}
            </tbody>
          </table>
        </div>
      );
    } else {
      if (visitesApprouvees.length === 0) {
        lignesTableau.push(
          <tr key="vide"><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucune visite approuvée</td></tr>
        );
      } else {
        for (let i = 0; i < visitesApprouvees.length; i++) {
          const v = visitesApprouvees[i];
          let nomPrisonnier = 'Inconnu';
          if (v.prisonnier !== null && v.prisonnier !== undefined) {
            nomPrisonnier = v.prisonnier.nom + ' ' + v.prisonnier.prenom;
          }
          
          lignesTableau.push(
            <tr key={v.id}>
              <td>{nomPrisonnier}</td>
              <td>{v.nomVisiteur}</td>
              <td>{v.date}</td>
              <td>{v.heure}</td>
              <td>{v.duree}</td>
              <td>
                <button className="action-btn edit" onClick={function() { ouvrirModifier(v); }}>Modifier</button>
                <button className="action-btn delete" onClick={function() { supprimerVisite(v.id); }}>Supprimer</button>
              </td>
            </tr>
          );
        }
      }

      contenuPrincipal = (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prisonnier</th>
                <th>Nom du visiteur</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lignesTableau}
            </tbody>
          </table>
        </div>
      );
    }
  } else if (vue === 'attente' && !isDirecteur) {
    const lignesTableau: any[] = [];
    
    if (visitesEnAttente.length === 0) {
      lignesTableau.push(
        <tr key="vide"><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucune demande en attente</td></tr>
      );
    } else {
      for (let i = 0; i < visitesEnAttente.length; i++) {
        const v = visitesEnAttente[i];
        let nomPrisonnier = 'Inconnu';
        if (v.prisonnier !== null && v.prisonnier !== undefined) {
          nomPrisonnier = v.prisonnier.nom + ' ' + v.prisonnier.prenom;
        }
        
        let visiteur = '';
        if (v.nomVisiteur) {
          visiteur = v.nomVisiteur;
        } else if (v.nomMembreFamille) {
          visiteur = v.nomMembreFamille;
        }

        lignesTableau.push(
          <tr key={v.id}>
            <td>{nomPrisonnier}</td>
            <td>{visiteur}</td>
            <td>{v.date}</td>
            <td>{v.heure}</td>
            <td>{v.duree}</td>
            <td>
              <span style={{ color: '#888780', fontStyle: 'italic', fontSize: '13px' }}>En attente du directeur</span>
            </td>
          </tr>
        );
      }
    }

    contenuPrincipal = (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prisonnier</th>
              <th>Nom du visiteur</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Durée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lignesTableau}
          </tbody>
        </table>
      </div>
    );
  } else if (vue === 'creer' || vue === 'modifier') {
    const optionsPrisonniers: any[] = [];
    
    const pArray = Array.isArray(prisonniers) ? prisonniers : [];
    for (let i = 0; i < pArray.length; i++) {
      const p = pArray[i];
      optionsPrisonniers.push(
        <option key={p.numeroIdentification} value={p.numeroIdentification}>
          {p.nom} {p.prenom}
        </option>
      );
    }

    contenuPrincipal = (
      <div className="form-card">
        <div className="field-group">
          <label>Prisonnier</label>
          <select name="prisonnierId" value={form.prisonnierId} onChange={handleChange}>
            <option value="">-- Choisir un prisonnier --</option>
            {optionsPrisonniers}
          </select>
        </div>
        <div className="field-group">
          <label>Nom du visiteur</label>
          <input name="nomVisiteur" type="text" placeholder="Ex: Jean Dupont" value={form.nomVisiteur} onChange={handleChange} />
        </div>
        <div className="row">
          <div className="field-group">
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Heure</label>
            <input name="heure" type="time" value={form.heure} onChange={handleChange} />
          </div>
        </div>
        <div className="field-group">
          <label>Durée</label>
          <input name="duree" type="text" placeholder="Ex: 60 min" value={form.duree} onChange={handleChange} />
        </div>
        <button className="btn" onClick={creerOuModifierVisite}>
          {boutonEnregistrerTexte}
        </button>
      </div>
    );
  }

  let actionsHeader = null;
  if (isDirecteur === false) {
    actionsHeader = (
      <>
        <button className={classVueListe} onClick={changerVueListe}>
          Approuvées
        </button>
        <button className={classVueAttente} onClick={changerVueAttente}>
          {labelAttente}
        </button>
        <button className={classVueCreer} onClick={changerVueCreer}>
          {boutonNouvelleDemandeTexte}
        </button>
      </>
    );
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
          <button onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button className="active" onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Visites</h1>
          <div className="header-actions">
            {actionsHeader}
          </div>
        </div>

        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        {contenuPrincipal}
      </div>
    </div>
  );
}