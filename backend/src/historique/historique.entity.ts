import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity() //Entity decorateur qui permet de specifier que la classe est une entite 
export class Historique { //classe qui permet de stocker l'historique d'un prisonnier 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeEvenement: string;

  @Column('text')
  description: string;

  @Column()
  date: string;

  @ManyToOne(() => Prisonnier, { onDelete: 'CASCADE' })
  @JoinColumn()
  prisonnier: Prisonnier;
}