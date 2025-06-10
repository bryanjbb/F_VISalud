import React, { useState, useEffect } from 'react';
import TablaLaboratorios from '../components/laboratorio/TablaLaboratorios';
import ModalRegistroLaboratorio from '../components/laboratorio/ModalRegistroLaboratorio'
import ModalEliminacionLaboratorio from '../components/laboratorio/ModalEliminarLaboratorio';
import ModalEdicionLaboratorio from '../components/laboratorio/ModalactualizacionLaboratorio';
import CuadroBusquedas from '../components/busquedas/CuadroBusqueda';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Paginacion from '../components/paginacion/Paginacion';

const Laboratorios = () => {
  const [listaLaboratorios, setListaLaboratorios] = useState([]);
  const [laboratoriosFiltrados, setLaboratoriosFiltrados] = useState([]);
  const [nuevoLaboratorio, setNuevoLaboratorio] = useState({ nombre_laboratorio: '' });
  const [laboratorioEditado, setLaboratorioEditado] = useState(null);
  const [laboratorioAEliminar, setLaboratorioAEliminar] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 8;

  const obtenerLaboratorios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/laboratorios');
      if (!res.ok) throw new Error('Error al obtener laboratorios');
      const datos = await res.json();
      const ordenados = datos.sort((a, b) => a.nombre_laboratorio?.localeCompare(b.nombre_laboratorio));
      setListaLaboratorios(ordenados);
      setLaboratoriosFiltrados(ordenados);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerLaboratorios();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoLaboratorio(prev => ({ ...prev, [name]: value }));
  };

  const agregarLaboratorio = async () => {
    if (!nuevoLaboratorio.nombre_laboratorio) {
      setErrorCarga("Por favor, completa el campo antes de guardar.");
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/registrarlaboratorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLaboratorio)
      });
      if (!res.ok) throw new Error('Error al registrar laboratorio');
      await obtenerLaboratorios();
      setNuevoLaboratorio({ nombre_laboratorio: '' });
      setMostrarModal(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

    const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setLaboratorioEditado(prev => ({ ...prev, [name]: value }));
  };

  const actualizarLaboratorio = async () => {
    if (!laboratorioEditado?.nombre_laboratorio) {
      setErrorCarga("El nombre no puede estar vacío.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/actualizarlaboratorio/${laboratorioEditado.id_laboratorio}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_laboratorio: laboratorioEditado.nombre_laboratorio })
      });
      if (!res.ok) throw new Error('Error al actualizar el laboratorio');
      await obtenerLaboratorios();
      setMostrarModalEdicion(false);
      setLaboratorioEditado(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (laboratorio) => {
    setLaboratorioEditado(laboratorio);
    setMostrarModalEdicion(true);
  };

  const eliminarLaboratorio = async () => {
    if (!laboratorioAEliminar) return;
    try {
      const res = await fetch(`http://localhost:3000/api/eliminarlaboratorio/${laboratorioAEliminar.id_laboratorio}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar el laboratorio');
      await obtenerLaboratorios();
      setMostrarModalEliminacion(false);
      setLaboratorioAEliminar(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase()//Cambia las mayusculas por minusculas 
    .normalize("NFD")// Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos (tildes);
    setTextoBusqueda(texto);
    const filtrados = listaLaboratorios.filter(laboratorio => {
      const id = (laboratorio.id_laboratorio || '').toString();
      const nombre = (laboratorio.nombre_laboratorio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return id.includes(texto) || nombre.includes(texto);
    });

    setLaboratoriosFiltrados(filtrados);
    establecerPaginaActual(1);
  };



  const abrirModalEliminacion = (laboratorio) => {
    setLaboratorioAEliminar(laboratorio);
    setMostrarModalEliminacion(true);
  };

  const laboratoriosPaginados = laboratoriosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-1" style={{ paddingBottom: '10px', textAlign:"center"}}>
        <br />
       <Col xs={12} sm={1} md={1} lg={3}> <h4>Laboratorios</h4> </Col>
        <Row>
          <Col lg={6}>
            <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
          </Col>
              <Col xs={12} sm={1} md={1} lg={3}> </Col>
           <Col lg={3}>
            <Button variant="success" 
            onClick={() => setMostrarModal(true)} 
            style={{ width: '100%' }}
            className='btn-animado'>
              
              Nuevo Laboratorio
            </Button>
          </Col>
        </Row>

        <TablaLaboratorios
          laboratorios={laboratoriosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={listaLaboratorios.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

         <Paginacion
          totalElementos={laboratoriosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        <ModalRegistroLaboratorio
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoLaboratorio={nuevoLaboratorio}
          manejarCambioInput={manejarCambioInput}
          agregarLaboratorio={agregarLaboratorio}
          errorCarga={errorCarga}
        />

        <ModalEdicionLaboratorio
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          laboratorioEditado={laboratorioEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarLaboratorio={actualizarLaboratorio}
          errorCarga={errorCarga}
        />

        <ModalEliminacionLaboratorio
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarLaboratorio={eliminarLaboratorio}
        />
      </Container>

  
    </>
  );
};

export default Laboratorios;
