import { NestInterceptor, UseInterceptors, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
    new(...args: any[]): {}; //args est un tableau de parametres de type any pour les constructeurs
}

export function Serialize(dto: ClassConstructor) {
    //Serialize est un decorateur qui permet de formater la sortie d'une route en utilisant un DTO (data transfer object)
    return UseInterceptors(new SerializeInterceptor(dto)); //UseInterceptors est un decorateur qui permet d'appliquer un intercepteur a une route
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { } //dto est un parametre de type any qui permet de formater la sortie d'une route

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //ExecutionContext est un objet qui permet de récupérer la requête et la réponse  de la requête
        //CallHandler<any> est un objet qui permet de récupérer la réponse de la requête et la passer a l'intercepteur
        //Observable<any> est un objet qui permet de récupérer la réponse de manière asynchrone
        return next.handle().pipe(
            map(function (data: any) { //map() est une fonction qui permet de transformer chaque element d'un tableau
                return plainToClass(this.dto, data, { //plainToClass est une fonction qui permet de transformer un objet en un autre objet 
                    //excludeExtraneousValues: true permet de supprimer toutes les proprietes de l'objet qui ne sont pas dans le DTO 
                    excludeExtraneousValues: true
                });
            }.bind(this)) //bind(this) est une fonction qui permet de lier le contexte de la fonction map avec le contexte de la classe
        );
    }
}