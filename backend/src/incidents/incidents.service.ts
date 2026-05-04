import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { CreerIncidentDto } from './dtos/creer-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
  ) {}

  async creerIncident(donnees: CreerIncidentDto) {
    const prisonniersTrouves: Prisonnier[] = [];
    
    for (let i = 0; i < donnees.prisonniersIds.length; i++) {
      const pId = donnees.prisonniersIds[i];
      const p = await this.repoPrisonnier.findOne({ where: { numeroIdentification: pId } });
      if (p !== null) {
        prisonniersTrouves.push(p);
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

    return this.repoIncident.save(nouvelIncident);
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
}
