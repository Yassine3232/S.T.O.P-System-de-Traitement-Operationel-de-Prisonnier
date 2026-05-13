import { BadRequestException, UseGuards } from '@nestjs/common';
import { Controller, Post, Get, Patch, Body, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { CellulesService } from './cellules.service';
import { CreateCelluleDto } from './dtos/create-cellule.dto';
import { AllowedConnected } from '../guards/auth-guards';
import { Profile } from 'src/users/enum/profile.enum';
import { Roles } from 'src/users/decorators/permission-user.decorator';
import { RolesGuard } from 'src/guards/roles-guards';

@Controller('cellules')
export class CellulesController {
  constructor(private service: CellulesService) { }


  @UseGuards(RolesGuard) //RolesGuard decorateur qui permet de specifier que la route est accessible seulement aux utilisateurs connectes 
  @Roles(Profile.Directeur) //Roles decorateur qui permet de specifier que la route est accessible seulement aux utilisateurs connectes 
  @AllowedConnected()   //AllowedConnected() decorateur qui permet de specifier que la route est accessible seulement aux utilisateurs connectes  
  @Post()
  async createCellule(@Body() body: CreateCelluleDto) {
    return await this.service.create(body);
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get('/:id')
  async getCelluleById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Patch('/:id')
  async updateCellule(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return await this.service.update(id, body);
  }
}
