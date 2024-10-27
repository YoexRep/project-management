
import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { json } from "body-parser";


const prisma = new PrismaClient();

export const getTasks = async(req: Request, res: Response) : Promise <void> =>{

    const {projectId} = req.query; // Para obtener el tasks necesito el id del proyecto, asi que para eso, com oesto es un get, lo obtengo en el query, en vez del body.
    //Importante el nombre tiene que ser igual que el atributo, o de lo contrario dara error. antes tenia prokect escrito y no llegaba el valor
    try{

        //Podemos crear instrucciones con prisma para hacer una especie de query desde aqui. Sin usar SQL
        const tasks = await prisma.task.findMany({

            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            }
        })


        res.json(tasks);
    }catch(error: any){
        res.status(500).json({message: `Error retrieving tasks: ${error.message}`});
    }
}


export const createTask = async(req: Request, res: Response) : Promise <void> =>{



    const {title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId   } = req.body;
    try{
        const newTask = await prisma.task.create({
            data:{
                title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId 
            }
        })
        res.status(201).json(newTask);

    }catch(error: any){
        res.status(500).json({message: `Error creating a task: ${error.message}`});
    }
}


export const updateTaskStatus = async(req: Request, res: Response) : Promise <void> =>{

    const {taskId} = req.params; //En este caso le pasamos el taskId por parametro
    const {status} = req.body; // y el status en el body

    try{

        const updatedtasks = await prisma.task.update({

            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
           
            }
        })


        res.json(updatedtasks);
    }catch(error: any){
        res.status(500).json({message: `Error updating task: ${error.message}`});
    }
}

export const getUserTasks = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { userId } = req.params;
    try {
      const tasks = await prisma.task.findMany({
        where: {
          OR: [
            { authorUserId: Number(userId) },
            { assignedUserId: Number(userId) },
          ],
        },
        include: {
          author: true,
          assignee: true,
        },
      });
      res.json(tasks);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error retrieving user's tasks: ${error.message}` });
    }
  };