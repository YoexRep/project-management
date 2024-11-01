"use client"

import React, { useEffect } from 'react'
import Navbar from "@/components/Navbar";

import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from './redux';

import AuthProvider from "./authProvider";

/*A este compoenente le pasamos un prop, de react node, ya que es el contendor padre de nuestra app, y es por eso que debe recibir los elementos hijos
    como el sidebar, navbar etc.
*/
const DasboardLayout = ({children}: {children: React.ReactNode}) => {


  /*Creamos una variable global, para recuperar nuestro estado
    Esta informacion la sacamos del metodo que definimos en redux.jsx, 
    que practicamente lo que hace es recuperar del localstorage el estado de mi sidebar  

  */
  const isSideBarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const isDarkMode= useAppSelector((state) => state.global.isDarkMode);


  /**Usamos el hook useEffect, para cuando cargue la web, verifiquemos si el estado es darkmode
   * 
   * De esta manera si es darkmode, agregamos a la lista de class, la propiedad dark,
   * por esa razon hemos estado poniendo dark: en tailwind, para esta condicion.
   */
  useEffect(()=>{ 

    if(isDarkMode){
      document.documentElement.classList.add("dark");
    }else{
      document.documentElement.classList.remove("dark");
    }

  })



  return (

    /*Este div define las dimenciones del dasboard, 
    le decimos que queremos que sea flexible, que ocupe todo el ancho y alto, y que el color background sea gray, y el texto*/
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">

            {/*Sidebar */}
            <Sidebar/>

             {/*Le damos la dimesiones del main, dark es una etiqueta nos ayudara luego a cambiar el color de la app, y md, es un media query de css*/}
            <main className={`flex w-full flex-col bg-gray-50 dark:bg-gray-500 ${isSideBarCollapsed ? "" : "md:pl-64"}` } >
          

                    {/*NavBar*/}
                    <Navbar/>
                    {children}
                
                
            </main> 


    </div>
  )
}

const DasboardWrapper = ({children}: {children: React.ReactNode}) => {
  return (

    <StoreProvider>
      <AuthProvider>
      <DasboardLayout>{children}</DasboardLayout>
      </AuthProvider>
    </StoreProvider>
  )
}

export default DasboardWrapper