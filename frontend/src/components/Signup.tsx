import { useState } from 'react';
import { signup } from '../api/auth.service';
import './Signup.css';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  profile: string;
  dateNaissance: string;
}

export default function Signup() { //fonction Signup permet d'afficher le formulaire d'inscription 
  const [form, setForm] = useState<SignupForm>({ //form est un objet qui contient les informations du formulaire
    name: '',
    email: '',
    password: '',
    profile: '',
    dateNaissance: '',
  });
  
  const [reponse, setReponse] = useState(''); //reponse est une chaine de caractere qui contient le message de reponse
  const [erreur, setErreur] = useState(''); //erreur est une chaine de caractere qui contient le message d'erreur

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) { //fonction handleChange permet de mettre a jour les champs du formulaire
    const newForm = { ...form }; //newForm est une copie de form
    const name = e.target.name; //name est le nom du champ
    const value = e.target.value;
    
    if (name === 'name') { //si le nom est name
      newForm.name = value; //newForm.name est mis a jour avec la valeur du champ name
    } else if (name === 'email') {
      newForm.email = value;
    } else if (name === 'password') {
      newForm.password = value;
    } else if (name === 'profile') {
      newForm.profile = value;
    } else if (name === 'dateNaissance') {
      newForm.dateNaissance = value;
    }
    
    setForm(newForm); //newForm est mis a jour avec les nouvelles valeurs
  }

  async function envoyerSignup() { //fonction envoyerSignup permet d'envoyer le formulaire
    if (form.name === '') {
      setErreur('Veuillez remplir tous les champs obligatoires'); //si le formulaire est vide
      return;
    }
    if (form.email === '') {
      setErreur('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (form.password === '') {
      setErreur('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      let profileNumber = 0;
      if (form.profile !== '') {
        profileNumber = Number(form.profile); //profileNumber est un nombre qui permet de stocker le profil de l'utilisateur
      }

      const data = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        profile: profileNumber,
        dateNaissance: form.dateNaissance,
      });
      
      if (data && data.message) {
        setReponse(data.message);
      } else {
        setReponse('Inscription réussie');
      }
      
      setErreur('');
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        let msg = e.response.data.message;
        if (Array.isArray(msg)) {
          msg = msg[0];
        }
        setErreur(msg);
      } else {
        setErreur('Erreur de communication avec NestJS');
      }
      setReponse('');
    }
  }

  const barresArray = [];
  for (let i = 0; i < 8; i++) { //boucle qui permet de créer 8 barres
    barresArray.push(i);
  }

  let dateTexte = new Date().toLocaleDateString('fr-CA'); //dateTexte est une chaine de caractere qui contient la date actuelle 

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
          <h1>Inscription<br />Détenu</h1>
        </div>

        <div className="field-group">
          <label>Nom complet</label>
          <input name="name" type="text" placeholder="ex: Dupont" value={form.name} onChange={handleChange} />
        </div>

        <div className="field-group">
          <label>Adresse courriel</label>
          <input name="email" type="email" placeholder="ex: dupont@prison.ca" value={form.email} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="field-group">
            <label>Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Profil</label>
            <select name="profile" value={form.profile} onChange={handleChange}>
                <option value="">-- Choisir --</option>
                <option value={1}>Garde</option>
                <option value={2}>Directeur</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label>Date de naissance</label>
          <input name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
        </div>

        <button className="btn" onClick={envoyerSignup}>Enregistrer le détenu</button>

        {reponse !== '' && <p className="status ok">[ OK ] {reponse}</p>}
        {erreur !== '' && <p className="status err">[ ERREUR ] {erreur}</p>}

        <div className="card-footer">
          <span>SYSTÈME v2.4</span>
          <span>{dateTexte}</span>
        </div>
      </div>
    </div>
  );
}