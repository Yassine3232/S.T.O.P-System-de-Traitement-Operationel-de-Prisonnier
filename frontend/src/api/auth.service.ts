import apiClient from './apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  profile: number;
  dateNaissance: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  profile: number;
  dateNaissance: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  dateNaissance: string;
}

export async function getUsers(): Promise<User[]> { //fonction getUsers permet de récupérer tous les utilisateurs 
  const res = await apiClient.get('/auth'); //envoie une requête GET à l'API pour récupérer tous les utilisateurs
  return res.data; //retourne les données de la réponse 
}

export async function signin(data: SigninData): Promise<any> { //fonction signin permet de connecter un utilisateur 
  const res = await apiClient.post('/auth/signin', data); //envoie une requête POST à l'API pour connecter un utilisateur 
  return res.data; //retourne les données de la réponse 
}

export async function signup(data: SignupData): Promise<any> { //fonction signup permet d'inscrire un utilisateur 
  const res = await apiClient.post('/auth/signup', data); //envoie une requête POST à l'API pour inscrire un utilisateur 
  return res.data; //retourne les données de la réponse 
}

export async function updateUser(id: number, data: UpdateUserData): Promise<any> { //fonction updateUser permet de modifier un utilisateur 
  const res = await apiClient.patch(`/auth/${id}`, data); //envoie une requête PATCH à l'API pour modifier un utilisateur 
  return res.data; //retourne les données de la réponse 
}