import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsers, signup, updateUser } from '../api/auth.service';
import './Incidents.css';

interface Compte {
  id: number;
  name: string;
  email: string;
  profile: number;
  dateNaissance: string;
}

interface CompteForm {
  name: string;
  email: string;
  password: string;
  profile: string;
  dateNaissance: string;
}

interface ModifForm {
  name: string;
  email: string;
  dateNaissance: string;
}

function profileLabel(profile: number) {
  if (profile === 0) {
    return 'Visiteur';
  } else if (profile === 1) {
    return 'Garde';
  } else if (profile === 2) {
    return 'Directeur';
  } else {
    return 'Inconnu';
  }
}

export default function Comptes() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [vue, setVue] = useState<'liste' | 'creer' | 'modifier'>('liste');
  const [compteSelectionne, setCompteSelectionne] = useState<Compte | null>(null);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const [creerForm, setCruerForm] = useState<CompteForm>({
    name: '',
    email: '',
    password: '',
    profile: '',
    dateNaissance: '',
  });

  const [modifForm, setModifForm] = useState<ModifForm>({
    name: '',
    email: '',
    dateNaissance: '',
  });

  useEffect(() => {
    chargerComptes();
  }, []);

  async function chargerComptes() {
    try {
      const data = await getUsers();
      setComptes(data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des comptes');
    }
  }

  function handleCreerChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const newForm = { ...creerForm };
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'name') newForm.name = value;
    else if (name === 'email') newForm.email = value;
    else if (name === 'password') newForm.password = value;
    else if (name === 'profile') newForm.profile = value;
    else if (name === 'dateNaissance') newForm.dateNaissance = value;

    setCruerForm(newForm);
  }

  function handleModifChange(e: React.ChangeEvent<HTMLInputElement>) { //React.ChangeEvent<HTMLInputElement> est le type d'événement qui est généré par un élément HTMLInputElement
    const newForm = { ...modifForm }; //crée une copie du formulaire de modification
    const name = e.target.name; //name est le nom du champ qui est modifié
    const value = e.target.value; //value est la valeur du champ qui est modifié

    if (name === 'name') newForm.name = value;
    else if (name === 'email') newForm.email = value;
    else if (name === 'dateNaissance') newForm.dateNaissance = value;

    setModifForm(newForm);
  }

  async function creerCompte() {
    if (creerForm.name === '' || creerForm.email === '' || creerForm.password === '' || creerForm.profile === '' || creerForm.dateNaissance === '') {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      await signup({
        name: creerForm.name,
        email: creerForm.email,
        password: creerForm.password,
        profile: Number(creerForm.profile),
        dateNaissance: creerForm.dateNaissance
      });

      setMessage('Compte créé avec succès');
      setErreur('');
      setCruerForm({ name: '', email: '', password: '', profile: '', dateNaissance: '' }); //SetcreerForm reinitialise le formulaire de creation
      setVue('liste'); //Setvue change la vue en liste
      chargerComptes(); //chargerLesComptes recharge la liste des comptes
    } catch (e: any) { //gestion des erreurs
      if (e.response && e.response.data && e.response.data.message) { //verification que l'erreur existe
        setErreur(e.response.data.message); //Seterreur affiche le message d'erreur
      } else {
        setErreur('Erreur lors de la création'); //Erreur lors de la création
      }
    }
  }

  function ouvrirModification(c: Compte) { //fonction ouvrirModification prend en parametre un compte
    setCompteSelectionne(c); //setcompteSelectionne selectionne le compte
    setModifForm({ //SetmodifForm prend en parametre un formulaire de modification 
      name: c.name, //name est le nom du compte
      email: c.email, //email est l'email du compte
      dateNaissance: c.dateNaissance //dateNaissance est la date de naissance du compte
    });
    setVue('modifier'); //Setvue change la vue en modifier
  }

  async function modifierCompte() { //fonction modifierCompte modifie le compte 
    if (compteSelectionne === null) { //verification que le compte existe
      return;
    }

    try {
      await updateUser(compteSelectionne.id, modifForm); //updateUser met à jour le compte
      setMessage('Compte modifié avec succès'); //setmessage affiche le message de succès
      setErreur(''); //Seterreur efface le message d'erreur
      setVue('liste'); //Setvue change la vue en liste
      chargerComptes(); //chargerLesComptes recharge la liste des comptes
    } catch (e: any) { //gestion des erreurs
      if (e.response && e.response.data && e.response.data.message) { //verification que l'erreur existe
        setErreur(e.response.data.message); //Seterreur affiche le message d'erreur
      } else {
        setErreur('Erreur lors de la modification'); //Erreur lors de la modification
      }
    }
  }

  function allerAuxIncidents() { navigate('/incidents'); } //allerAuxIncidents redirige vers la page des incidents
  function allerAuxPrisonniers() { navigate('/prisonniers'); } //allerAuxPrisonniers redirige vers la page des prisonniers
  function allerAuxCellules() { navigate('/cellules'); } //allerAuxCellules redirige vers la page des cellules
  function allerAuxVisites() { navigate('/visites'); } //allerAuxVisites redirige vers la page des visites
  function allerAuxComptes() { navigate('/comptes'); } //allerAuxComptes redirige vers la page des comptes
  function deconnexion() { navigate('/'); } //deconnexion redirige vers la page d'accueil

  let userName = ''; //userName est le nom de l'utilisateur
  if (user !== null && user.name) { //verification que l'utilisateur existe
    userName = user.name; //userName prend la valeur du nom de l'utilisateur
  }

  function changerVueListe() { //fonction changerVueListe change la vue en liste 
    setVue('liste'); //Setvue change la vue en liste
    setErreur(''); //Seterreur efface le message d'erreur
    setMessage(''); //Sette message efface le message de succès
  }

  function changerVueCreer() { //fonction changerVueCreer change la vue en creer 
    setVue('creer'); //Setvue change la vue en creer
    setCruerForm({ name: '', email: '', password: '', profile: '', dateNaissance: '' }); //SetcreerForm reinitialise le formulaire de creation
    setErreur(''); //Seterreur efface le message d'erreur
    setMessage(''); //Sette message efface le message de succès
  }

  const isGarde = user?.profile === 1; //isGarde verifie si l'utilisateur est un garde
  let roleTexte = 'Directeur'; //roleTexte est le texte qui sera affiche dans le menu
  if (isGarde) { //verification si l'utilisateur est un garde
    roleTexte = 'Garde'; //roleTexte prend la valeur de Garde
  }

  let classVueListe = 'tab-btn'; //classVueListe est le style qui sera appliqué à la vue liste
  if (vue === 'liste') { //verification que la vue est liste
    classVueListe = 'tab-btn active'; //classVueListe prend la valeur de active
  }

  let classVueCreer = 'tab-btn'; //classVueCreer est le style qui sera appliqué à la vue creer
  if (vue === 'creer') { //verification que la vue est creer
    classVueCreer = 'tab-btn active'; //classVueCreer prend la valeur de active
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
          <button onClick={allerAuxVisites}>Visites</button>
          <button className="active" onClick={allerAuxComptes}>Comptes</button>
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Comptes</h1>
          <div className="header-actions">
            <button className={classVueListe} onClick={changerVueListe}>
              Liste
            </button>
            <button className={classVueCreer} onClick={changerVueCreer}>
              + Créer
            </button>
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
                  <th>Nom</th>
                  <th>Courriel</th>
                  <th>Profil</th>
                  <th>Date de naissance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comptes.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888780' }}>Aucun compte</td></tr>
                )}
                {comptes.map(function (c) {
                  return (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td><span className="tag">{profileLabel(c.profile)}</span></td>
                      <td>{c.dateNaissance}</td>
                      <td>
                        <button className="action-btn edit" onClick={function () { ouvrirModification(c); }}>
                          Modifier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {vue === 'creer' && (
          <div className="form-card">
            <div className="row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  name="name"
                  type="text"
                  placeholder="ex: Dupont"
                  value={creerForm.name}
                  onChange={handleCreerChange}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  name="email"
                  type="email"
                  placeholder="ex: dupont@prison.ca"
                  value={creerForm.email}
                  onChange={handleCreerChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="field-group">
                <label>Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={creerForm.password}
                  onChange={handleCreerChange}
                />
              </div>
              <div className="field-group">
                <label>Profil</label>
                <select
                  name="profile"
                  value={creerForm.profile}
                  onChange={handleCreerChange}
                >
                  <option value="">-- Choisir --</option>
                  <option value={1}>Garde</option>
                  <option value={2}>Directeur</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label>Date de naissance</label>
              <input
                name="dateNaissance"
                type="date"
                value={creerForm.dateNaissance}
                onChange={handleCreerChange}
              />
            </div>
            <button className="btn" onClick={creerCompte}>Créer le compte</button>
          </div>
        )}

        {vue === 'modifier' && compteSelectionne !== null && (
          <div className="form-card">
            <div className="row">
              <div className="field-group">
                <label>Nom</label>
                <input
                  name="name"
                  type="text"
                  value={modifForm.name}
                  onChange={handleModifChange}
                />
              </div>
              <div className="field-group">
                <label>Courriel</label>
                <input
                  name="email"
                  type="email"
                  value={modifForm.email}
                  onChange={handleModifChange}
                />
              </div>
            </div>
            <div className="field-group">
              <label>Date de naissance</label>
              <input
                name="dateNaissance"
                type="date"
                value={modifForm.dateNaissance}
                onChange={handleModifChange}
              />
            </div>
            <button className="btn" onClick={modifierCompte}>Sauvegarder</button>
          </div>
        )}
      </div>
    </div>
  );
}