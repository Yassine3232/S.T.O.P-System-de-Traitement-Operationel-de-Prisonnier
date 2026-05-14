import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { CreerIncidentDto } from './dtos/creer-incident.dto';
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
    private historiqueService: HistoriqueService,
  ) { }

  async creerIncident(donnees: CreerIncidentDto) {
    const prisonniersTrouves: Prisonnier[] = [];

    for (let i = 0; i < donnees.prisonniersIds.length; i++) {
      const pId = donnees.prisonniersIds[i];
      const p = await this.repoPrisonnier.findOne({ where: { numeroIdentification: pId } });
      if (p !== null) {
        prisonniersTrouves.push(p); //.push() permet d'ajouter un element a un tableau
      }
    }

    if (prisonniersTrouves.length === 0) {
      throw new NotFoundException('Aucun prisonnier trouvé avec ces identifiants');
    }

    const nouvelIncident = this.repoIncident.create({
      type: donnees.type,
      description: donnees.description,
      dateHeure: donnees.dateHeure,
      rapportePar: donnees.rapportePar,
      prisonniers: prisonniersTrouves,
    });

    const sauvegarde = await this.repoIncident.save(nouvelIncident);

    for (const prisonnier of prisonniersTrouves) {
      await this.historiqueService.enregistrer(
        prisonnier,
        'incident',
        `Incident "${donnees.type}" — ${donnees.description} — Rapporté par: ${donnees.rapportePar}`,
      );
    }

    return sauvegarde;
  }

  async trouverTous() {
    return this.repoIncident.find({ relations: ['prisonniers'] });
  }

  async trouverParId(id: number) {
    const incident = await this.repoIncident.findOne({ where: { id: id }, relations: ['prisonniers'] });
    if (incident === null) {
      throw new NotFoundException('Incident introuvable');
    }
    return incident;
  }

  async supprimer(id: number) {
    const incident = await this.repoIncident.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident introuvable');
    await this.repoIncident.remove(incident);
  }

  async modifierIncident(id: number, donnees: Partial<CreerIncidentDto>) {
    const incident = await this.repoIncident.findOne({ where: { id }, relations: ['prisonniers'] });
    if (!incident) throw new NotFoundException('Incident introuvable');

    if (donnees.type) incident.type = donnees.type;
    if (donnees.description) incident.description = donnees.description;
    if (donnees.dateHeure) incident.dateHeure = donnees.dateHeure;
    if (donnees.rapportePar) incident.rapportePar = donnees.rapportePar;

    if (donnees.prisonniersIds && donnees.prisonniersIds.length > 0) {
      const prisonniersTrouves: Prisonnier[] = [];
      for (const pId of donnees.prisonniersIds) {
        const p = await this.repoPrisonnier.findOne({ where: { numeroIdentification: pId } });
        if (p) prisonniersTrouves.push(p);
      }
      if (prisonniersTrouves.length === 0) throw new NotFoundException('Aucun prisonnier trouvé');
      incident.prisonniers = prisonniersTrouves;
    }

    return this.repoIncident.save(incident);
  }
}