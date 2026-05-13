import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cellule } from './cellule.entity';
import { CreateCelluleDto } from './dtos/create-cellule.dto';

@Injectable()
export class CellulesService {
  constructor(
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>
  ) { }

  async create(donnees: CreateCelluleDto) {
    const cellule = await this.findByName(donnees.nom); //chercher si la cellule existe 

    if (cellule !== null) { //si la cellule existe 
      throw new BadRequestException('Cellule existe.'); //lancer une exception 
    }

    const nouveauCellule = this.repoCellules.create({ nom: donnees.nom }); //sinon créer une nouvelle cellule 
    return this.repoCellules.save(nouveauCellule); //sauvegarder la nouvelle cellule 
  }

  async findById(id: number) {
    if (!id) {
      return null; //si l'id est null 
    }
    return this.repoCellules.findOne({ where: { numeroIdentification: id } }); //sinon trouver la cellule par son id 
  }

  async findByName(nom: string) { //chercher la cellule par son nom 
    if (!nom) {
      return null; //si le nom est null 
    }

    return await this.repoCellules.findOne({ where: { nom: nom } }); //sinon trouver la cellule par son nom 
  }

  async findByNameWithPrisonnier(nom: string) {
    if (!nom) {
      return null; //si le nom est null
    }

    return await this.repoCellules.findOne({ //sinon trouver la cellule par son nom et les prisonniers de la cellule 
      where: { nom: nom }, //conditions de recherche 
      relations: ['prisonniers'] //relations avec la table prisonniers
    });
  }

  findAll() {//toute les cellules avec leurs prisonniers
    return this.repoCellules.find({ relations: ['prisonniers'] });//renvoie toutes les cellules avec leurs prisonniers
  }

  async update(id: number, attrs: Partial<Cellule>) {//mise a jour d'une cellule 
    try {
      const cellule = await this.findById(id); //chercher la cellule par son id 

      if (cellule === null) { //si la cellule est null 
        throw new Error('Cellule introuvable'); //lancer une exception 
      }

      if (attrs.nom !== undefined) cellule.nom = attrs.nom; //sinon mettre a jour le nom de la cellule 

      return this.repoCellules.save(cellule); //sauvegarder la cellule
    }
    catch (err) { //si il y a une erreur 
      throw new NotFoundException('Cellule avec l\'id ' + id + ' est introuvable. Impossible de le modifier.'); //lancer une exception 
    }
  }
}
