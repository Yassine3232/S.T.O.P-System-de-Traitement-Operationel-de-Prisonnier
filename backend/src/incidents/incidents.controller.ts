import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreerIncidentDto } from './dtos/creer-incident.dto';
import { Profile } from 'src/users/enum/profile.enum';
import { Roles } from 'src/users/decorators/permission-user.decorator';
import { RolesGuard } from 'src/guards/roles-guards';

@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) { }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Post()
  creerIncident(@Body() body: CreerIncidentDto) {
    return this.incidentsService.creerIncident(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get()
  listerIncidents() {
    return this.incidentsService.trouverTous();
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get('/:id')
  voirIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentsService.trouverParId(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Delete('/:id')
  supprimerIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentsService.supprimer(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Patch('/:id')
  modifierIncident(@Param('id', ParseIntPipe) id: number, @Body() body: CreerIncidentDto) {
    return this.incidentsService.modifierIncident(id, body);
  }
}