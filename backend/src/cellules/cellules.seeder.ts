import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cellule } from './cellule.entity';

@Injectable()
export class CellulesSeeder {
  constructor(
    @InjectRepository(Cellule)
    private repoCellules: Repository<Cellule>,
  ) { }

  async seed() {
    for (let i = 1; i <= 60; i++) { //boucle for qui permet de créer 60 cellules 
      const nom = `A${i}`;//nom est une variable qui permet de stocker le nom de la cellule 

      // Vérifie si la cellule existe déjà pour éviter les doublons
      const existe = await this.repoCellules.findOneBy({ nom }); //findOneBy est une fonction qui permet de trouver un enregistrement par son nom
      if (!existe) {
        const cellule = this.repoCellules.create({ nom }); //create est une fonction qui permet de créer un enregistrement
        await this.repoCellules.save(cellule); //save est une fonction qui permet de sauvegarder un enregistrement
        console.log(`Cellule ${nom} créée`);
      }
    }
  }
}