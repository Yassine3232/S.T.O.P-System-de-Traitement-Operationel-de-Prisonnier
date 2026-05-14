import { Injectable } from '@nestjs/common';
import { PrisonniersService } from './prisonniers.service';

@Injectable()
export class PrisonniersSeeder {
  constructor(private prisonniersService: PrisonniersService) { }

  async seed() {
    const prisonniers = [
      {
        nom: 'Tremblay',
        prenom: 'Michel',
        dateNaissance: '1985-03-12',
        accusation: 'Vol à main armée',
        dureePeine: 8,
        dateArrivee: '2020-06-15',
        dateSortiePrevue: '2028-06-15',
        photoProfil: '',
        celluleNom: 'A1',
      },
      {
        nom: 'Gagnon',
        prenom: 'Luc',
        dateNaissance: '1990-07-22',
        accusation: 'Fraude',
        dureePeine: 4,
        dateArrivee: '2022-01-10',
        dateSortiePrevue: '2026-01-10',
        photoProfil: '',
        celluleNom: 'A2',
      },
      {
        nom: 'Lavoie',
        prenom: 'Simon',
        dateNaissance: '1978-11-05',
        accusation: 'Trafic de drogue',
        dureePeine: 12,
        dateArrivee: '2019-03-20',
        dateSortiePrevue: '2031-03-20',
        photoProfil: '',
        celluleNom: 'A3',
      },
      {
        nom: 'Côté',
        prenom: 'Martin',
        dateNaissance: '1995-10-30',
        accusation: 'Vandalisme',
        dureePeine: 2,
        dateArrivee: '2023-05-11',
        dateSortiePrevue: '2025-05-11',
        photoProfil: '',
        celluleNom: 'A1',
      },
      {
        nom: 'Bélanger',
        prenom: 'Éric',
        dateNaissance: '1982-12-14',
        accusation: 'Recel',
        dureePeine: 5,
        dateArrivee: '2021-08-05',
        dateSortiePrevue: '2026-08-05',
        photoProfil: '',
        celluleNom: 'A4',
      },
      {
        nom: 'Pelletier',
        prenom: 'François',
        dateNaissance: '1975-04-18',
        accusation: 'Voies de fait',
        dureePeine: 7,
        dateArrivee: '2018-09-22',
        dateSortiePrevue: '2025-09-22',
        photoProfil: '',
        celluleNom: 'A5',
      },
    ];

    try {
      const res = await fetch('https://randomuser.me/api/?results=100'); //fetch() est une fonction qui permet de faire une requete HTTP a une api externe  
      const data = await res.json(); //res.json() est une fonction qui permet de convertir la reponse en json
      const results = data.results;

      const accusations = ['Vol à main armée', 'Fraude', 'Agression', 'Trafic de drogue', 'Meurtre', 'Cybercriminalité', 'Vandalisme', 'Recel'];
      const cellulesPossibles = Array.from({ length: 60 }, (_, i) => 'A' + (i + 1));

      for (let k = 0; k < results.length; k++) {
        const r = results[k];

        const idxAcc = Math.floor(Math.random() * accusations.length); //idxAcc est un nombre aleatoire entre 0 et 7 
        const accusation = accusations[idxAcc]; //idxAcc est un nombre aleatoire entre 0 et 7 et accusation est le type d'accusation

        const idxCel = Math.floor(Math.random() * cellulesPossibles.length);
        const celluleNom = cellulesPossibles[idxCel]; //idxCel est un nombre aleatoire entre 0 et 9 

        const dureePeine = Math.floor(Math.random() * 20) + 1; //dureePeine est un nombre aleatoire entre 1 et 20

        let dateNaissance = '';
        if (r.dob && r.dob.date) { //r.dob && r.dob.date permet de verifier si la date de naissance existe
          //.dob est un objet qui contient la date de naissance
          //.date est la date de naissance
          //.split('T') permet de separer la date de naissance en deux parties (la date et l'heure)
          dateNaissance = r.dob.date.split('T')[0]; //[0] permet de prendre la date et [1] permet de prendre l'heure
        } else {
          dateNaissance = '1990-01-01';
        }

        let dateArrivee = '';
        if (r.registered && r.registered.date) {
          dateArrivee = r.registered.date.split('T')[0];
        } else {
          dateArrivee = '2023-01-01';
        }

        let anneeArrivee = parseInt(dateArrivee.split('-')[0]); //parseInt permet de convertir une chaine de caractere en nombre entier 
        const dateSortiePrevue = (anneeArrivee + dureePeine) + '-01-01'; //dateSortiePrevue est la date de sortie prevue

        prisonniers.push({
          nom: r.name.last,
          prenom: r.name.first,
          dateNaissance: dateNaissance,
          accusation: accusation,
          dureePeine: dureePeine,
          dateArrivee: dateArrivee,
          dateSortiePrevue: dateSortiePrevue,
          photoProfil: r.picture.large,
          celluleNom: celluleNom,
        });
      }
    } catch (e) {
      console.log("Erreur lors de l'appel a randomuser.me");
    }

    for (let i = 0; i < prisonniers.length; i++) { //boucle sur les prisonniers 
      const donnees = prisonniers[i]; //donnees est un tableau de prisonniers 
      try {
        const existants = await this.prisonniersService.findAll(); //existants est un tableau de prisonniers deja existants 
        let dejaPresent = false; //dejaPresent est un boolean qui permet de savoir si le prisonnier est deja existant

        for (let j = 0; j < existants.length; j++) { //boucle sur les prisonniers deja existants 
          if (existants[j].nom === donnees.nom && existants[j].prenom === donnees.prenom) { //si le nom et le prenom du prisonnier sont les memes que le prisonnier deja existant 
            dejaPresent = true; //dejaPresent devient true 
          }
        }

        if (dejaPresent === false) { //si le prisonnier n'est pas deja existant 
          let cree = false; //cree est un boolean qui permet de savoir si le prisonnier a ete cree
          let tentatives = 0; //tentatives est un nombre de tentatives de creation
          const cellulesPossibles = Array.from({ length: 60 }, (_, i) => 'A' + (i + 1)); //cellulesPossibles est un tableau de cellules possibles

          while (cree === false && tentatives <= cellulesPossibles.length) { //boucle sur les tentatives de creation
            try {
              await this.prisonniersService.create(donnees); //creation du prisonnier
              console.log('Prisonnier "' + donnees.prenom + ' ' + donnees.nom + '" créé dans ' + donnees.celluleNom); //affichage du prisonnier cree
              cree = true; //cree devient true
            } catch (e: any) {
              if (e.message && e.message.includes('pleine')) { //si le message d'erreur contient "pleine" 
                if (tentatives < cellulesPossibles.length) { //si le nombre de tentatives est inferieur au nombre de cellules possibles 
                  donnees.celluleNom = cellulesPossibles[tentatives]; //donnees.celluleNom prend la valeur de la cellule possible 
                  tentatives++; //tentatives est incremente 
                } else {
                  console.log('Toutes les cellules sont pleines !'); //affichage du message d'erreur 
                  break; //break permet de sortir de la boucle 
                }
              } else {
                console.log('Erreur lors de la création du prisonnier "' + donnees.prenom + ' ' + donnees.nom + '"'); //affichage du message d'erreur 
                break; //break permet de sortir de la boucle 
              }
            } //fin du while
          }
        } else { //si le prisonnier est deja existant 
          let prisonnierId = 0; //prisonnierId est un nombre qui permet de stocker l'id du prisonnier 
          for (let j = 0; j < existants.length; j++) { //boucle sur les prisonniers deja existants 
            if (existants[j].nom === donnees.nom && existants[j].prenom === donnees.prenom) { //si le nom et le prenom du prisonnier sont les memes que le prisonnier deja existant 
              prisonnierId = existants[j].numeroIdentification; //prisonnierId prend la valeur de l'id du prisonnier 
            }
          }

          let misAJour = false; //misAJour est un boolean qui permet de savoir si le prisonnier a ete mis a jour 
          let tentatives = 0; //tentatives est un nombre de tentatives de mise a jour 
          const cellulesPossibles = Array.from({ length: 60 }, (_, i) => 'A' + (i + 1)); //cellulesPossibles est un tableau de cellules possibles

          while (misAJour === false && tentatives <= cellulesPossibles.length) { //boucle sur les tentatives de mise a jour
            try {
              await this.prisonniersService.update(prisonnierId, { celluleNom: donnees.celluleNom } as any); //mise a jour du prisonnier
              console.log('Prisonnier "' + donnees.prenom + ' ' + donnees.nom + '" existe déjà, cellule mise à jour (' + donnees.celluleNom + ')'); //affichage du prisonnier mis a jour 
              misAJour = true; //misAJour devient true
            } catch (e: any) { //catch est utilise pour capturer les erreurs 
              if (e.message && e.message.includes('pleine')) { //si le message d'erreur contient "pleine" 
                if (tentatives < cellulesPossibles.length) { //si le nombre de tentatives est inferieur au nombre de cellules possibles 
                  donnees.celluleNom = cellulesPossibles[tentatives]; //donnees.celluleNom prend la valeur de la cellule possible 
                  tentatives++; //tentatives est incremente 
                } else {
                  console.log('Toutes les cellules sont pleines !'); //affichage du message d'erreur 
                  break; //break permet de sortir de la boucle 
                }
              } else {
                console.log('Erreur lors de la mise à jour du prisonnier "' + donnees.prenom + ' ' + donnees.nom + '"'); //affichage du message d'erreur 
                break; //break permet de sortir de la boucle 
              }
            } //fin du while
          }
        } //fin du else
      } catch (e) { //catch est utilise pour capturer les erreurs 
        console.log('Erreur fatale lors du traitement de ' + donnees.prenom + ' ' + donnees.nom); //affichage du message d'erreur 
      }
    }
  }
}