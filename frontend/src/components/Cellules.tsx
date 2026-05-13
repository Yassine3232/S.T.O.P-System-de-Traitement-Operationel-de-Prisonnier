import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCellules } from '../api/cellules.service';
import './Incidents.css'; 

interface Prisonnier {
  numeroIdentification: number;
  nom: string;
  prenom: string;
}

interface Cellule {
  numeroIdentification: number;
  nom: string;
  prisonniers: Prisonnier[];
}

export default function Cellules() { //fonction Cellules permet de afficher les cellules
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate(); //fonction navigate permet de naviguer entre les pages

  const [cellules, setCellules] = useState<Cellule[]>([]); //cellules est un tableau de cellules
  const [erreur, setErreur] = useState(''); //erreur est un message d'erreur 

  let isGarde = false; //isGarde est un boolean qui permet de savoir si l'utilisateur est un garde
  if (user !== null && user.profile === 1) { //si l'utilisateur est connecte et que son profile est 1 (garde)
    isGarde = true; //isGarde devient true
  }

  let isDirecteur = false; //isDirecteur est un boolean qui permet de savoir si l'utilisateur est un directeur
  if (user !== null && user.profile === 2) { //si l'utilisateur est connecte et que son profile est 2 (directeur)
    isDirecteur = true; //isDirecteur devient true
  }

  useEffect(() => {
    chargerCellules(); //appel de la fonction chargerCellules pour charger les cellules
  }, []); //useEffect est un hook qui permet de executer une fonction apres le rendu de la page

  async function chargerCellules() { //fonction chargerCellules permet de charger les cellules
    try {
      const data = await getCellules(); //envoie une requête GET à l'API pour récupérer toutes les cellules 
      setCellules(data);
    } catch (e: any) {
      setErreur('Erreur lors du chargement des cellules');
    }
  }

  function allerAuxIncidents() { navigate('/incidents'); } //fonction allerAuxIncidents permet de naviguer vers la page des incidents
  function allerAuxPrisonniers() { navigate('/prisonniers'); } //fonction allerAuxPrisonniers permet de naviguer vers la page des prisonniers
  function allerAuxCellules() { navigate('/cellules'); } //fonction allerAuxCellules permet de naviguer vers la page des cellules
  function allerAuxVisites() { navigate('/visites'); } //fonction allerAuxVisites permet de naviguer vers la page des visites
  function allerAuxComptes() { navigate('/comptes'); } //fonction allerAuxComptes permet de naviguer vers la page des comptes
  function deconnexion() { navigate('/'); } //fonction deconnexion permet de deconnecter l'utilisateur 

  let userName = ''; //userName est le nom de l'utilisateur
  if (user !== null && user.name) { //si l'utilisateur est connecte et que son nom existe
    userName = user.name; //userName prend le nom de l'utilisateur
  }

  let roleTexte = 'Directeur';
  if (isGarde) {
    roleTexte = 'Garde';
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
          <button className="active" onClick={allerAuxCellules}>Cellules</button>
          <button onClick={allerAuxVisites}>Visites</button>
          {isDirecteur && <button onClick={allerAuxComptes}>Comptes</button>}
        </nav>
        <button className="dash-logout" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="dash-main">
        <div className="page-header">
          <h1>Gestion des Cellules</h1>
        </div>

        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la cellule</th>
                <th>Nombre de détenus</th>
                <th>Liste des détenus</th>
              </tr>
            </thead>
            <tbody>
              {cellules.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888780' }}>Aucune cellule trouvée</td></tr>
              )}
              {cellules.map(function(c) {
                let listeNoms = '';
                if (c.prisonniers && c.prisonniers.length > 0) {
                  for (let i = 0; i < c.prisonniers.length; i++) {
                    listeNoms += c.prisonniers[i].prenom + ' ' + c.prisonniers[i].nom;
                    if (i < c.prisonniers.length - 1) {
                      listeNoms += ', ';
                    }
                  }
                } else {
                  listeNoms = 'Aucun prisonnier';
                }

                let nombreDetenus = 0;
                if (c.prisonniers) {
                  nombreDetenus = c.prisonniers.length;
                }

                return (
                  <tr key={c.numeroIdentification}>
                    <td>{c.numeroIdentification}</td>
                    <td><span className="tag">{c.nom}</span></td>
                    <td>{nombreDetenus}</td>
                    <td>{listeNoms}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
