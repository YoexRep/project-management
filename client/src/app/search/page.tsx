"use client"


import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import UserCard from '@/components/UserCard';
import { useSearchQuery } from '@/state/api';
import {debounce} from "lodash"
import React, { useEffect, useState } from 'react'


const Search = () => {



    //Guardamos en estado los terminos de la busqueda, osea lo que escribimos en el input para buscar
    const [searchTerm, setSearchTerm] = useState("");


    //Guardamos en searchResults, los resultados de busqueda, sin embargo le agregamos un skip, mientras en el input no sea mayor a 3, simplemente no hacemos la llamada al api call.
    const {
      data: searchResults,
      isLoading,
      isError,
    } = useSearchQuery(searchTerm, {
      skip: searchTerm.length < 3,
    });


    //Este metodo con debounce de la libreria lodash, es para evitar que se llamae el API cada segundo, sino que haya un delay, entre el tiempo de ejecucion. en este caso 500 milisengundos
    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(event.target.value);
        },
        500,
      );



    //Para evitarque handleSearch se vuelva a llamar, si el usuario se ha ido de la pagina, o si se vuelve a actualizar
      useEffect(() => {
        return handleSearch.cancel;
      }, [handleSearch.cancel]);
    
  

  return (
    <div className="p-8">
      <Header name="Search" />
      
      {/**Caja de busqueda search, que llama a nuestro handleSearch */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>


      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}


        {/**Si no esta cargando, y no hay errores, y hay Resultados, los presntamos en diferentes tarjetas */}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2>Tasks</h2>
            )}

            {/**SearchResulto, nos devuelve 3 resultados de tablas, gracias a nuestro endpoint, task, project y user, que podemos poner en estas card */}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search