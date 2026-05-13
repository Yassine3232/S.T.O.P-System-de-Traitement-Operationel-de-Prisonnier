import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historique } from './historique.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Injectable()
export class HistoriqueService {
  constructor(
    @InjectRepository(Historique)
    private repoHistorique: Repository<Historique>,
  ) { }

  async enregistrer(prisonnier: Prisonnier, typeEvenement: string, description: string) {
    const entree = this.repoHistorique.create({
      prisonnier,
      typeEvenement,
      description,
      date: new Date().toISOString(),
      // new Date().toISOString() permet de convertir la date en chaine de caractere pour que tu puisse l'enregistrer dans la base de données 
    });
    return this.repoHistorique.save(entree); //.save() permet d'enregistrer l'entree dans la base de données (async)
  }

  async trouverParPrisonnier(prisonnierId: number) {
    return this.repoHistorique.find({
      where: { prisonnier: { numeroIdentification: prisonnierId } },
      order: { date: 'DESC' }, //.order() permet de trier les enregistrements selon une condition 
    });
  }
}