import apiClient from './apiClient';

export interface Incident {
  id: number;
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniers: any[];
}

export interface CreateIncidentData {
  type: string;
  description: string;
  dateHeure: string;
  rapportePar: string;
  prisonniersIds: number[];
}

export async function getIncidents(): Promise<Incident[]> {
  const res = await apiClient.get('/incidents');
  return res.data;
}

export async function createIncident(data: CreateIncidentData): Promise<any> {
  const res = await apiClient.post('/incidents', data);
  return res.data;
}

export async function deleteIncident(id: number): Promise<void> {
  await apiClient.delete(`/incidents/${id}`);
}