/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

//Desde nuestro servicio cognito de AWS, obtenemos el userpoolid y userPooClientId

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});


//Al form le puedo indicar los campos que necesite

const formFields = {
  signUp: {
    username: {
      order: 1, //el primer elemento en mostrarse
      placeholder: "Choose a username", // el place holder del elemento
      label: "Username",
      inputProps: { required: true },
    },
    email: {
      order: 2, //Segundo elemento en mostrarse
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true }, //el tipo  si es requerido
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: { type: "password", required: true },
    },
  },
};


//Usamos el authenticator de AWS para crear nuestro formulario

const AuthProvider = ({ children }: any) => {
  return (
    <div>
      <Authenticator formFields={formFields}>
        {({ user }: any) =>
          user ? (
            <div>{children}</div>
          ) : (
            <div>
              <h1>Please sign in below:</h1>
            </div>
          )
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;