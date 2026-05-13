import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPrisonniers, createPrisonnier, updatePrisonnier, getHistorique } from '../api/prisonniers.service';
import apiClient from '../api/apiClient';
import './Incidents.css';

interface Prisonnier {
  numeroIdentification: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  accusation: string;
  dureePeine: number;
  dateArrivee: string;
  dateSortiePrevue: string;
  photoProfil?: string;
  cellule?: { nom: string };
}

interface PrisonnierForm {
  nom: string;
  prenom: string;
  dateNaissance: string;
  accusation: string;
  dureePeine: string;
  dateArrivee: string;
  dateSortiePrevue: string;
  celluleNom: string;
}

interface Historique {
  id: number;
  typeEvenement: string;
  description: string;
  date: string;
}

export default function Prisonniers() {
  const auth = useAuth(); //useAuth est un hook qui permet de récupérer les informations de l'utilisateur connecté
  const user = auth.user; //user est l'utilisateur connecté
  const navigate = useNavigate(); //navigate est une fonction qui permet de naviguer entre les pages

  const [prisonniers, setPrisonniers] = useState<Prisonnier[]>([]); //prisonniers est un tableau de prisonniers
  const [form, setForm] = useState<PrisonnierForm>({
    nom: '', prenom: '', dateNaissance: '', accusation: '',
    dureePeine: '', dateArrivee: '', dateSortiePrevue: '', celluleNom: '',
  });

  const [prisonnierModif, setPrisonnierModif] = useState<Prisonnier | null>(null); //prisonnierModif est le prisonnier qui sera modifié
  const [prisonnierHistorique, setPrisonnierHistorique] = useState<Prisonnier | null>(null); //prisonnierHistorique est le prisonnier dont on veut voir l'historique
  const [historique, setHistorique] = useState<Historique[]>([]); //historique est l'historique du prisonnier
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier' | 'historique'>('liste'); //vue est la vue qui sera affichée
  const [message, setMessage] = useState(''); //message est le message qui sera affiché
  const [erreur, setErreur] = useState(''); //erreur est l'erreur qui sera affichée

  let isGarde = false; //isGarde est un boolean qui permet de vérifier si l'utilisateur est un garde
  if (user !== null && user.profile === 1) isGarde = true; //verification si l'utilisateur est un garde

  let isDirecteur = false; //isDirecteur est un boolean qui permet de vérifier si l'utilisateur est un directeur
  if (user !== null && user.profile === 2) isDirecteur = true; //verification si l'utilisateur est un directeur

  useEffect(() => { chargerPrisonniers(); }, []); //useEffect permet de charger les prisonniers au démarrage de la page

  async function chargerPrisonniers() {
    try {
      const data = await getPrisonniers(); //getPrisonniers est une fonction qui permet de récupérer les prisonniers
      setPrisonniers(data); //setPrisonniers permet de mettre à jour les prisonniers
    } catch (e: any) {
      setErreur('Erreur lors du chargement des prisonniers');
    }
  }

  async function libererExpires() {
    try {
      await apiClient.post('/prisonniers/liberer-expires'); //apiClient.post est une fonction qui permet d'envoyer une requête POST à l'API
      setMessage('Prisonniers expirés libérés avec succès'); //setMessage est une fonction qui permet de mettre à jour le message
      setErreur(''); //setErreur est une fonction qui permet de mettre à jour l'erreur
      chargerPrisonniers(); //chargerPrisonniers est une fonction qui permet de charger les prisonniers
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la libération'); //setErreur est une fonction qui permet de mettre à jour l'erreur
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form }; //newForm est un objet qui permet de stocker les modifications
    const name = e.target.name; //name est le nom du champ
    const value = e.target.value; //value est la valeur du champ
    if (name === 'nom') newForm.nom = value; //newForm.nom est le nom du champ nom
    else if (name === 'prenom') newForm.prenom = value; //newForm.prenom est le nom du champ prenom
    else if (name === 'dateNaissance') newForm.dateNaissance = value; //newForm.dateNaissance est le nom du champ dateNaissance
    else if (name === 'accusation') newForm.accusation = value; //newForm.accusation est le nom du champ accusation
    else if (name === 'dureePeine') newForm.dureePeine = value; //newForm.dureePeine est le nom du champ dureePeine
    else if (name === 'dateArrivee') newForm.dateArrivee = value; //newForm.dateArrivee est le nom du champ dateArrivee
    else if (name === 'dateSortiePrevue') newForm.dateSortiePrevue = value; //newForm.dateSortiePrevue est le nom du champ dateSortiePrevue
    else if (name === 'celluleNom') newForm.celluleNom = value; //newForm.celluleNom est le nom du champ celluleNom
    setForm(newForm); //setForm est une fonction qui permet de mettre à jour le formulaire
  }

  async function creerPrisonnier() {
    if (form.nom === '' || form.prenom === '' || form.dateNaissance === '' || form.accusation === '' || form.dureePeine === '' || form.dateArrivee === '' || form.dateSortiePrevue === '' || form.celluleNom === '') {
      setErreur('Veuillez remplir tous les champs'); //setErreur est une fonction qui permet de mettre à jour l'erreur
      return;
    }
    try {
      await createPrisonnier({
        nom: form.nom, prenom: form.prenom, dateNaissance: form.dateNaissance,
        accusation: form.accusation, dureePeine: Number(form.dureePeine), //Number() est une fonction qui permet de convertir la durée de la peine en nombre entier
        dateArrivee: form.dateArrivee, dateSortiePrevue: form.dateSortiePrevue,
        celluleNom: form.celluleNom
      });
      setMessage('Prisonnier créé avec succès'); //setMessage est une fonction qui permet de mettre à jour le message
      setErreur(''); //setErreur est une fonction qui permet de mettre à jour l'erreur
      setForm({ nom: '', prenom: '', dateNaissance: '', accusation: '', dureePeine: '', dateArrivee: '', dateSortiePrevue: '', celluleNom: '' }); //setForm est une fonction qui permet de mettre à jour le formulaire
      setVue('liste'); //setVue est une fonction qui permet de mettre à jour la vue
      chargerPrisonniers(); //chargerPrisonniers est une fonction qui permet de charger les prisonniers
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la création'); //setErreur est une fonction qui permet de mettre à jour l'erreur
    }
  }

  function ouvrirModification(p: Prisonnier) { //fonction ouvrirModification permet de modifier un prisonnier
    setPrisonnierModif(p); //setPrisonnierModif est une fonction qui permet de mettre à jour le prisonnier à modifier
    let cellName = ''; //cellName est le nom de la cellule
    if (p.cellule && p.cellule.nom) cellName = p.cellule.nom; //verification si le prisonnier a une cellule
    setForm({
      nom: p.nom, prenom: p.prenom, dateNaissance: p.dateNaissance, //nom, prenom, dateNaissance sont les informations du prisonnier
      accusation: p.accusation, dureePeine: p.dureePeine.toString(), //accusation, dureePeine sont les informations du prisonnier
      dateArrivee: p.dateArrivee, dateSortiePrevue: p.dateSortiePrevue, //dateArrivee, dateSortiePrevue sont les informations du prisonnier
      celluleNom: cellName, //celluleNom est le nom de la cellule
    }); //setForm est une fonction qui permet de mettre à jour le formulaire
    setVue('modifier'); //setVue est une fonction qui permet de mettre à jour la vue
  }

  async function modifierPrisonnier() { //fonction modifierPrisonnier permet de modifier un prisonnier
    if (prisonnierModif === null) return; //verification si le prisonnier n'est pas null
    try {
      await updatePrisonnier(prisonnierModif.numeroIdentification, {
        nom: form.nom, prenom: form.prenom, dateNaissance: form.dateNaissance, //nom, prenom, dateNaissance sont les informations du prisonnier
        accusation: form.accusation, dureePeine: Number(form.dureePeine), //accusation, dureePeine sont les informations du prisonnier
        dateArrivee: form.dateArrivee, dateSortiePrevue: form.dateSortiePrevue, //dateArrivee, dateSortiePrevue sont les informations du prisonnier
        celluleNom: form.celluleNom //celluleNom est le nom de la cellule
      }); //updatePrisonnier est une fonction qui permet de modifier un prisonnier
      setMessage('Prisonnier modifié avec succès'); //setMessage est une fonction qui permet de mettre à jour le message
      setErreur(''); //setErreur est une fonction qui permet de mettre à jour l'erreur
      setVue('liste'); //setVue est une fonction qui permet de mettre à jour la vue
      chargerPrisonniers(); //chargerPrisonniers est une fonction qui permet de charger les prisonniers
    } catch (e: any) {
      setErreur(e.response?.data?.message || 'Erreur lors de la modification'); //setErreur est une fonction qui permet de mettre à jour l'erreur
    }
  }

  async function ouvrirHistorique(p: Prisonnier) { //fonction ouvrirHistorique permet d'ouvrir l'historique d'un prisonnier
    setPrisonnierHistorique(p); //setPrisonnierHistorique est une fonction qui permet de mettre à jour l'historique du prisonnier
    const data = await getHistorique(p.numeroIdentification); //getHistorique est une fonction qui permet de récupérer l'historique d'un prisonnier
    setHistorique(data); //setHistorique est une fonction qui permet de mettre à jour l'historique
    setVue('historique'); //setVue est une fonction qui permet de mettre à jour la vue
  }

  function allerAuxIncidents() { navigate('/incidents'); } //fonction allerAuxIncidents redirige vers la page des incidents
  function allerAuxPrisonniers() { navigate('/prisonniers'); } //fonction allerAuxPrisonniers redirige vers la page des prisonniers
  function allerAuxCellules() { navigate('/cellules'); } //fonction allerAuxCellules redirige vers la page des cellules
  function allerAuxVisites() { navigate('/visites'); } //fonction allerAuxVisites redirige vers la page des visites
  function allerAuxComptes() { navigate('/comptes'); } //fonction allerAuxComptes redirige vers la page des comptes
  function deconnexion() { navigate('/'); } //fonction deconnexion redirige vers la page d'accueil

  function changerVueListe() { setVue('liste'); } //fonction changerVueListe permet de mettre à jour la vue
  function changerVueCreer() { setVue('creer'); } //fonction changerVueCreer permet de mettre à jour la vue

  let userName = '';
  if (user !== null && user.name) userName = user.name; //verification si l'utilisateur n'est pas null et si l'utilisateur a un nom

  let roleTexte = 'Directeur'; //roleTexte est le texte qui sera affiche dans le menu
  if (isGarde) roleTexte = 'Garde'; //verification si l'utilisateur est un garde

  let classVueCreer = 'tab-btn'; //classVueCreer est le style de la vue
  if (vue === 'creer') classVueCreer = 'tab-btn active'; //verification si la vue est 'creer'

  let actionsHeader = null; //actionsHeader est le bouton d'action
  if (isGarde || isDirecteur) { //verification si l'utilisateur est un garde ou un directeur
    actionsHeader = (
      <>
        {isGarde && <button className={classVueCreer} onClick={changerVueCreer}>+ Créer</button>}
        {isDirecteur && <button className="tab-btn" onClick={libererExpires}>🔓 Libérer expirés</button>}
      </>
    );
  }

  let contenuPrincipal: any = null; //contenuPrincipal est le contenu principal de la page

  if (vue === 'liste') { //si la vue est 'liste'
    const lignesTableau: any[] = []; //lignesTableau est un tableau qui contient les lignes du tableau
    if (prisonniers.length === 0) { //si le nombre de prisonniers est 0
      lignesTableau.push(
        <tr key="vide"><td colSpan={7} style={{ textAlign: 'center', color: '#888780' }}>Aucun prisonnier</td></tr> //ajouter une ligne vide
      );
    } else { //sinon
      for (let i = 0; i < prisonniers.length; i++) { //parcourir tous les prisonniers
        const p = prisonniers[i]; //p est le prisonnier actuel
        let celluleNom = '—'; //celluleNom est le nom de la cellule
        if (p.cellule && p.cellule.nom) celluleNom = p.cellule.nom; //verification si le prisonnier a une cellule

        let actionCell = null;
        if (isDirecteur) { //verification si l'utilisateur est un directeur
          actionCell = (
            <td>
              <button className="action-btn edit" onClick={function () { ouvrirModification(p); }}>Modifier</button>
              <button className="action-btn edit" onClick={function () { ouvrirHistorique(p); }}>Historique</button>
            </td>
          );
        }

        lignesTableau.push(
          <tr key={p.numeroIdentification}>
            <td>{p.numeroIdentification}</td>
            <td>{p.nom}</td>
            <td>{p.prenom}</td>
            <td><span className="tag">{p.accusation}</span></td>
            <td>{celluleNom}</td>
            <td>{p.dateSortiePrevue}</td>
            {actionCell}
          </tr>
        );
      }
    }

    let enteteActions = null;
    if (isDirecteur) enteteActions = <th>Actions</th>;

    contenuPrincipal = (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Nom</th><th>Prénom</th><th>Accusation</th>
              <th>Cellule</th><th>Sortie prévue</th>{enteteActions}
            </tr>
          </thead>
          <tbody>{lignesTableau}</tbody>
        </table>
      </div>
    );
  } else if (vue === 'creer' || vue === 'modifier') {
    let boutonPrincipal = null;
    if (vue === 'creer') {
      boutonPrincipal = <button className="btn" onClick={creerPrisonnier}>Enregistrer le prisonnier</button>;
    } else {
      boutonPrincipal = <button className="btn" onClick={modifierPrisonnier}>Sauvegarder les modifications</button>;
    }

    contenuPrincipal = (
      <div className="form-card">
        <div className="row">
          <div className="field-group">
            <label>Nom</label>
            <input name="nom" type="text" placeholder="ex: Dupont" value={form.nom} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Prénom</label>
            <input name="prenom" type="text" placeholder="ex: Jean" value={form.prenom} onChange={handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="field-group">
            <label>Date de naissance</label>
            <input name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Cellule</label>
            <input name="celluleNom" type="text" placeholder="ex: A1" value={form.celluleNom} onChange={handleChange} />
          </div>
        </div>
        <div className="field-group">
          <label>Accusation</label>
          <input name="accusation" type="text" placeholder="ex: Vol à main armée" value={form.accusation} onChange={handleChange} />
        </div>
        <div className="row">
          <div className="field-group">
            <label>Durée de peine (ans)</label>
            <input name="dureePeine" type="number" placeholder="ex: 5" value={form.dureePeine} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Date d'arrivée</label>
            <input name="dateArrivee" type="date" value={form.dateArrivee} onChange={handleChange} />
          </div>
        </div>
        <div className="field-group">
          <label>Date de sortie prévue</label>
          <input name="dateSortiePrevue" type="date" value={form.dateSortiePrevue} onChange={handleChange} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {boutonPrincipal}
          <button className="btn" style={{ backgroundColor: '#444' }} onClick={changerVueListe}>Annuler</button>
        </div>
      </div>
    );
  } else if (vue === 'historique' && prisonnierHistorique !== null) {
    contenuPrincipal = (
      <div className="form-card" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#2c2c28' }}>
            Historique — {prisonnierHistorique.nom} {prisonnierHistorique.prenom}
          </h2>
          <button className="tab-btn" onClick={changerVueListe}>Retour</button>
        </div>
        {historique.length === 0 && (
          <p style={{ color: '#888780', fontSize: '13px' }}>Aucun événement enregistré.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {historique.map(function (h) {
            let couleur = '#2c2c28';
            if (h.typeEvenement === 'visite') couleur = '#3B6D11';
            else if (h.typeEvenement === 'modification') couleur = '#b35c2a';
            return (
              <div key={h.id} style={{ borderLeft: '3px solid ' + couleur, paddingLeft: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="tag">{h.typeEvenement.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', color: '#888780' }}>{new Date(h.date).toLocaleString('fr-CA')}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#2c2c28', marginTop: '0.4rem' }}>{h.description}</p>
              </div>
            );
          })}
        </div>
      </div>
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
          <button className="active" onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Prisonniers</h1>
          <div className="header-actions">{actionsHeader}</div>
        </div>
        {message !== '' && <p className="status ok">{message}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}
        {contenuPrincipal}
      </div>
    </div>
  );
}