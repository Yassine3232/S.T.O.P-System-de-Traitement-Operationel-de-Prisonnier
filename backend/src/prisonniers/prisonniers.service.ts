import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';
import { Cellule } from 'src/cellules/cellule.entity';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class PrisonniersService {
  constructor(
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>,
    private historiqueService: HistoriqueService,
  ) { }

  async create(donnees: CreatePrisonnierDto) { //fonction create permet de créer un prisonnier
    const cellule = await this.repoCellules.findOne({ where: { nom: donnees.celluleNom } });//chercher la cellule par son nom 
    if (!cellule) throw new NotFoundException(`Cellule "${donnees.celluleNom}" introuvable`);//si la cellule est introuvable lancer une exception 

    const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any });//nombre de prisonniers dans la cellule 
    if (nbPrisonniers >= 2) throw new Error('La cellule ' + donnees.celluleNom + ' est pleine (limite de 2).');//si le nombre de prisonniers est superieur a 2 lancer une exception 

    const nouveauPrisonnier = this.repoPrisonniers.create({//créer un nouveau prisonnier
      nom: donnees.nom,
      prenom: donnees.prenom,
      dateNaissance: donnees.dateNaissance,
      accusation: donnees.accusation,
      dureePeine: donnees.dureePeine,
      dateArrivee: donnees.dateArrivee,
      dateSortiePrevue: donnees.dateSortiePrevue,
      cellule: cellule,
    });

    const sauvegarde = await this.repoPrisonniers.save(nouveauPrisonnier); //sauvegarder le nouveau prisonnier 

    await this.historiqueService.enregistrer( //enregistrement de l'action dans l'historique 
      sauvegarde,
      'creation', //type d'action 
      `Dossier créé — Cellule: ${cellule.nom}` //description de l'action 
    );

    return sauvegarde; //retourner le nouveau prisonnier
  }

  async findById(id: number) { //fonction findById permet de trouver un prisonnier par son id
    if (!id) return null; //si l'id est null retourner null
    return await this.repoPrisonniers.findOne({ where: { numeroIdentification: id }, relations: ['cellule'] }); //rechercher le prisonnier par son id et retourner le
  }

  async findAll() { //fonction findAll permet de trouver tous les prisonniers
    return this.repoPrisonniers.find({ relations: ['cellule'] }); //rechercher tous les prisonniers et retourner les cellules avec
  }

  async update(id: number, attrs: Partial<Prisonnier> & { celluleNom?: string }) { //fonction update permet de modifier un prisonnier
    const prisonnier = await this.findById(id); //rechercher le prisonnier par son id 
    if (!prisonnier) throw new NotFoundException('Prisonnier introuvable'); //si le prisonnier est introuvable lancer une exception 

    const modifications: string[] = []; //tableau qui permet de stocker les modifications

    if (attrs.nom !== undefined) { modifications.push(`Nom: ${prisonnier.nom} → ${attrs.nom}`); prisonnier.nom = attrs.nom; } //si l'attribut nom est modifié enregistre la modification 
    if (attrs.prenom !== undefined) { modifications.push(`Prénom: ${prisonnier.prenom} → ${attrs.prenom}`); prisonnier.prenom = attrs.prenom; } //si l'attribut prenom est modifié enregistre la modification 
    if (attrs.dateNaissance !== undefined) { prisonnier.dateNaissance = attrs.dateNaissance; } //si l'attribut dateNaissance est modifié enregistre la modification 
    if (attrs.accusation !== undefined) { modifications.push(`Accusation: ${prisonnier.accusation} → ${attrs.accusation}`); prisonnier.accusation = attrs.accusation; } //si l'attribut accusation est modifié enregistre la modification 
    if (attrs.dureePeine !== undefined) { modifications.push(`Durée peine: ${prisonnier.dureePeine} → ${attrs.dureePeine}`); prisonnier.dureePeine = attrs.dureePeine; } //si l'attribut dureePeine est modifié enregistre la modification 
    if (attrs.dateArrivee !== undefined) { prisonnier.dateArrivee = attrs.dateArrivee; } //si l'attribut dateArrivee est modifié enregistre la modification 
    if (attrs.dateSortiePrevue !== undefined) { modifications.push(`Sortie prévue: ${prisonnier.dateSortiePrevue} → ${attrs.dateSortiePrevue}`); prisonnier.dateSortiePrevue = attrs.dateSortiePrevue; } //si l'attribut dateSortiePrevue est modifié enregistre la modification 

    const anyAttrs: any = attrs; //anyAttrs est une variable qui permet de stocker les attributs modifiés
    if (anyAttrs.celluleNom !== undefined) { //si l'attribut celluleNom est modifié enregistre la modification 
      const cellule = await this.repoCellules.findOne({ where: { nom: anyAttrs.celluleNom } }); //rechercher la cellule par son nom 
      if (cellule !== null) { //si la cellule est trouvée 
        if (prisonnier.cellule?.numeroIdentification !== cellule.numeroIdentification) { //si la cellule est differente de la precedente 
          const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any }); //compter le nombre de prisonniers dans la cellule 
          if (nbPrisonniers >= 2) throw new Error('La cellule ' + anyAttrs.celluleNom + ' est pleine (limite de 2).'); //si le nombre de prisonniers est superieur a 2 lancer une exception 
          modifications.push(`Cellule changée: ${prisonnier.cellule?.nom} → ${cellule.nom}`); //enregistre la modification 
        }
        prisonnier.cellule = cellule; //assigne la nouvelle cellule au prisonnier 
      }
    }

    const sauvegarde = await this.repoPrisonniers.save(prisonnier); //sauvegarde les modifications

    if (modifications.length > 0) { //si des modifications ont été enregistrées
      await this.historiqueService.enregistrer( //enregistrement de l'action dans l'historique 
        sauvegarde,
        'modification', //type d'action
        modifications.join(', '), //description de l'action 
      );
    }

    return sauvegarde; //retourner le prisonnier modifié 
  }

  async libererExpires() { //fonction libererExpires permet de libérer les prisonniers dont la date de sortie est dépassée
    const aujourd_hui = new Date().toISOString().split('T')[0]; //date d'aujourd'hui

    const aLiberer = await this.repoPrisonniers.find({
      where: { dateSortiePrevue: LessThanOrEqual(aujourd_hui) }, //rechercher les prisonniers dont la date de sortie est dépassée
    });

    if (aLiberer.length === 0) return { message: 'Aucun prisonnier à libérer' }; //si aucun prisonnier à libérer retourner un message

    await this.repoPrisonniers.remove(aLiberer); //supprimer les prisonniers

    return { message: `${aLiberer.length} prisonnier(s) libéré(s)` }; //retourner un message qui contient le nombre de prisonniers libérés
  }
}