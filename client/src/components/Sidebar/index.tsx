"use client" //Se debe de agregar esto para componentes del lado del cliente, de lo contrario se consideran componentes de servidor.  

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {useState} from 'react'



const Sidebar = () => {

    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, setShowPriority] = useState(true);


    const { data: projects } = useGetProjectsQuery(); //Obtenemos los projectos usando reduxtool, en nuestra api call


  const dispatch = useAppDispatch();

  const isSideBarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    
    //Podemos colocar las clases de tailwind css en una constante tambien. 
    const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black 
    overflow-y-auto bg-white ${isSideBarCollapsed ? "w-0 hidden" : "w-64"}`
    //Agregamos condicion para ocultar el sidebar si esta colapsado

  return (
    <div className={sidebarClassNames}>
      
      <div className='flex h-[100% w-full flex-col justify-start]'>
        
        {/**TOP LOGO */}

        {/** px es padding en x y pt padding en top, z-50 es un idice asignado, w-64 es la anchura */}
        <div className='z-50 flex min-h-[56px] w-64 items center justify-between bg-white px-6 pt-3 dark:bg-black'>

          <div  className='text-xl font-bold text-gray-800 dark:text-white'>
            YOEXLIST

          </div>

          {/**Button para cerar el sidebar, dependiendo si la variable isSidebar es falsa o true, usando el metodo dispach de redux para enviar el cambio de estado */}
          {isSideBarCollapsed ? null : (<button className='py-3' onClick={()=>{ dispatch(setIsSidebarCollapsed(!isSideBarCollapsed))}}> <X className='h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white'/> </button>) }


        </div>


        {/**TEAM LOGO*/}

        <div className='flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700'>

          <Image src="https://pm-s3-yoex-images.s3.us-east-1.amazonaws.com/logo.png" alt='Logo' width={40} height={40}/>


            {/**El atributo tracking wide es espacio entre letras, hay diferentes, widest, normal, tight etc */}
          <div > 
              <h3 className='text-md font-bold tracking-widest dark:text-gray-200'>YOEXTEAM</h3>
            

            {/** mt es margin top */}
              <div className='mt-1 flex items-start gap-2'>

              <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400'/>

              <p className='text-xs text-gray-500'>Private</p>

              </div>
             
             </div>

        </div>


        {/**Navbar links */}

          <nav className='z-10 w-full '>
            <SidebarLink  
              icon={Home}
              label = "Home"
              href="/"

            />
               <SidebarLink  
              icon={Briefcase}
              label = "TimeLine"
              href="/timeline"

            />
               <SidebarLink  
              icon={Search}
              label = "Search"
              href="/search"

            />
               <SidebarLink  
              icon={Settings}
              label = "Settings"
              href="/settings"

            />

            <SidebarLink  
              icon={User}
              label = "Users"
              href="/users"

            />

            <SidebarLink  
              icon={Users}
              label = "Teams"
              href="/teams"

            />

          </nav>


   {/**Projects LINKS */}

    <button onClick={() => setShowProjects((prev) => !prev)} 
      
          className='flex w-full items-center justify-between px-8 py-3 text-gray-500'
      >

      <span className=''>Projects</span>


      {showProjects ? ( <ChevronUp className='h-5 w-5'/>) : (<ChevronDown className='h-5 w-5'/> ) }



      </button>

      {/**PROJECTS LIST */}


      {/**Preguntamos si showprojects esta selccionado, y si tenemos elementos desde nuestra api call projects, para mostrarlos. */}
       {showProjects  && projects?.map((project) => 
      
      <SidebarLink 
      key={project.id}
      icon={Briefcase} 
      label = {project.name}
       href= {`/projects/${project.id}`} />  //Esta url, cuando hacemos clic, next js, redirecciona hacia la carpeta projects con el id dinamico
      
      
      ) } 


        {/**Priority LINKS */}


        <button onClick={() => setShowPriority((prev) => !prev)} 
      
      className='flex w-full items-center justify-between px-8 py-3 text-gray-500'
  >

  <span className=''>Priority</span>


  {showPriority ? ( <ChevronUp className='h-5 w-5'/>) : (<ChevronDown className='h-5 w-5'/> ) }



  </button>


  {showPriority && (

      <>
       <SidebarLink icon={AlertCircle} label = "Urgent" href="/priority/urgent" />
      
       <SidebarLink icon={ShieldAlert} label = "High" href="/priority/high" />  
       <SidebarLink icon={AlertTriangle} label = "Medium" href="/priority/medium" />
       <SidebarLink icon={AlertOctagon} label = "Low" href="/priority/low" />
       <SidebarLink icon={Layers3} label = "Backlog" href="/priority/backlog" />
      </>


  )}

      </div>


    </div>
  )
}


interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({href, icon: Icon, label} : SidebarLinkProps ) => {

  
  //Obtengo la url de mi web
  const pathname = usePathname();

  //Para saber si en la url que estoy es la misma que esta en href
  const isActive = pathname == href ||  (pathname === "/" && href === "/dashboard")




    return (

      <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>

    )


}


export default Sidebar