import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cellule } from './cellule.entity';
import { CellulesController } from './cellules.controller';
import { CellulesService } from './cellules.service';
import { Prisonnier } from 'src/prisonniers/prisonnier.entity';
import { CellulesSeeder } from './cellules.seeder';
import { UserModule } from '../users/users.module';
import { RolesGuard } from '../guards/roles-guards';

@Module({
  imports: [TypeOrmModule.forFeature([Cellule, Prisonnier]), UserModule],
  controllers: [CellulesController],
  providers: [CellulesService, CellulesSeeder, RolesGuard],
  exports: [TypeOrmModule, CellulesSeeder],
})
export class CellulesModule {}