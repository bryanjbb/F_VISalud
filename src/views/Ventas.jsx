import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import ModalDetallesVenta from '../components/detalle_venta/ModalDetallesVentas';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import ModalActualizacionVenta from '../components/ventas/ModalActualizacionVenta';
import { Container, Button, Row, Col } from "react-bootstrap";

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [laboratorios, setLaboratorios] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productos, setProductos] = useState([]);

    // Obtener usuario que inició sesión
  const usuarioLogueado = localStorage.getItem("usuario") || "Usuario Desconocido";

  const [nuevaVenta, setNuevaVenta] = useState({
    id_laboratorio: '',
    id_presentacion: '',
    fecha_venta: new Date(),
    total_venta: 0,
    usuario: usuarioLogueado,
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
       console.log("Ventas obtenidas:", data);
      setListaVentas(data);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/productos");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener laboratorios para el combo
  const obtenerLaboratorios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/laboratorios');
      if (!res.ok) throw new Error('Error al cargar laboratorios');
      const data = await res.json();
      setLaboratorios(data);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Obtener presentaciones para el combo
  const obtenerPresentaciones = async () => { 
    try {
      const res = await fetch('http://localhost:3000/api/presentaciones');
      if (!res.ok) throw new Error('Error al cargar presentaciones');
      const data = await res.json();
      setPresentaciones(data);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerVentas();
    obtenerLaboratorios();
    obtenerPresentaciones();
    obtenerProductos();
  }, []);

  // Obtener detalles de una venta
  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const res = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${id_venta}`);
      if (!res.ok) throw new Error('Error al cargar detalles de venta');
      const data = await res.json();
      setDetallesVenta(data);
      setMostrarModalDetalles(true);
    } catch (error) {
      setErrorDetalles(error.message);
    } finally {
      setCargandoDetalles(false);
    }
  };

  // Agregar un detalle nuevo (desde modal registro)
  const agregarDetalle = (detalle) => {
    setDetallesNuevos(prev => [...prev, detalle]);
    setNuevaVenta(prev => ({
      ...prev,
      total_venta: prev.total_venta + detalle.cantidad * detalle.precio_unitario
    }));
  };

  // Registrar venta nueva
  const agregarVenta = async () => {
    if (!nuevaVenta.id_laboratorio || !nuevaVenta.id_presentacion) {
      setErrorCarga('Selecciona laboratorio y presentación');
      return;
    }
    if (detallesNuevos.length === 0) {
      setErrorCarga('Agrega al menos un detalle');
      return;
    }
    try {
      const ventaData = {
        id_laboratorio: nuevaVenta.id_laboratorio,
        id_presentacion: nuevaVenta.id_presentacion,
        fecha_venta: nuevaVenta.fecha_venta.toISOString().slice(0, 19).replace('T', ' '),
        total_venta: detallesNuevos.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0),
        detalles: detallesNuevos,
        usuario: nuevaVenta.usuario,
      };

      const res = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });

      if (!res.ok) throw new Error('Error al registrar la venta');

      await obtenerVentas();
      setNuevaVenta({
        id_laboratorio: '',
        id_presentacion: '',
        fecha_venta: new Date(),
        total_venta: 0,
        usuario:usuarioLogueado,
      });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Abrir modal actualización con datos
  const abrirModalActualizacion = async (venta) => {
    setErrorCarga(null);
    setCargandoDetalles(true);
    try {
      const resVenta = await fetch(`http://localhost:3000/api/obtenerventaporid/${venta.id_venta}`);
      if (!resVenta.ok) throw new Error('Error al cargar venta');
      const datosVenta = await resVenta.json();

      const resDetalles = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${venta.id_venta}`);
      if (!resDetalles.ok) throw new Error('Error al cargar detalles');
      const datosDetalles = await resDetalles.json();

      setVentaAEditar(datosVenta);
      setDetallesEditados(datosDetalles);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargandoDetalles(false);
    }
  };

  // Actualizar venta
  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_laboratorio || !ventaActualizada.id_presentacion) {
      setErrorCarga('Selecciona laboratorio y presentación');
      return;
    }
    if (detalles.length === 0) {
      setErrorCarga('Agrega al menos un detalle');
      return;
    }
    try {
      const dataActualizar = {
        ...ventaActualizada,
        detalles,
        total_venta: detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0),
        fecha_venta: new Date(ventaActualizada.fecha_venta).toISOString().slice(0, 19).replace('T', ' ')
      };

      const res = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataActualizar)
      });

      if (!res.ok) throw new Error('Error al actualizar la venta');

      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Eliminar venta
  const eliminarVenta = async (id_venta) => {
    try {
      const res = await fetch(`http://localhost:3000/api/eliminarventa/${id_venta}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar venta');
      await obtenerVentas();
      setMostrarModalEliminacion(false);
      setVentaAEliminar(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return ( 
    <Container>
      <Row className="mb-3">
        <Col><h2>Ventas</h2></Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModalRegistro(true)}>Nueva Venta</Button>
        </Col>
      </Row>

      {errorCarga && <p className="text-danger">{errorCarga}</p>}
      {cargando ? (
        <p>Cargando ventas...</p>
      ) : (
        <TablaVentas
          ventas={listaVentas}
          obtenerDetalles={obtenerDetalles}
          onEditar={abrirModalActualizacion}
          onEliminar={(venta) => {
            setVentaAEliminar(venta);
            setMostrarModalEliminacion(true);
          }}
        />
      )}

       <ModalDetallesVenta
          mostrarModal={mostrarModalDetalles}
          setMostrarModal={setMostrarModalDetalles}
          detalles={detallesVenta}
          cargandoDetalles={cargandoDetalles}
          errorDetalles={errorDetalles}
        />

      <ModalEliminacionVenta
        show={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        venta={ventaAEliminar}
        onConfirmar={() => eliminarVenta(ventaAEliminar.id_venta)}
      />

     <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta} // 
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
        onHide={() => setMostrarModalActualizacion(false)}
        laboratorios={laboratorios}
        presentaciones={presentaciones}
        venta={ventaAEditar}
        setVenta={setVentaAEditar}
        detalles={detallesEditados}
        setDetalles={setDetallesEditados}
        onGuardar={actualizarVenta}
        error={errorCarga}
      />
    </Container>
  );
};

export default Ventas;
