import React from 'react'
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
  };

  const Modal = ({ children, isOpen, onClose, name }: Props) => {
    //Si isOpen es false, no devolveremos nada
    
    if (!isOpen) return null;


  
    //Utilizaremos ReacDom, para crear un modal encima de todo.
    return ReactDOM.createPortal(

        //Le agregamos el stilo con tailwind, diciendo que sera overflow, y un bg gray, con opacity, para cuando sea invocado, todo se ponga gris. por detras
      < div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">

        {/**Inside del modal */}
        <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary">

            {/**Aqui reutilizamos el header con botton */}
          <Header
            name={name}
            buttonComponent={
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            }
            isSmallText
          />
          {children}
        </div>
      </div>,
      //ReactDom necesita esta parte
      document.body,
    );
  };

export default Modal