import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Visite {
  @PrimaryGeneratedColumn()
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

  @ManyToOne(() => Prisonnier)
  @JoinColumn()
  prisonnier: Prisonnier;
}
