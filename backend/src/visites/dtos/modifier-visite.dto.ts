import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ModifierVisiteDto {
  @IsNumber()
  @IsOptional()
  prisonnierId?: number;

  @IsString()
  @IsOptional()
  nomVisiteur?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  heure?: string;

  @IsString()
  @IsOptional()
  duree?: string;
}
