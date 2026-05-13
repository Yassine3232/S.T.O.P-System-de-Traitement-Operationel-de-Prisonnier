import { Controller, Post, Get, Patch, Body, Param, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PrisonniersService } from './prisonniers.service';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';
import { AllowedConnected } from '../guards/auth-guards';
import { RolesGuard } from 'src/guards/roles-guards';
import { Roles } from 'src/users/decorators/permission-user.decorator';
import { Profile } from 'src/users/enum/profile.enum';

@Controller('prisonniers')
export class PrisonniersController {
  constructor(private service: PrisonniersService) {}

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Garde)
  @Post()
  async createPrisonnier(@Body() body: CreatePrisonnierDto) {
    return await this.service.create(body);
  }

  @AllowedConnected()
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Garde,Profile.Directeur)
  @Get('/:id')
  async getPrisonnierById(@Param('id', ParseIntPipe) id: number) {
    const prisonnier = await this.service.findById(id);
    if (!prisonnier) {
      throw new NotFoundException(`Ce prisonnier avec l'id ${id} est introuvable`);
    }
    return prisonnier;
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Garde,Profile.Directeur)
  @Patch('/:id')
  async updatePrisonnier(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
      return await this.service.update(id, body);  
  }

  @AllowedConnected()
  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Post('/liberer-expires')
  async libererExpires() {
    return await this.service.libererExpires();
  }
}
