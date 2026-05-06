import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visite } from './visite.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { Incident } from '../incidents/incident.entity';
import { CreerDemandeVisiteDto } from './dtos/creer-demande-visite.dto';
import { RepondreDemandeVisiteDto } from './dtos/repondre-demande-visite.dto';
import { CreerVisiteDto } from './dtos/creer-visite.dto';
import { ModifierVisiteDto } from './dtos/modifier-visite.dto';

@Injectable()
export class VisitesService {
  constructor(
    @InjectRepository(Visite) private repoVisite: Repository<Visite>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
  ) {}

  async soumettreDemandeVisite(donnees: CreerDemandeVisiteDto) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });

    if (prisonnier === null) {
      throw new NotFoundException('Prisonnier introuvable');
    }

    const nouvelleVisite = this.repoVisite.create({
      nomMembreFamille: donnees.nomMembreFamille,
      lienFamilial: donnees.lienFamilial,
      statut: 'en_attente',
      prisonnier: prisonnier,
    });

    return this.repoVisite.save(nouvelleVisite);
  }

  async consulterDossierPrisonnier(prisonnierId: number) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: prisonnierId } });

    if (prisonnier === null) {
      throw new NotFoundException('Prisonnier introuvable');
    }

    const tousLesIncidents = await this.repoIncident.find({ relations: ['prisonniers'] });
    const incidentsLies: Incident[] = [];
    
    for (let i = 0; i < tousLesIncidents.length; i++) {
      const incident = tousLesIncidents[i];
      let aCePrisonnier = false;
      
      for (let j = 0; j < incident.prisonniers.length; j++) {
        if (incident.prisonniers[j].numeroIdentification === prisonnierId) {
          aCePrisonnier = true;
        }
      }
      
      if (aCePrisonnier === true) {
        incidentsLies.push(incident);
      }
    }

    const visitesPrecedentes = await this.repoVisite.find({ 
      where: { prisonnier: { numeroIdentification: prisonnierId } as any } 
    });

    return {
      prisonnier: prisonnier,
      incidents: incidentsLies,
      visitesPrecedentes: visitesPrecedentes,
    };
  }

  async repondreDemandeVisite(visiteId: number, donnees: RepondreDemandeVisiteDto) {
    const visite = await this.repoVisite.findOne({ where: { id: visiteId }, relations: ['prisonnier'] });

    if (visite === null) {
      throw new NotFoundException('Demande de visite introuvable');
    }

    if (visite.statut !== 'en_attente') {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    if (donnees.decision === 'approuvee') {
      visite.statut = 'approuvee';
      visite.dateVisite = donnees.dateVisite;
    } else if (donnees.decision === 'refusee') {
      visite.statut = 'refusee';
      visite.motifRefus = donnees.motifRefus;
    } else {
      throw new BadRequestException('La décision doit être approuvee ou refusee');
    }

    return this.repoVisite.save(visite);
  }

  async listerDemandesEnAttente() {
    return this.repoVisite.find({ where: { statut: 'en_attente' }, relations: ['prisonnier'] });
  }

  async findAll() {
    return this.repoVisite.find({ relations: ['prisonnier'] });
  }

  async findOne(id: number) {
    const visite = await this.repoVisite.findOne({ where: { id: id }, relations: ['prisonnier'] });
    if (visite === null) {
      throw new NotFoundException('Visite introuvable');
    }
    return visite;
  }

  async creer(donnees: CreerVisiteDto) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });

    if (prisonnier === null) {
      throw new NotFoundException('Prisonnier introuvable');
    }

    const nouvelleVisite = this.repoVisite.create({
      prisonnier: prisonnier,
      nomVisiteur: donnees.nomVisiteur,
      date: donnees.date,
      heure: donnees.heure,
      duree: donnees.duree,
      statut: 'en_attente',
    });

    return this.repoVisite.save(nouvelleVisite);
  }

  async modifier(id: number, donnees: ModifierVisiteDto) {
    const visite = await this.repoVisite.findOne({ where: { id: id }, relations: ['prisonnier'] });

    if (visite === null) {
      throw new NotFoundException('Visite introuvable');
    }

    if (donnees.prisonnierId !== undefined && donnees.prisonnierId !== null) {
      const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });
      if (prisonnier === null) {
        throw new NotFoundException('Prisonnier introuvable');
      }
      visite.prisonnier = prisonnier;
    }

    if (donnees.nomVisiteur !== undefined) {
      visite.nomVisiteur = donnees.nomVisiteur;
    }
    if (donnees.date !== undefined) {
      visite.date = donnees.date;
    }
    if (donnees.heure !== undefined) {
      visite.heure = donnees.heure;
    }
    if (donnees.duree !== undefined) {
      visite.duree = donnees.duree;
    }

    return this.repoVisite.save(visite);
  }

  async supprimer(id: number) {
    const visite = await this.repoVisite.findOne({ where: { id: id } });

    if (visite === null) {
      throw new NotFoundException('Visite introuvable');
    }

    await this.repoVisite.remove(visite);
  }
}
