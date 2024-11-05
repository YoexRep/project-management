
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

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { cognitoId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          cognitoId: cognitoId,
        },
      });
  
      res.json(user);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error retrieving user: ${error.message}` });
    }
  };

  
  
  export const postUser = async (req: Request, res: Response) => {
    try {
      const {
        username,
        cognitoId,
        profilePictureUrl = "i1.jpg",
        teamId = 1,
      } = req.body;
      const newUser = await prisma.user.create({
        data: {
          username,
          cognitoId,
          profilePictureUrl,
          teamId,
        },
      });
      res.json({ message: "User Created Successfully", newUser });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error retrieving users: ${error.message}` });
    }
  };