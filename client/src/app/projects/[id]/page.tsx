"use client";


import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from '../BoardView';
import List from '../ListView';
import TimeLine from '../TimeLineView';
import TableView from '../TableView';
import ModalNewTask from "@/components/ModalNewTask";

type Props = {

    params: {id: string}


}

const Project = ({params}: Props) => {
    const {id} = params;
    const [activeTab, setActiveTab] = useState("Board"); //Para saber que tab esta seleccionado, por defecto estara board, luego list, timeline y table.
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);



  return (
    <div>

        {/**MODAL NEW TASKS -- BOTON PARA CREAR TASKS*/}

         <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id} //Le pasamos el id del projecto traido desde params
      /> 


         <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/> 


        {activeTab === "Board" && (<Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>)}
        {activeTab === "List" && (<List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>)}
        {activeTab === "Timeline" && (<TimeLine id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>)}

        {activeTab === "Table" && (<TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>)}

    </div>
  )
}

export default Project;