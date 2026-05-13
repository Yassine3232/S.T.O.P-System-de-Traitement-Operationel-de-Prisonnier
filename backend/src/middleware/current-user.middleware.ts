import {  Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "src/users/users.service";

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware{
    constructor(private useService : UserService){}

    async use(req:any,res:any,next:(error?:any) => void){ //use() est une methode qui permet de recuperer la requete et la reponse 
        //requis est un objet qui permet de recuperer la requete
        //res est un objet qui permet de recuperer la reponse
        //next est une fonction qui permet de passer a la prochaine methode
        const {userId} = req.session //userId est une variable qui permet de recuperer l'id de l'utilisateur

        if(userId){ //si l'utilisateur est connecte
            const user=await this.useService.findById(userId) //user est une variable qui permet de recuperer l'utilisateur
            req.session.CurrentUser = user; //CurrentUser est une variable qui permet de recuperer l'utilisateur connecté
        }

        next() //next() est une fonction qui permet de passer a la prochaine methode
    }
}