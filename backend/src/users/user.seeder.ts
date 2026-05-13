import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Profile } from './enum/profile.enum';

@Injectable()
export class UsersSeeder {
  constructor(private authService: AuthService) {}

  async seed() {
    const usersParDefaut = [
      {
        email: 'adamroy7428@gmail.com',
        password: process.env.SEED_PASSWORD ?? '123', // Remplir le fichier .env pour que ça marche, sinon c'est 123 par défaut
        name: 'Adam',
        profile: Profile.Garde,
        dateNaissance: '2005-07-15',
      },
      {
        email: 'royst@videotron.ca',
        password: process.env.SEED_PASSWORD ?? '123', // Remplir le fichier .env pour que ça marche, sinon c'est 123 par défaut
        name: 'Stéphane',
        profile: Profile.Directeur,
        dateNaissance: '1966-07-24',
      },
    ];

    for (const { email, password, name, profile, dateNaissance } of usersParDefaut) {
      try {
        await this.authService.signup(email, password, name, profile, dateNaissance);
        console.log(`Utilisateur "${name}" créé`);
      } catch {
        console.log(`Utilisateur "${name}" est déjà présent dans la base de données`);
      }
    }
  }
}