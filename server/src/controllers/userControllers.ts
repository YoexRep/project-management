
import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { json } from "body-parser";


const prisma = new PrismaClient();

export const getUsers = async(req: Request, res: Response) : Promise <void> =>{


    try{

        //Podemos crear instrucciones con prisma para hacer una especie de query desde aqui. Sin usar SQL
        const users = await prisma.user.findMany({ });



        res.json(users);
    }catch(error: any){
        res.status(500).json({message: `Error retrieving users: ${error.message}`});
    }
}