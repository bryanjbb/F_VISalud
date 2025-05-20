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

import './App.css';


const App = () => {
  return (
    <Router>
      <main className="margen-superior-main">
      <Encabezado />

        <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/laboratorios" element={<Laboratorios />} />
        <Route path="/presentaciones" element={<Presentaciones />} />
        <Route path="/ventas" element={<Ventas />} />
         <Route path="/estadisticas" element={<Estadisticas />} />



        </Routes>
      </main>
    </Router>
  );
};

export default App;