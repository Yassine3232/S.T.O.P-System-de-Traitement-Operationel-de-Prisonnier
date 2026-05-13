import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  dateHeure: string;

  @Column()
  rapportePar: string;

  @ManyToMany(() => Prisonnier, { onDelete: 'CASCADE' }) //cascade permet de supprimer tous les incidents liés à un prisonnier si ce dernier est supprimé
  @JoinTable()
  prisonniers: Prisonnier[];
}
