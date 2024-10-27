import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetTasksQuery } from '@/state/api';
import React from 'react'
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

import { DataGrid, GridColDef } from "@mui/x-data-grid"; //Importamos de material iu data grid para la tabla

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
  };

//Definimos las columnas de mi tabla, deben tener el mismo nombre de mis celdas traidas de mi API CALL
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,

      //Aqui customizamos esta celda para que el contenido aparezca de color verde
      renderCell: (params) => (
        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
          {params.value} 
        </span>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 75,
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 130,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 130,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      renderCell: (params) => params.value?.author || "Unknown", // si queremos customizar una celda en especifico, usamos rendercell
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      renderCell: (params) => params.value?.assignee || "Unassigned",
    },
  ];

const TableView = ({id, setIsModalNewTaskOpen}: Props) => {

    
        //Obtenemos el estado de la variable darkmode, de nuestro estado global usando redux
        const isDarkMode = useAppSelector((state) => state.global.isDarkMode);


        //Obtenemos nuestros tasks usando nuestro API CALL de redux
        const {
          data: tasks,
          error,
          isLoading,
        } = useGetTasksQuery({ projectId: Number(id) });



        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>An error occurred while fetching tasks</div>;
  
    

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
    <div className="pt-5">
      <Header
        name="Table"
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
    <DataGrid
      rows={tasks || []} //Cargamos nuestra data desde nuestra api call
      columns={columns} //Definimos las columnas de la tabla
      className={dataGridClassNames} //Asignamos los estilos desde una lib/utils
      sx={dataGridSxStyles(isDarkMode)} //Algunos estilo no se pueden poner con className, para eso usamos SX
    />
  </div>
  );
}

export default TableView