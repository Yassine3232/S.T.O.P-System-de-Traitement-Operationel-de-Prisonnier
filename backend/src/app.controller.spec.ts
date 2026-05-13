import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      // TestingModule est un type générique qui permet de spécifier le type de données que l'on veut injecter car on veut tester l'application 
      // si tout est correct avant de passer à la production
      controllers: [AppController],
      //controllers est un tableau qui contient les contrôleurs de l'application
      providers: [AppService],
      //providers est un tableau qui contient les fournisseurs de l'application
    }).compile();
    //compile est une fonction qui compile le module de test car il est asynchrone 
    // car il doit attendre que le module soit compilé avant de continuer

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    //describe est une fonction qui permet de regrouper les tests selon une categorie
    //root est un objet qui contient les tests de la fonction getHello
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
      //expect est une fonction qui permet de spécifier un test
      //.toBe() est une fonction qui retourne un resultat, il compare le resultat de la fonction getHello avec le resultat attendu 
      //il nous aide à vérifier si l'application fonctionne correctement
    });
  });
});