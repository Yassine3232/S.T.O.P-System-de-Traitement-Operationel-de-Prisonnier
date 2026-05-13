import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrisonniersModule } from './prisonniers/prisonniers.module';
import { CellulesModule } from './cellules/cellules.module';
import { IncidentsModule } from './incidents/incidents.module';
import { VisitesModule } from './visites/visites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellulesSeeder } from './cellules/cellules.seeder';
import { UsersSeeder } from './users/user.seeder';
import { PrisonniersSeeder } from './prisonniers/prisonnier.seeder';
import { HistoriqueModule } from './historique/historique.module';
import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    PrisonniersModule,
    CellulesModule,
    IncidentsModule,
    VisitesModule,
    HistoriqueModule,
  ],
  controllers: [AppController],
  providers: [AppService, CellulesSeeder, UsersSeeder, PrisonniersSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(
    private cellulesSeeder: CellulesSeeder,
    private usersSeeder: UsersSeeder,
    private prisonniersSeeder: PrisonniersSeeder,
  ) {}

  async onModuleInit() {
    await this.cellulesSeeder.seed();
    await this.usersSeeder.seed();
    await this.prisonniersSeeder.seed();
  }
}