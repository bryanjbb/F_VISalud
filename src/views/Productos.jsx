import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import ModalEdicionProducto from '../components/productos/ModalActualizacionProducto';
import ModalEliminacionProducto from '../components/productos/ModalEliminarProducto';
import Paginacion from '../components/paginacion/Paginacion';
import CuadroBusquedas from '../components/busquedas/CuadroBusqueda';
import { Container, Button, Row, Col } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    id_laboratorio: '',
    id_presentacion: '',
    vencimiento: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });
  const [listaLaboratorios, setListaLaboratorios] = useState([]);
    const [listaPresentaciones, setlistaPresentaciones] = useState([]);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const elementosPorPagina = 10;
  //Modal actualizar
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  //Modal Eliminar
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

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

  const obtenerLaboratorios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/laboratorios');
      if (!respuesta.ok) throw new Error('Error al cargar los laboratorios');
      const datos = await respuesta.json();
      setListaLaboratorios(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerPresentaciones = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/presentaciones');
      if (!respuesta.ok) throw new Error('Error al cargar las presentaciones');
      const datos = await respuesta.json();
      setlistaPresentaciones(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerLaboratorios();
    obtenerPresentaciones();
  }, []);

  useEffect(() => {
    const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina);
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(totalPaginas);
    }
  }, [productosFiltrados]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_laboratorio ||
        !nuevoProducto.id_presentacion || !nuevoProducto.vencimiento ||
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        id_laboratorio: '',
        id_presentacion: '',
        vencimiento: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

 

 const eliminaProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('Error al eliminar el producto');

      setMostrarModalEliminacion(false);
      await obtenerProductos();
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarProducto = async () => {
    if (!productoEditado?.nombre_producto || !productoEditado?.id_laboratorio|| !productoEditado.id_presentacion||
       !productoEditado?.precio_unitario || !productoEditado?.precio_unitario || !productoEditado?.stock|| 
       !productoEditado?.imagen  ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: productoEditado.nombre_producto,
          id_laboratorio: productoEditado.id_laboratorio,
          id_presentacion: productoEditado.id_presentacion,
          precio_unitario : productoEditado.precio_unitario,
          stock : productoEditado.stock,
          imagen : productoEditado.imagen,
        }),
      });

      if (!respuesta.ok) throw new Error('Error al actualizar el producto');

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarModalEdicion(true);
  };

 const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase()//Cambia las mayusculas por minusculas 
    .normalize("NFD")// Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos (tildes)
    setTextoBusqueda(texto);
    const filtrados = listaProductos.filter(producto => {
      const id = (producto.id_producto || '').toString();
      const nombre = (producto.nombre_producto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      const laboratorio = (producto.nombre_laboratorio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      return id.includes(texto) || nombre.includes(texto) || laboratorio.includes(texto);
    });

    setProductosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
<Container className="mt-1" style={{ paddingBottom: '10px' }}>
      <h4>Productos</h4>
        <br />
        <Row>
          <Col lg={3} >
            <Button variant="success" 
            onClick={() => setMostrarModal(true)} 
            style={{ width: "100%" }}
            className='btn-animado'
            >
              Nuevo Producto
            </Button>
          </Col>
          <Col lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <Paginacion
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          laboratorios={listaLaboratorios}
          presentaciones={listaPresentaciones}
        />

         <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorCarga}
          laboratorios={listaLaboratorios}
          presentaciones={listaPresentaciones}
        />

        <ModalEliminacionProducto
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminaProducto}
        />

      </Container>

    
        
      
    </>
  );
};

export default Productos;
