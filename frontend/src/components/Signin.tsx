import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signin } from '../api/auth.service';
import './Signup.css';

export default function Signin() {
  const [form, setForm] = useState({ email: '', password: '' }); //form est un objet qui contient l'email et le mot de passe
  const [erreur, setErreur] = useState(''); //erreur est une chaine de caractere qui contient le message d'erreur
  
  const navigate = useNavigate(); //navigate est une fonction qui permet de naviguer entre les pages
  const auth = useAuth(); //auth est un objet qui contient les informations de l'utilisateur
  const login = auth.login; //login est une fonction qui permet de connecter l'utilisateur

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newForm = { ...form }; //newForm est une copie de form
    const name = e.target.name; //name est le nom du champ
    const value = e.target.value; //value est la valeur du champ
    
    if (name === 'email') { //si le nom est email
      newForm.email = value; //newForm.email est mis a jour avec la valeur du champ email
    } else if (name === 'password') { //si le nom est password
      newForm.password = value; //newForm.password est mis a jour avec la valeur du champ password
    }
    
    setForm(newForm); //newForm est mis a jour avec les nouvelles valeurs
  }

  async function envoyerSignin() { //fonction envoyerSignin permet d'envoyer le formulaire
    if (form.email === '') {
      setErreur('Veuillez remplir tous les champs'); //si le formulaire est vide
      return;
    }
    if (form.password === '') { //si le formulaire est vide
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      const data = await signin(form); //signin est une fonction qui permet de connecter l'utilisateur
      login(data); //login est une fonction qui permet de connecter l'utilisateur
      navigate('/dashboard'); //navigate est une fonction qui permet de naviguer entre les pages
    } catch (e: any) { //catch est une fonction qui permet de capturer les erreurs 
      if (e.response && e.response.data && e.response.data.message) { //verification si la reponse contient un message d'erreur
        let msg = e.response.data.message; //msg est une variable qui permet de recuperer le message d'erreur
        if (Array.isArray(msg)) { //verification si le message d'erreur est un tableau
          msg = msg[0]; //si le message d'erreur est un tableau, on prend le premier element
        }
        setErreur(msg); //setErreur est une fonction qui permet de mettre a jour le message d'erreur
      } else {
        setErreur('Erreur de communication avec NestJS'); //si la reponse ne contient pas de message d'erreur
      }
    }
  }

  const barresArray = [];
  for (let i = 0; i < 8; i++) { //boucle qui permet de créer 8 barres
    barresArray.push(i); //barresArray est un tableau qui contient les nombres de 0 a 7
  }

  let dateTexte = new Date().toLocaleDateString('fr-CA'); //dateTexte est une chaine de caractere qui contient la date actuelle 

  return ( //renvoie le formulaire d'inscription
    <div className="prison-wrap">
      <div className="bars">
        {barresArray.map(function(i) { //boucle qui permet de créer 8 barres
          return <div className="bar" key={i} />; //renvoie une barre
        })}
      </div>
      <div className="card">
        <div className="card-header">
          <div className="badge">ÉTABLISSEMENT PÉNITENTIAIRE</div>
          <h1>Accès<br />Sécurisé</h1>
        </div>
        <div className="field-group">
          <label>Adresse courriel</label>
          <input name="email" type="email" placeholder="ex: garde@prison.ca" value={form.email} onChange={handleChange} />
        </div>
        <div className="field-group">
          <label>Mot de passe</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>
        <button className="btn" onClick={envoyerSignin}>Entrer</button>
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}
        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{dateTexte}</span>
        </div>
      </div>
    </div>
  );
}