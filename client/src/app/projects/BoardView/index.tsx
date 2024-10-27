import { useGetTasksQuery, useUpdateTaskStatusMutation, Task as TaskType} from '@/state/api';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import React from 'react'
import {DndProvider, useDrop, useDrag} from "react-dnd"; //Librera para el drag and drop function
import {HTML5Backend} from "react-dnd-html5-backend";
import {format} from "date-fns";
import Image from 'next/image';


//BoardView -- Componente contenedor de nuestros columns tasks y los tasks
type BoardProps = {

    id:string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;

}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({id, setIsModalNewTaskOpen}: BoardProps) => {


    //Obtenemos todos los tasks desde nuestro api CALL
    const {data: tasks, isLoading, error} = useGetTasksQuery({projectId: Number(id)});



    
    // Obtenemos el metodo de nuestra api para actualizar estados de task
    const [updateTaskStatus] = useUpdateTaskStatusMutation();


    //Metodo para actualizar el estado del task llamando a nuestra api call
    const moveTask= (taskId: number, toStatus: string) =>{

        updateTaskStatus({taskId, status: toStatus});

    }

    if(isLoading) return <div>Loading...</div>

    if(error) return <div>An error occured while fetching tasks...</div>

  return (

    //Etiqueta para agregar funcionalidad Drag and drop a nuestro componente tasColumn
   <DndProvider backend={HTML5Backend}> 

        <div className='grid grid-cols-q gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>

        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}


        </div>

   </DndProvider>
  )
}


//TaskColumn - Componente de las columnas tasks.
type TaskColumnProps = {
    status: string;
    tasks: TaskType[];
    moveTask: (taskId: number, toStatus: string) => void;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
  };
  
  const TaskColumn = ({
    status,
    tasks,
    moveTask,
    setIsModalNewTaskOpen,
  }: TaskColumnProps) => {

    //Estos son los metodos, o hooks para hacer uso del drag and drop function
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: (item: { id: number }) => moveTask(item.id, status), //Llamamos a movetask que es la encargada de ejecutar nuestro metodo del backend, para actualizar el estado
      collect: (monitor: any) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
    
    //Otener la cantidad de tareas por columna
    const tasksCount = tasks.filter((task) => task.status === status).length;

    //Colores de nuestro estados.
    const statusColor: any = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        Completed: "#000000",
      };

      return (

          //Para el return de nuestro task column, se debe envolver en esta ref drop
        <div     ref={(instance) => {
            drop(instance);
          }}
          className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
        >


      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
            <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">


            {/**Eiquetas de las columnas */}
            <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            

            {/**Agregamos el contador de tareas a las etiquetas */}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
            </h3>

            <div className="flex items-center gap-1">

            {/**Agregamos 3 puntos al final de las columnas de tareas */}
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>

            {/**Agregamos signo de mas al final de las columnas de tareas, con el metodo onClic para agregar un nuevo tasks a traves de una ventana modal*/}
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
            
            </div>

            </div>

        

          
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}



        </div>
      )

}

//Task-- Componente tasks para cada una de las tareas
type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {



  //Hook de Dnd, para agarrar nuestros compoenentes, esta en la documentacion de dnd, por que se debe usar asi. 
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));



  /**Caracteristicas de nuestras tags tasks**/



    //Etiquetas de para el area de los tasks, deployment, networking, design, infrature, etc
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];


  const formattedStartDate = task.startDate
  ? format(new Date(task.startDate), "P")
  : "";

  const formattedDueDate = task.dueDate
  ? format(new Date(task.dueDate), "P")
  : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;


  //Etiquetas de prioridad, que cambia de color dependiendo la prioridad
  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );


return(

    <div    
    
    //Para el return de nuestro task, se debe envolver en esta ref drag
      ref={(instance) => {
         drag(instance);
      }}

      //Este clasname es el que le da el estilo a nuestras tarjetas tasks, y cuando esta siendo dragging, se pone opaco.
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}>


      {/**Imagne de la task */}
    {task.attachments && task.attachments.length > 0 && (
        <Image

          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}


       {/**Imagne de la task */}
      <div className="p-4 md:p-6">

        <div className="flex items-start justify-between">

          <div className="flex flex-1 flex-wrap items-center gap-2">

             {/**Etiqueta de prioridad a color*/}

            {task.priority && <PriorityTag priority={task.priority} />}


            {/**Etiqueta del area del task*/}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {" "}
                  {tag}
                </div>
              ))}
            </div>

        </div>

                  {/**3 Puntos al final de cada task*/}
        <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} /> 
          </button>

        </div>


         {/**Nombre del tasks*/}

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>


            {/**Puntos de los tasks*/}
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

          
          {/**Fecha de los tasks*/}

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        {/**descripcion de los tasks*/}
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>


        {/**Linea de sombra al final de cada tasks, toquete estetico*/}
        
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

           
        <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-[6px] overflow-hidden"> 
              {/* Circulo para la imagen de la persona qu se le asigno */}
        {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}


                {/* Circulo para la imagen del creador de la tarea */}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}

        </div>


             {/* Iconos de comentarios */}
        <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>



        </div>

      </div>










    </div>
    
  
  )

}


   

export default BoardView;