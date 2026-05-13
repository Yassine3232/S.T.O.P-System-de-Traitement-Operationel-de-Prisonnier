import apiClient from './apiClient';

export interface DemandeVisiteData {
  prisonnierId: number;
  nomMembreFamille: string;
  lienFamilial: string;
}

export async function demandeVisite(data: DemandeVisiteData): Promise<void> {
  await apiClient.post('/visites/demande', data);
}