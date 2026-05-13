import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Visite {
  @PrimaryGeneratedColumn() // @PrimaryGeneratedColumn() est un décorateur qui permet de spécifier que le champ id est une clé primaire auto-incrémentée
  id: number;

  @Column({ nullable: true })
  nomMembreFamille: string;

  @Column({ nullable: true })
  lienFamilial: string;

  @Column({ default: 'en_attente' })
  statut: string;

  @Column({ nullable: true })
  dateVisite: string;

  @Column({ nullable: true })
  nomVisiteur: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  heure: string;

  @Column({ nullable: true })
  duree: string;

  @Column({ nullable: true })
  motifRefus: string;

  @ManyToOne(() => Prisonnier, { onDelete: 'CASCADE' })
  //ManytoOne lie la table visites à la table prisonniers
  //cascade permet de spécifier que le champ prisonnier est une clé étrangère de la table visites et qu'elle est liée à la table prisonniers
  @JoinColumn()
  prisonnier: Prisonnier;
}
