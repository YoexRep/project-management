import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
  };

const ListView = ({id, setIsModalNewTaskOpen}: Props) => {


    //Cargamos nuestros task desde nuestra API CALL
    const {
        data: tasks,
        error,
        isLoading,
      } = useGetTasksQuery({ projectId: Number(id) });


      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>An error occurred while fetching tasks</div>;


  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">

           {/**Agregamos el header con titulo List y el boton azul para agregar task */}
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>

        {/**Luego agregamos un grid para cada tamaño de la pantalla */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">

        {/**Colocamos dentro de los grid, cada uno  de los tasks, creamos un componente taskcard para eso. Usando la interfaz de task*/}

        {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
}

export default ListView