import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { VisitesService } from './visites.service';
import { CreerDemandeVisiteDto } from './dtos/creer-demande-visite.dto';
import { RepondreDemandeVisiteDto } from './dtos/repondre-demande-visite.dto';
import { CreerVisiteDto } from './dtos/creer-visite.dto';
import { ModifierVisiteDto } from './dtos/modifier-visite.dto';
import { Profile } from 'src/users/enum/profile.enum';
import { Roles } from 'src/users/decorators/permission-user.decorator';
import { RolesGuard } from 'src/guards/roles-guards';

@Controller('visites')
export class VisitesController {
  constructor(private visitesService: VisitesService) {}

  @Post('/demande')
  soumettreDemandeVisite(@Body() body: CreerDemandeVisiteDto) {
    return this.visitesService.soumettreDemandeVisite(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Post()
  creer(@Body() body: CreerVisiteDto) {
    return this.visitesService.creer(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get()
  findAll() {
    return this.visitesService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Get('/en-attente')
  listerDemandesEnAttente() {
    return this.visitesService.listerDemandesEnAttente();
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Get('/dossier/:prisonnierId')
  consulterDossier(@Param('prisonnierId', ParseIntPipe) prisonnierId: number) {
    return this.visitesService.consulterDossierPrisonnier(prisonnierId);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Patch('/:id/repondre')
  repondreDemandeVisite(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RepondreDemandeVisiteDto,
  ) {
    return this.visitesService.repondreDemandeVisite(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Patch('/:id')
  modifier(@Param('id', ParseIntPipe) id: number, @Body() body: ModifierVisiteDto) {
    return this.visitesService.modifier(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Delete('/:id')
  supprimer(@Param('id', ParseIntPipe) id: number) {
    return this.visitesService.supprimer(id);
  }
}
