import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/encabezado/Encabezado";
import Productos from "./views/Productos";
import Laboratorios from "./views/Laboratorio";
import Presentaciones from "./views/Presentacion";
import Ventas from "./views/Ventas";
import Estadisticas from "./views/Estadisticas";
import RutasProtegidas from "./components/rutas/RutaProtegida";

import './App.css';


const App = () => {
  return (
    <Router>
      <main className="margen-superior-main">
      <Encabezado />

        <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<RutasProtegidas vista={< Inicio />} />} />
        <Route path="/productos" element={<RutasProtegidas vista={<Productos />} />} />
        <Route path="/laboratorios" element={<RutasProtegidas vista={<Laboratorios />} />} />
        <Route path="/presentaciones" element={<RutasProtegidas vista={<Presentaciones />} />} />
        <Route path="/ventas" element={<RutasProtegidas vista={<Ventas />} />} />
         <Route path="/estadisticas" element={<RutasProtegidas vista={<Estadisticas />} />} />



        </Routes>
      </main>
    </Router>
  );
};

export default App;