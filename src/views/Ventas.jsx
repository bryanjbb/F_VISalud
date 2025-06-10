import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import ModalDetallesVenta from '../components/detalle_venta/ModalDetallesVentas';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import ModalActualizacionVenta from '../components/ventas/ModalActualizacionVenta';
import Paginacion from '../components/paginacion/Paginacion';
import CuadroBusquedas from '../components/busquedas/CuadroBusqueda';
import { Container, Button, Row, Col } from "react-bootstrap";

const Ventas = () => {    
  // Estado para la lista de ventas y sus detalles
  const [listaVentas, setListaVentas] = useState([]);
  // Estado para la carga de ventas 
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  // Estado para el modal de detalles
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);
  // Estado para el modal de eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  // Estado para el modal de registro
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [laboratorios, setLaboratorios] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  // Estado para paginación 
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;
  // Estado para búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    id_laboratorio: '',
    id_presentacion: '',
    fecha_venta: new Date(),
    total_venta: 0,
    id_usuario: null, // permitir null
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  // Obtener lista de ventas
  const obtenerVentas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ventas');
      if (!res.ok) throw new Error('Error al cargar ventas');
      const data = await res.json();
      setListaVentas(data);
      setVentasFiltradas(data);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
    // combos
    fetch('http://localhost:3000/api/laboratorios')
      .then(r => r.json())
      .then(setLaboratorios)
      .catch(e => console.error(e));
    fetch('http://localhost:3000/api/presentaciones')
      .then(r => r.json())
      .then(setPresentaciones)
      .catch(e => console.error(e));
    fetch('http://localhost:3000/api/productos')
      .then(r => r.json())
      .then(setProductos)
      .catch(e => console.error(e));
  }, []);

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * ventasPorPagina,
    paginaActual * ventasPorPagina
  );

  // Detalles
  const obtenerDetalles = async (numero_factura) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const res = await fetch(`http://localhost:3000/api/obtenerventaporid/${numero_factura}`);
      const datosVenta = await res.json();
      setDetallesVenta(datosVenta.detalles || []);
      setMostrarModalDetalles(true);
    } catch (e) {
      setErrorDetalles(e.message);
    } finally {
      setCargandoDetalles(false);
    }
  };

  const agregarDetalle = detalle => {
    setDetallesNuevos(prev => [...prev, detalle]);
    setNuevaVenta(prev => ({
      ...prev,
      total_venta: prev.total_venta + detalle.cantidad * detalle.precio_unitario
    }));
  };

  const agregarVenta = async () => {
    if (!nuevaVenta.id_laboratorio || !nuevaVenta.id_presentacion) {
      setErrorCarga('Selecciona laboratorio y presentación'); return;
    }
    if (!detallesNuevos.length) {
      setErrorCarga('Agrega al menos un detalle'); return;
    }
    try {
      const ventaData = {
        id_laboratorio: nuevaVenta.id_laboratorio,
        id_presentacion: nuevaVenta.id_presentacion,
        fecha_venta: new Date(Date.now() - new Date().getTimezoneOffset()*60000)
          .toISOString().slice(0,19).replace('T',' '),
        total_venta: detallesNuevos.reduce((a,d)=>a+d.cantidad*d.precio_unitario,0),
        detalles: detallesNuevos,
        id_usuario: null, // permitir null
      };
      const res = await fetch('http://localhost:3000/api/registrarventa',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(ventaData) });
      if (!res.ok) throw new Error((await res.json()).mensaje || 'Error al registrar la venta');
      await obtenerVentas();
      setNuevaVenta({ id_laboratorio:'', id_presentacion:'', fecha_venta:new Date(), total_venta:0, id_usuario:null });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (e) {
      setErrorCarga(e.message);
    }
  };

  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_laboratorio || !ventaActualizada.id_presentacion) {
      setErrorCarga('Selecciona laboratorio y presentación'); return;
    }
    if (!detalles.length) { setErrorCarga('Agrega al menos un detalle'); return; }
    try {
      const dataAct = {
        ...ventaActualizada,
        detalles,
        total_venta: detalles.reduce((a,d)=>a+d.cantidad*d.precio_unitario,0),
        fecha_venta: new Date(ventaActualizada.fecha_venta).toISOString().slice(0,19).replace('T',' '),
        id_usuario: null,
      };
      const res = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.numero_factura}`,{ method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(dataAct) });
      if (!res.ok) throw new Error((await res.json()).mensaje || 'Error al actualizar');
      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setErrorCarga(null);
    } catch (e) { setErrorCarga(e.message); }
  };

  const eliminarVenta = async numero_factura => {
    try {
      const res = await fetch(`http://localhost:3000/api/eliminarventa/${numero_factura}`,{method:'DELETE'});
      if (!res.ok) throw new Error('Error al eliminar');
      await obtenerVentas();
      setMostrarModalEliminacion(false);
    } catch (e) { setErrorCarga(e.message); }
  };

  const manejarCambioBusqueda = e => {
    const texto = e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    setTextoBusqueda(texto);
    setVentasFiltradas(listaVentas.filter(v=>
      v.numero_factura?.toString().toLowerCase().includes(texto)
    ));
    setPaginaActual(1);
  };

  useEffect(() => {
    setVentasFiltradas(listaVentas);
  }, [listaVentas]);

  return (
    <Container className="mt-1" style={{textAlign:"center"}}>
      <br />
      <Row><Col><h2>Ventas</h2></Col></Row>
      <Row className="mb-3">
        <Col><CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} /></Col>
        <Col xs="auto"><Button onClick={()=>setMostrarModalRegistro(true)}>Nueva Venta</Button></Col>
      </Row>

      {errorCarga && <p className="text-danger">{errorCarga}</p>}
      {cargando ? <p>Cargando ventas...</p> :
        <TablaVentas
          ventas={ventasPaginadas}
          cargando={cargando}
          error={errorCarga}
          obtenerDetalles={obtenerDetalles}
          abrirModalEliminacion={venta=>setMostrarModalEliminacion(true) || setVentaAEliminar(venta)}
          abrirModalActualizacion={async venta=>{
            setVentaAEditar(venta); setMostrarModalActualizacion(true);
          }}
        />
      }

      <Paginacion
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={ventasPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={setMostrarModalDetalles}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

      <ModalEliminacionVenta
        show={mostrarModalEliminacion}
        onHide={()=>setMostrarModalEliminacion(false)}
        venta={ventaAEliminar}
        onConfirmar={()=>eliminarVenta(ventaAEliminar.numero_factura)}
      />

      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detallesVenta={detallesNuevos}
        setDetallesVenta={setDetallesNuevos}
        agregarDetalle={agregarDetalle}
        agregarVenta={agregarVenta}
        productos={productos}
        laboratorios={laboratorios}
        presentaciones={presentaciones}
        errorCarga={errorCarga}
      />

      <ModalActualizacionVenta
        show={mostrarModalActualizacion}
        onHide={()=>setMostrarModalActualizacion(false)}
        venta={ventaAEditar}
        detalles={detallesEditados}
        setDetalles={setDetallesEditados}
        onGuardar={actualizarVenta}
        error={errorCarga}
        productos={productos}
      />
    </Container>
  );
};

export default Ventas;
