
import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';
import Paginacion from '../components/paginacion/Paginacion';

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const elementosPorPagina = 10;
const [productosFiltrados, setProductosFiltrados] = useState([]);
  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

   const obtenerPresentacion = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/presentaciones');
      if (!respuesta.ok) throw new Error('Error al cargar las presentaciones');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerLaboratorio = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/laboratorios');
      if (!respuesta.ok) throw new Error('Error al cargar los laboratorios');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Cargar productos, presentaciones y laboratorios al iniciar
  useEffect(() => {
    obtenerProductos();
    obtenerPresentacion();
    obtenerLaboratorio();
  }, []);

  if (cargando) return <div>Cargando...</div>;
  if (errorCarga) return <div>Error: {errorCarga}</div>;

   const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = listaProductos.filter(producto => {
      const id = (producto.id_producto || '').toString();
      const nombre = (producto.nombre_producto || '').toLowerCase();
      const descripcion = (producto.descripcion_producto || '').toLowerCase();
      return id.includes(texto) || nombre.includes(texto) || descripcion.includes(texto);
    });

    setProductosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <br />
      <h4>Catálogo de Productos</h4>
      <Row>
        {listaProductos.map((producto, indice) => (
          
          <Tarjeta
            key={producto.id_producto}
            indice={indice}
            nombre_producto={producto.nombre_producto}
            laboratorio={producto.laboratorio}
            presentacion={producto.nombre}
            precio_unitario={producto.precio_unitario}
            stock={producto.stock}
            imagen={producto.imagen}
          />
          

          
        ))}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;