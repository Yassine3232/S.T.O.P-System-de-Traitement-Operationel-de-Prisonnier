import apiClient from './apiClient';

export interface Prisonnier {
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

export interface CreatePrisonnierData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  accusation: string;
  dureePeine: number;
  dateArrivee: string;
  dateSortiePrevue: string;
  celluleNom: string;
}

export interface Historique {
  id: number;
  typeEvenement: string;
  description: string;
  date: string;
}

export async function getPrisonniers(): Promise<Prisonnier[]> {
  const res = await apiClient.get('/prisonniers');
  return res.data;
}

export async function createPrisonnier(data: CreatePrisonnierData): Promise<any> {
  const res = await apiClient.post('/prisonniers', data);
  return res.data;
}

export async function updatePrisonnier(id: number, data: CreatePrisonnierData): Promise<any> {
  const res = await apiClient.patch(`/prisonniers/${id}`, data);
  return res.data;
}

export async function getHistorique(id: number): Promise<Historique[]> {
  const res = await apiClient.get(`/historique/${id}`);
  return res.data;
}