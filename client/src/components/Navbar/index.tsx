import React from 'react'
import {Menu, Moon, Search, Settings, Sun} from "lucide-react";
import Link from "next/link"
import { useAppDispatch,  useAppSelector} from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';

const Navbar = () => {


        const dispatch = useAppDispatch();

        const isSideBarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

        const isDarkMode= useAppSelector((state) => state.global.isDarkMode);
      




  return (


    //Cuerpo del navbar
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">

            {/*Search Bar -- cada elemento estara centralizado con un espacio de 8*/}
            <div className="flex items-center gap-8">


                {/**Preguntamos si el sidebar esta cerrado, para colocar el boton del menu, el cual me permita setear las variables a traves de mi metodo dispatch de redux */}
                {!isSideBarCollapsed ? null : (

                                <button onClick={() => dispatch(setIsSidebarCollapsed(!isSideBarCollapsed))}>

                                                <Menu className='h-8 w-8 dark:text-white'/>


                                </button>

                )}


                            {/*Este es el contenedor de nuestra caja de buscador, es relativo ya que adapta el tamaño del padre*/}
                    <div className="relative flex h-min w-[200px]">

                            {/* Formateamos con tailwind nuestro icono search, haciendo que cuando pasemos le mouse por encima sea un pointer */}
                            <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/x transform cursor-pointer dark:text-white"/>


                            {/**El input que se usara para escribir en nuestro search */}
                            <input className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark: text-black dark: dark:placeholder-white" type="search" placeholder="Search..."></input>

                    </div>


            </div>


            {/**Icons */}

                {/**Setting */}
                <div className='flex items-center'>


                {/**Buton dark mode */}
                <button onClick={() => dispatch(setIsDarkMode(!isDarkMode))} 
                
                className={isDarkMode 
                        ? `rounded p-2 dark:hover:bg-gray-700`
                        :`rounded p-2 hover:bg-gray-100`
                
                }> 

                {/**Imagen de nuestro icono */}

                {isDarkMode ? (

                                <Sun className="h-6 w-6 cursosr-pointer dark:text-white"/>


                ) : (

                        <Moon className="h-6 w-6 cursosr-pointer dark:text-white"/>


                )}
                
                
                
                </button>


                <Link href='/settings'    
                
                className={isDarkMode 
                        ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                        :`h-min w-min rounded p-2 hover:bg-gray-100`
                
                }>
                
                        <Settings className='h-6 w-6 cursor-pointer dark:text-white'/>
                
                
                </Link>

                {/**Linea divisora */}
                <div className='ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block'></div>


            </div>


    </div>
  )
}

export default Navbar