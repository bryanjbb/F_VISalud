import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import { Container, Button } from "react-bootstrap";
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import ModalEdicionProducto from '../components/productos/ModalActualizacionProducto';
import ModalEliminacionProducto from '../components/productos/ModalEliminarProducto';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [listaLaboratorios, setListaLaboratorios] = useState([]);
  const [listaPresentaciones, setListaPresentaciones] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    vencimiento: '',
    precio_unitario: '',
    stock: '',
    id_laboratorio: '',
    id_presentacion: '',
    imagen: null
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [laboratorios, setLaboratorios] = useState([]);
const [presentaciones, setPresentaciones] = useState([]);
const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
const [errorProductos, setErrorProductos] = useState(null);
const [errorLaboratorios, setErrorLaboratorios] = useState(null);
const [errorPresentaciones, setErrorPresentaciones] = useState(null);




  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      
    } catch (error) {
      setErrorProductos(error.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerLaboratorios = async () => {
    const res = await fetch('http://localhost:3000/api/laboratorios');
    const data = await res.json();
    setListaLaboratorios(data);
  };

  const obtenerPresentaciones = async () => {
    const res = await fetch('http://localhost:3000/api/presentaciones');
    const data = await res.json();
    setListaPresentaciones(data);
    
  };

  const manejarSeleccionLaboratorio = (seleccionado) => {
    setLaboratorioSeleccionado(seleccionado);
    setNuevoProducto(prev => ({
      ...prev,
      id_laboratorio: seleccionado ? seleccionado.value : null,
    }));
  };
  
  const manejarSeleccionPresentacion = (seleccionado) => {
    setPresentacionSeleccionada(seleccionado);
    setNuevoProducto(prev => ({
      ...prev,
      id_presentacion: seleccionado ? seleccionado.value : null,
    }));
  };
  

  useEffect(() => {
    obtenerProductos();
    obtenerLaboratorios();
    obtenerPresentaciones();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({ ...prev, [name]: value }));
  };

  const manejarCambioImagen = (e) => {
    setNuevoProducto(prev => ({ ...prev, imagen: e.target.files[0] }));
  };

  const agregarProducto = async () => {
    console.log("Nuevo Producto antes de enviar:", JSON.stringify(nuevoProducto, null, 2));    if (
      !nuevoProducto.nombre_producto ||
      !nuevoProducto.id_presentacion ||
      !nuevoProducto.id_laboratorio ||
      !nuevoProducto.precio_unitario ||
      !nuevoProducto.stock ||
      !nuevoProducto.vencimiento
    ) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("nombre_producto", nuevoProducto.nombre_producto);
      formData.append("id_presentacion", nuevoProducto.id_presentacion);
      formData.append("id_laboratorio", nuevoProducto.id_laboratorio);
      formData.append("vencimiento", nuevoProducto.vencimiento);
      formData.append("precio_unitario", nuevoProducto.precio_unitario);
      formData.append("stock", nuevoProducto.stock);
  
      // Solo agregamos la imagen si fue seleccionada
      if (nuevoProducto.imagen) {
        formData.append("imagen", nuevoProducto.imagen);
      }
  
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        body: formData,
      });
  
      if (!respuesta.ok) {
        const data = await respuesta.json();
        throw new Error(data.mensaje || 'Error al agregar el producto');
      }
  
      await obtenerProductos();
  
      setNuevoProducto({
        nombre_producto: '',
        vencimiento: '',
        precio_unitario: '',
        stock: '',
        id_laboratorio: '',
        id_presentacion: '',
        imagen: null
      });
  
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      console.error("Error al registrar:", error);
      setErrorCarga(error.message);
    }
  };
  
  
  

  const actualizarProducto = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoSeleccionado.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoSeleccionado),
      });

      if (!respuesta.ok) throw new Error('Error al actualizar el producto');
      await obtenerProductos();
      setMostrarModalEdicion(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const seleccionarProductoParaEdicion = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalEdicion(true);
  };

  const eliminarProducto = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('Error al eliminar el producto');
      await obtenerProductos();
      setMostrarModalEliminacion(false);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Productos</h4>
      <Button variant="primary" onClick={() => setMostrarModal(true)}>
        Nuevo Producto
      </Button>
      <br /><br />

      <TablaProductos 
        productos={listaProductos} 
        cargando={cargando} 
        error={errorCarga} 
        seleccionarProductoParaEdicion={seleccionarProductoParaEdicion}
        eliminarProducto={setProductoAEliminar}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        manejarRegistroProducto={agregarProducto}
        manejarCambioImagen={manejarCambioImagen}
        errorCarga={errorCarga}
        laboratorios={laboratorios} // 👈 asegúrate que esto existe y tiene datos
        presentaciones={presentaciones} // 👈 igual aquí
        manejarSeleccionLaboratorio={manejarSeleccionLaboratorio}
        manejarSeleccionPresentacion={manejarSeleccionPresentacion}
        listaLaboratorios={listaLaboratorios}
        listaPresentaciones={listaPresentaciones}
      />

      <ModalEdicionProducto
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        productoSeleccionado={productoSeleccionado}
        setProductoSeleccionado={setProductoSeleccionado}
        manejarCambioInput={manejarCambioInput}
        manejarActualizarProducto={actualizarProducto}
        errorCarga={errorCarga}
        listaLaboratorios={listaLaboratorios}
        listaPresentaciones={listaPresentaciones}
      />

      <ModalEliminacionProducto
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        producto={productoAEliminar}
        eliminarProducto={() => eliminarProducto(productoAEliminar?.id_producto)}
      />
    </Container>
  );
};

export default Productos;
