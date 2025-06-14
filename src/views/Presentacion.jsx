import React, { useState, useEffect } from 'react';
import TablaPresentaciones from '../components/presentacion/TablaPresentacion';
import ModalRegistroPresentacion from '../components/presentacion/ModalRegistrarPresentacion';
import ModalEliminacionPresentacion from '../components/presentacion/ModalEliminarPresentacion';
import CuadroBusquedas from '../components/busquedas/CuadroBusqueda';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Paginacion from '../components/paginacion/Paginacion';
import ModalEdicionPresentacion from '../components/presentacion/ModalActualizarPresentacion';

const Presentaciones = () => {
  const [listaPresentaciones, setListaPresentaciones] = useState([]);
  const [presentacionesFiltradas, setPresentacionesFiltrados] = useState([]);
  const [nuevaPresentacion, setNuevaPresentacion] = useState({ nombre_presentacion: '' });
  const [PresentacionEditada, setPresentacionEditada] = useState(null);
  const [presentacionAEliminar, setPresentacionAEliminar] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 8;

  const obtenerPresentaciones = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/presentaciones');
      if (!res.ok) throw new Error('Error al obtener la presentacion');
      const datos = await res.json();
      const ordenados = datos.sort((a, b) => a.nombre_presentacion?.localeCompare(b.nombre_presentacion));
      setListaPresentaciones(ordenados);
      setPresentacionesFiltrados(ordenados);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPresentaciones();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaPresentacion(prev => ({ ...prev, [name]: value }));
  };

  const agregarPresentacion = async () => {
    if (!nuevaPresentacion.nombre_presentacion) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/registrarpresentacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaPresentacion)
      });
      if (!res.ok) throw new Error('Error al registrar la presentacion');
      await obtenerPresentaciones();
      setNuevaPresentacion({ nombre_presentacion: '' });
      setMostrarModal(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarPresentacion = async () => {
    if (!presentacionAEliminar) return;
    try {
      const res = await fetch(`http://localhost:3000/api/eliminarpresentacion/${presentacionAEliminar.id_presentacion}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar la presentacion');
      await obtenerPresentaciones();
      setMostrarModalEliminacion(false);
      setPresentacionAEliminar(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase()//Cambia las mayusculas por minusculas 
    .normalize("NFD")// Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos (tildes);;
    setTextoBusqueda(texto);
    const filtrados = listaPresentaciones.filter(presentacion =>{
      const id = (presentacion.id_presentacion  || '').toString();
     const nombre = ( presentacion.nombre_presentacion || '').toLowerCase()  .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
     return id.includes(texto) || nombre.includes(texto);
  });
    setPresentacionesFiltrados(filtrados);
    setPaginaActual(1);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setPresentacionEditada(prev => ({ ...prev, [name]: value }));
  };

  const actualizarPresentacion = async () => {
    if (!PresentacionEditada?.nombre_presentacion) {
      setErrorCarga("El nombre no puede estar vacío.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/actualizarpresentacion/${PresentacionEditada.id_presentacion}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_presentacion: PresentacionEditada.nombre_presentacion })
      });
      if (!res.ok) throw new Error('Error al actualizar la presentacion');
      await obtenerPresentaciones();
      setMostrarModalEdicion(false);
      setPresentacionEditada(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (presentacion) => {
    setPresentacionEditada(presentacion);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (presentacion) => {
    setPresentacionAEliminar(presentacion);
    setMostrarModalEliminacion(true);
  };

  const presentacionesPaginadas = presentacionesFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-1" 
      style={{ paddingBottom: '10px',
         textAlign:"center"}}
      >
        <br />
        <h4>Presentaciones</h4>
        
        <Row>
          <Col lg={5}>
            <CuadroBusquedas textoBusqueda={textoBusqueda}
             manejarCambioBusqueda={manejarCambioBusqueda}
              />
          </Col>
             <Col xs={12} sm={1} md={2} lg={3}></Col>
           <Col lg={3}>
            <Button variant="success"
            onClick={() => setMostrarModal(true)}
            style={{ width: '100%' }}
            className='btn-animado'
            >
              Nueva Presentacion
            </Button>
          </Col>
        </Row>

        <TablaPresentaciones
          presentaciones={presentacionesPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={listaPresentaciones.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

         <Paginacion
          totalElementos={presentacionesFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />

        <ModalRegistroPresentacion
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaPresentaciones={nuevaPresentacion}
          manejarCambioInput={manejarCambioInput}
          agregarPresentacion={agregarPresentacion}
          errorCarga={errorCarga}
        />

        <ModalEdicionPresentacion
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          PresentacionEditada={PresentacionEditada}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarPresentacion={actualizarPresentacion}
          errorCarga={errorCarga}
        />

        <ModalEliminacionPresentacion
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarPresentacion={eliminarPresentacion}
        />
      </Container>

    </>
  );
};

export default Presentaciones;
