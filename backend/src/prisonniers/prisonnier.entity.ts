import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cellule } from 'src/cellules/cellule.entity';

@Entity()
export class Prisonnier {
  @PrimaryGeneratedColumn()
  numeroIdentification: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  dateNaissance: string;

  @Column()
  accusation: string;

  @Column()
  dureePeine: number;

  @Column()
  dateArrivee: string;

  @Column()
  dateSortiePrevue: string;

  @Column({ type: 'text', nullable: true })
  photoProfil: string;

  @ManyToOne(() => Cellule, (cellule) => cellule.prisonniers)
  @JoinColumn({ name: 'cellule_name' })
  cellule!: Cellule;
}
