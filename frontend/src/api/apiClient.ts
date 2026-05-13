import axios from 'axios';

const apiClient = axios.create({ //axios est une bibliothèque qui permet de faire des requêtes HTTP 
  baseURL: 'http://localhost:3000', //baseURL est l'URL de base de l'API 
  //il faut que cette URL corresponde a l'URL de l'API sur le backend
  withCredentials: true, //withCredentials est un paramètre qui permet de envoyer les cookies avec la requête 
});

export default apiClient; //exportation de l'instance d'axios 