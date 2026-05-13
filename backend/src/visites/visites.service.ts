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
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class VisitesService {
  constructor(
    // InjectRepository() permet d'injecter un dépôt de données dans le service
    // Repository<Visite> permet de spécifier le type de données que l'on veut injecter (Repository<T> est un paramètre générique de type T)
    @InjectRepository(Visite) private repoVisite: Repository<Visite>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
    private historiqueService: HistoriqueService,
  ) { }

  async soumettreDemandeVisite(donnees: CreerDemandeVisiteDto) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });
    if (prisonnier === null) throw new NotFoundException('Prisonnier introuvable');

    const nouvelleVisite = this.repoVisite.create({
      nomMembreFamille: donnees.nomMembreFamille,
      lienFamilial: donnees.lienFamilial,
      statut: 'en_attente',
      prisonnier: prisonnier,
    });

    return this.repoVisite.save(nouvelleVisite);
  }

  async consulterDossierPrisonnier(prisonnierId: number) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: prisonnierId } }); // .findOne() pour trouver un enregistrement spécifique
    if (!prisonnier) throw new NotFoundException('Prisonnier introuvable');

    const tousLesIncidents = await this.repoIncident.find({ relations: ['prisonniers'] }); // .find() pour trouver tous les enregistrements dans la table incidents
    const incidentsLies = tousLesIncidents.filter(inc => // .filter() pour filtrer les enregistrements selon une condition
      inc.prisonniers.some(p => p.numeroIdentification === prisonnierId) // .some() pour vérifier si le prisonnier est lié à l'incident (return false or true)
    );

    const visitesPrecedentes = await this.repoVisite.find({ // .find() pour trouver tous les enregistrements dans la table visites
      where: { prisonnier: { numeroIdentification: prisonnierId } as any },
    });

    return { prisonnier, incidentsLies, visitesPrecedentes };
  }

  async repondreDemandeVisite(visiteId: number, donnees: RepondreDemandeVisiteDto) {
    const visite = await this.repoVisite.findOne({ where: { id: visiteId }, relations: ['prisonnier'] });
    if (visite === null) throw new NotFoundException('Demande de visite introuvable');
    if (visite.statut !== 'en_attente') throw new BadRequestException('Cette demande a déjà été traitée');

    if (donnees.decision === 'approuvee') {
      visite.statut = 'approuvee';
      visite.dateVisite = donnees.dateVisite;
      await this.historiqueService.enregistrer( // .enregistrer() pour enregistrer un événement dans la table historique , await parce que c'est une opération asynchrone
        visite.prisonnier,
        'visite',
        `Visite approuvée — ${visite.nomMembreFamille} le ${donnees.dateVisite}`,
      );
    } else if (donnees.decision === 'refusee') {
      visite.statut = 'refusee';
      visite.motifRefus = donnees.motifRefus;
      await this.historiqueService.enregistrer(
        visite.prisonnier,
        'visite',
        `Visite refusée — Motif: ${donnees.motifRefus}`,
      );
    } else {
      throw new BadRequestException('La décision doit être approuvee ou refusee');
    }

    return this.repoVisite.save(visite);
  }

  async listerDemandesEnAttente() {
    return this.repoVisite.find({ where: { statut: 'en_attente' }, relations: ['prisonnier'] });
    // .relations: ['prisonnier'] permet de récupérer les données de la table prisonniers en même temps que les données de la table visites pour
    //  éviter les requêtes multiples et améliorer les performances
  }

  async findAll() {
    return this.repoVisite.find({ relations: ['prisonnier'] });
  }

  async findOne(id: number) {
    const visite = await this.repoVisite.findOne({ where: { id: id }, relations: ['prisonnier'] });
    if (visite === null) throw new NotFoundException('Visite introuvable');
    return visite;
  }

  async creer(donnees: CreerVisiteDto) {
    // async parce que c'est une opération asynchrone pour l'interogation de la base de données car l'interogation de la base de données peut prendre du temps (attente de reponse) et pour que le programme ne se bloque pas il faut utiliser async/await
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });
    if (prisonnier === null) throw new NotFoundException('Prisonnier introuvable');

    const nouvelleVisite = this.repoVisite.create({ // .create() pour créer un nouvel enregistrement dans la table visites
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
    if (visite === null) throw new NotFoundException('Visite introuvable');

    if (donnees.prisonnierId !== undefined && donnees.prisonnierId !== null) {
      const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });
      if (prisonnier === null) throw new NotFoundException('Prisonnier introuvable');
      visite.prisonnier = prisonnier;
    }
    // !== undefined pour dire que le champ a été fourni (il n'est pas vide), si c'est le cas on modifie la valeur de la visite
    if (donnees.nomVisiteur !== undefined) visite.nomVisiteur = donnees.nomVisiteur;
    if (donnees.date !== undefined) visite.date = donnees.date;
    if (donnees.heure !== undefined) visite.heure = donnees.heure;
    if (donnees.duree !== undefined) visite.duree = donnees.duree;

    return this.repoVisite.save(visite);
  }

  async supprimer(id: number) {
    const visite = await this.repoVisite.findOne({ where: { id: id } });
    if (visite === null) throw new NotFoundException('Visite introuvable');
    await this.repoVisite.remove(visite); // .remove() pour supprimer un enregistrement de la table visites
  }
}