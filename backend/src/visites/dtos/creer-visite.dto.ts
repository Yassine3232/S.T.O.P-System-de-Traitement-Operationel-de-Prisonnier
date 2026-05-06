import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreerVisiteDto {
  @IsNumber()
  @IsNotEmpty()
  prisonnierId: number;

  @IsString()
  @IsNotEmpty()
  nomVisiteur: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  heure: string;

  @IsString()
  @IsNotEmpty()
  duree: string;
}
