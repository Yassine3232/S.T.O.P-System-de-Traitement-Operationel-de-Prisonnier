import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../users/users.service';
import { Profile } from '../users/enum/profile.enum';

@Injectable()
export class RolesGuard implements CanActivate { //implémente l'interface CanActivate
  constructor(
    private reflector: Reflector, //Reflector est un décorateur qui permet de récupérer les métadonnées d'une route
    private userService: UserService, //UserService est un service qui permet de récupérer les informations de l'utilisateur
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequis = this.reflector.get<Profile[]>('roles', context.getHandler()); //récupération des rôles requis
    // .getHandler() permet de récupérer le gestionnaire de la requête la fonction du controller qui va etre executee
    // par exemple create(@Body() body: CreerVisiteDto) 
    if (!rolesRequis) return true; //si aucun rôle requis, renvoie true

    const request = context.switchToHttp().getRequest(); //récupération de la requête 
    const userId = request.session?.userId; //récupération de l'utilisateur

    if (!userId) throw new ForbiddenException('Accès refusé : rôle insuffisant'); //si l'utilisateur n'est pas connecté 

    const user = await this.userService.findById(userId); //recherche l'utilisateur

    if (!user || !rolesRequis.includes(user.profile)) { //si l'utilisateur n'a pas le rôle requis
      throw new ForbiddenException('Accès refusé : rôle insuffisant'); //lancer une exception 
    }

    return true; //sinon renvoie true 
  }
}