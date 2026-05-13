import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Profile } from '../enum/profile.enum';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signup(email: string, password: string, name: string, profile: Profile, dateNaissance: string) {
    if (profile === Profile.Visiteur) {
      throw new BadRequestException('Les visiteurs ne peuvent pas créer de compte');
    }

    const user = await this.usersService.findByEmail(email);
    if (user !== null) {
      throw new BadRequestException('Email déjà utilisé');
    }
    
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    
    return await this.usersService.create(email, result, name, profile, dateNaissance);
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user === null) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    
    const parts = user.password.split('.');
    const salt = parts[0];
    const storedHash = parts[1];
    
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Mot de passe incorrect');
    }
    
    return user;
  }
}