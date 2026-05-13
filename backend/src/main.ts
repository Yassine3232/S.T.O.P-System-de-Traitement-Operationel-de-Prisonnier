import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookeSession from 'cookie-session';

async function bootstrap() { //fonction bootstrap permet de demarrer l'application 
  const app = await NestFactory.create(AppModule); //création de l'application 
  app.enableCors({ //permet de configurer le cors 
    origin: true, //permet de configurer l'origine 
    credentials: true, //permet de configurer les cookies 
  });
  app.use(cookeSession({ //permet de configurer les cookies 
    keys: [process.env.SESSION_SECRET ?? 'dev-secret'] //permet de configurer les cookies 
  }));
  app.useGlobalPipes(new ValidationPipe({ //permet de configurer les pipes globaux pour la validation des données 
    whitelist: true, //permet de configurer les pipes globaux pour la validation des données 
    forbidNonWhitelisted: true, //permet de configurer les pipes globaux pour la validation des données 
    transform: true, //permet de configurer les pipes globaux pour la validation des données (conversion auto des données) 
  }));
  await app.listen(process.env.PORT ?? 3000); //permet de demarrer l'application sur le port 3000
}
bootstrap(); //appel de la fonction bootstrap pour demarrer l'application 