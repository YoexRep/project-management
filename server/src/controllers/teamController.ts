import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();


    //De esta manera obtenemos, el product owner y project manager de cada team
    const teamsWithUsernames = await Promise.all(

        //Hacemos un map de los teams, y dentro agregamos condicion de busqueda para cada uno.
      teams.map(async (team: any) => {

        //Dentro de team solo tengo el ID foraneo, por lo que hago una especie de inner join, para buscar en user, los datamos del username cuando sea igual a productownerId
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};