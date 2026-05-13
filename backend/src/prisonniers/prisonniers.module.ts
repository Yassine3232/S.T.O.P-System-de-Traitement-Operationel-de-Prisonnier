import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prisonnier } from './prisonnier.entity';
import { PrisonniersService } from './prisonniers.service';
import { PrisonniersController } from './prisonniers.controller';
import { Cellule } from '../cellules/cellule.entity';
import { RolesGuard } from '../guards/roles-guards';
import { UserModule } from '../users/users.module';
import { PrisonniersSeeder } from './prisonnier.seeder';
import { HistoriqueModule } from '../historique/historique.module';
import { PrisonniersScheduler } from './prisonniers.scheduler';


@Module({
  imports: [TypeOrmModule.forFeature([Prisonnier, Cellule]), UserModule, HistoriqueModule],
  providers: [PrisonniersService, RolesGuard, PrisonniersSeeder, PrisonniersScheduler],
  controllers: [PrisonniersController],
  exports: [TypeOrmModule, PrisonniersSeeder, PrisonniersService],
})
export class PrisonniersModule { }