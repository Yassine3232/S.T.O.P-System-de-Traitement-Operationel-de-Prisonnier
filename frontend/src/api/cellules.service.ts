import apiClient from './apiClient';

export interface Prisonnier {
  numeroIdentification: number; //numeroIdentification est l'identifiant unique du prisonnier
  nom: string; //nom est le nom du prisonnier
  prenom: string; //prenom est le prenom du prisonnier
}

export interface Cellule {
  numeroIdentification: number; //numeroIdentification est l'identifiant unique de la cellule
  nom: string; //nom est le nom de la cellule
  prisonniers: Prisonnier[]; //prisonniers est le tableau des prisonniers de la cellule
}

export async function getCellules(): Promise<Cellule[]> {
  //fonction getCellules permet de récupérer toutes les cellules 
  const res = await apiClient.get('/cellules');  //envoie une requête GET à l'API pour récupérer toutes les cellules 
  return res.data; //retourne les données de la réponse 
}