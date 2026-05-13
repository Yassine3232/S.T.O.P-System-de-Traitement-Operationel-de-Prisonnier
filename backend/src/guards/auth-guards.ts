import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard, ConnectedGuard } from './admin-guards';

export function AllowedLoggedIn() { //décorateur qui permet de vérifier si l'utilisateur est connecté 
  return applyDecorators(
    UseGuards(AdminGuard) //applique le garde admin
  );
}

export function AllowedConnected() { //décorateur qui permet de vérifier si l'utilisateur est connecté
  return applyDecorators(
    UseGuards(ConnectedGuard) //applique le garde connecté
  );
}