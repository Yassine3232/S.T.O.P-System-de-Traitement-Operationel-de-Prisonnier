import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';

@Injectable()
export class PrisonniersScheduler {
  constructor(
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async libererPrisonniers() {
    const aujourd_hui = new Date().toISOString().split('T')[0];

    const aLiberer = await this.repoPrisonniers.find({
      where: { dateSortiePrevue: LessThanOrEqual(aujourd_hui) },
    });

    if (aLiberer.length === 0) return;

    await this.repoPrisonniers.remove(aLiberer);
    console.log(`${aLiberer.length} prisonnier(s) libéré(s) automatiquement`);
  }
}