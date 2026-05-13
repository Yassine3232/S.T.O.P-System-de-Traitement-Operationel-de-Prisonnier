import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  //readonly vs const : readonly pour les proprietes ( variables de la classe ) et const pour les variables globales
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}