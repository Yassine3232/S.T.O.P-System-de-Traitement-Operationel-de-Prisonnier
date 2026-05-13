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
  constructor(private visitesService: VisitesService) { }

  @Post('/demande')
  soumettreDemandeVisite(@Body() body: CreerDemandeVisiteDto) {
    return this.visitesService.soumettreDemandeVisite(body);
    //this.visitesService est un paramètre injecté dans le constructeur pour permettre l'accès aux méthodes du service
  }

  @UseGuards(RolesGuard)
  //UseGuards est un décorateur qui permet de protéger une route en utilisant le RolesGuard car c'est une route qui nécessite une authentification (protection)
  @Roles(Profile.Garde, Profile.Directeur)
  //Roles est un décorateur qui permet de spécifier les rôles autorisés à accéder à une route car c'est une route qui nécessite le rôle directeur pour être accédée 
  @Post()
  //Post est un décorateur qui permet de spécifier le type de requête HTTP qui sera acceptée (POST)
  creer(@Body() body: CreerVisiteDto) {
    return this.visitesService.creer(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get()
  //Get est un décorateur qui permet de spécifier le type de requête HTTP qui sera acceptée (GET)
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
    //Param est un décorateur qui permet de spécifier le paramètre de la requête HTTP
    //ParseIntPipe est un transformateur qui convertit le paramètre prisonnierId en nombre entier car 
    //le paramètre est de type string et il faut le convertir en nombre entier pour l'utiliser dans le service
    return this.visitesService.consulterDossierPrisonnier(prisonnierId);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Patch('/:id/repondre')
  repondreDemandeVisite(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RepondreDemandeVisiteDto,
    //Body est un décorateur qui permet de récupérer le corps de la requête HTTP pour le transmettre au service
    //body est un objet de type RepondreDemandeVisiteDto qui contient les données de la requête HTTP
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
