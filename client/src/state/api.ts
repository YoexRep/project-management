/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

//tipos de datos para nuestros modelos del backend, y poder hacer API CALLAS

export interface Project{
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

//Enum para el estado 
export enum Status{
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed"
}

//enum Priority
export enum Priority{
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog"
}

export interface User{

    userId?: number;
    username: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;

}



export interface Attachment{

    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number;

}

export interface Task{

    id: number;
    title : string;   
    description? : string; 
    status? : Status; 
    priority?: Priority;
     tags?: string;
      startDate?: string; 
      dueDate? : string; 
      points? : number; 
      projectId ?: number; 
      authorUserId? : number;
       assignedUserId? : number;


       author?: User;          
       assignee?: User;           
       comments?: Comment[];
       attachments?:Attachment[];
}

export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
  }

  export interface Team {
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
  }


//Para hacer llamadas API CALLS A Nuestro back usamos este metodo api

export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, 


      //API GATEGAY Authorization, para crear sesiones
      prepareHeaders: async (headers) => {
        const session = await fetchAuthSession();
        const { accessToken } = session.tokens ?? {};
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
      },


    }),

    
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users", "Teams"], //Reduxtool guardar nuestros datos, y la manera en que podemos acceder a ellos es a traves de estos tagstypes

    //Aqui definimos cada uno de los endpoint que queremos llamar.
    endpoints: (build) => ({


        //Creamos este endpoint para obtener los datos desde cognito
        getAuthUser: build.query({
            queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
              try {
                const user = await getCurrentUser();
                const session = await fetchAuthSession();
                if (!session) throw new Error("No session found");
                const { userSub } = session; //Obtenemos el ID del usuario
               // const { accessToken } = session.tokens ?? {}; //El token para crear la sesion como json web token
      
                //Obtenemos la data del usuario en nuestro base de datos
                const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
                const userDetails = userDetailsResponse.data as User;
      
                return { data: { user, userSub, userDetails } };
              } catch (error: any) { 
                return { error: error.message || "Could not fetch user data" };
              }
            },
          }),

        /*Llamamos a nuestro endpoint getprojects, el primer parametro Project[] es nuestro esquema, el segundo es el dato que le enviamos, 
        en este caso void porque no le enviamos nada*/
        getProjects: build.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"], //Este es el primer tag para guardarlo en reduxtool
        }),

        //Llamamos a nuestro endpoint create project
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({

                url: "projects",
                method: "POST", 
                body: project,

            }),
            invalidatesTags: ["Projects"], //Esta instruccion apunta a tagtype, sirve para hacer un refresco de la data, una vez que hayamos hecho una inserccion nueva
        }),


          /*Llamamos a nuestro endpoint getTasks, el primer parametro task[] es nuestro esquema, el segundo es el dato que le enviamos, 
        en este caso es projectId de tipo numerico*/
           getTasks: build.query<Task[], {projectId: number}>({
            query: ({projectId}) => `tasks?projectId=${projectId}`,
           
            //Como tenemos multiple task tenemos que mapearlo de esta manera, por el id 
            providesTags: (result)=> 
                result ? result.map(({id}) => ({type: "Tasks" as const, id}))
                     : [{type: "Tasks" as const}],
        }),



            //Llamamos a nuestro endpoint create task
            createTask: build.mutation<Task, Partial<Task>>({
                query: (task) => ({
    
                    url: "tasks",
                    method: "POST", 
                    body: task,
    
                }),
                invalidatesTags: ["Tasks"], //Esta instruccion sirve para hacer un refresco de la data, una vez que hayamos hecho una inserccion nueva
            }),


            //Llamada del endpoint update
            updateTaskStatus: build.mutation<Task, {taskId: number; status: string}>({
                query: ({taskId, status}) => ({
    
                    url: `tasks/${taskId}/status`,
                    method: "PATCH", 
                    body: {status}, //Le paso el estatus, working, to do etc.
    
                }),
                invalidatesTags: (result, error, {taskId}) => [{type: "Tasks", id: taskId}], //Como task tiene diferentes id, quiero que se actualice unicamente el taskid que le indique
            }),


            search: build.query<SearchResults, string>({
                query: (query) => `search?query=${query}`,
              }),

              getUsers: build.query<User[], void>({
                query: () => "users",
                providesTags: ["Users"],
              }),

              getTeams: build.query<Team[], void>({
                query: () => "teams",
                providesTags: ["Teams"],
              }),
              getTasksByUser: build.query<Task[], number>({
                query: (userId) => `tasks/user/${userId}`,
                providesTags: (result, error, userId) =>
                  result
                    ? result.map(({ id }) => ({ type: "Tasks", id }))
                    : [{ type: "Tasks", id: userId }],
              }),






    }),

});



//Exportarmos las llamadas de nuestro endpoints
export const {useGetProjectsQuery, useCreateProjectMutation, useGetTasksQuery, useCreateTaskMutation, useUpdateTaskStatusMutation, useSearchQuery, useGetUsersQuery, useGetTeamsQuery, useGetTasksByUserQuery, useGetAuthUserQuery} = api