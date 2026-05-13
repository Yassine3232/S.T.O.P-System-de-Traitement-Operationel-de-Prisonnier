import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() { //export default function Dashboard est une fonction qui permet de créer un tableau de bord 
  const auth = useAuth(); //useAuth est un hook qui permet de récupérer les informations de l'utilisateur connecté
  const user = auth.user; //user est l'utilisateur connecté
  const logout = auth.logout; //logout est une fonction qui permet de déconnecter l'utilisateur
  const navigate = useNavigate(); //navigate est une fonction qui permet de naviguer entre les pages

  if (user === null || user === undefined) { //verification si l'utilisateur est connecté
    navigate('/signin'); //redirection vers la page de connexion
    return null; //return null
  }

  let isGarde = false; //isGarde est un boolean qui permet de vérifier si l'utilisateur est un garde
  if (user.profile === 1) { //verification si l'utilisateur est un garde
    isGarde = true; //isGarde prend la valeur de true
  }

  let isDirecteur = false; //isDirecteur est un boolean qui permet de vérifier si l'utilisateur est un directeur
  if (user.profile === 2) { //verification si l'utilisateur est un directeur
    isDirecteur = true; //isDirecteur prend la valeur de true
  }

  function handleLogout() { //fonction handleLogout permet de déconnecter l'utilisateur
    logout(); //logout déconnecte l'utilisateur
    navigate('/'); //redirection vers la page d'accueil
  }

  function allerAuxIncidents() { navigate('/incidents'); } //fonction allerAuxIncidents redirige vers la page des incidents
  function allerAuxPrisonniers() { navigate('/prisonniers'); } //fonction allerAuxPrisonniers redirige vers la page des prisonniers
  function allerAuxCellules() { navigate('/cellules'); } //fonction allerAuxCellules redirige vers la page des cellules
  function allerAuxVisites() { navigate('/visites'); } //fonction allerAuxVisites redirige vers la page des visites
  function allerAuxComptes() { navigate('/comptes'); } //fonction allerAuxComptes redirige vers la page des comptes

  let roleTexte = 'Directeur'; //roleTexte est le texte qui sera affiche dans le menu
  if (isGarde) { //verification que l'utilisateur est un garde
    roleTexte = 'Garde'; //roleTexte prend la valeur de Garde
  }

  return (
    <div className="dash-wrap">
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="badge">S.T.O.P</div>
          <h2>Tableau<br />de bord</h2>
        </div>

        <div className="dash-user">
          <p className="dash-user-name">{user.name}</p>
          <p className="dash-user-role">{roleTexte}</p>
        </div>

        <nav className="dash-nav">
          <button onClick={allerAuxIncidents}>Incidents</button>
          <button onClick={allerAuxPrisonniers}>Prisonniers</button>
          <button onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>

        <button className="dash-logout" onClick={handleLogout}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <h1>Bienvenue, {user.name}</h1>
        <p>Sélectionnez une section dans le menu.</p>
      </div>
    </div>
  );
}