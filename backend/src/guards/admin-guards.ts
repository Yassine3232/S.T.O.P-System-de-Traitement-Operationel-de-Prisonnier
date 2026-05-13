import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Profile } from '../users/enum/profile.enum';


@Injectable()
export class AdminGuard implements CanActivate { //implémente l'interface CanActivate
  canActivate(context: ExecutionContext): boolean { //méthode qui permet de vérifier si l'utilisateur a accès à la ressource
    const request = context.switchToHttp().getRequest(); //récupération de la requête 

    const user = request.session?.CurrentUser; //récupération de l'utilisateur

    if (!user) { //si l'utilisateur n'est pas connecté
      console.log('Guard Blocked: No user in session');
      return false; //renvoie false
    }

    if (user.profile === Profile.Directeur) { //si l'utilisateur est connecté et a le profil directeur
      return true;
    } 

    console.log(`Garde bloqué : L'utilisateur ${user.id} n'est pas un administrateur`);
    return false;
  }
}

@Injectable()
export class ConnectedGuard implements CanActivate { //implémente l'interface CanActivate
  canActivate(context: ExecutionContext): boolean { //méthode qui permet de vérifier si l'utilisateur a accès à la ressource
    const request = context.switchToHttp().getRequest(); //récupération de la requête 
    const user = request.session?.CurrentUser; //récupération de l'utilisateur

    if (!user) { //si l'utilisateur n'est pas connecté 
      return false; //renvoie false
    }

    return true; //sinon renvoie true 
  }
}