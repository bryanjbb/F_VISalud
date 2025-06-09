import React from "react";
import { Navigate } from "react-router-dom";

const RutasProtegidas = ({vista}) => {
    const estadoLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

     console.log("Usuario autenticado:", estadoLogueado);

     return estadoLogueado ? vista : <Navigate to="/" replace />
    
};

export default RutasProtegidas;
