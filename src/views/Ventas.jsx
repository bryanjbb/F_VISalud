// src/views/Ventas.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from "react-bootstrap";
import TablaVentas from '../components/ventas/TablaVentas';
import ModalDetallesVenta from '../components/detalle_venta/ModalDetallesVentas';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  // Obtener todas las ventas
  const obtenerVentas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ventas');
      if (!res.ok) throw new Error('Error al cargar las ventas');
      const data = await res.json();
      setListaVentas(data);
      setCargando(false);
    } catch (err) {
      setErrorCarga(err.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  // Detalles
  const obtenerDetalles = async id_venta => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const res = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${id_venta}`);
      if (!res.ok) throw new Error('Error al cargar los detalles');
      const data = await res.json();
      setDetallesVenta(data);
      setMostrarModalDetalles(true);
    } catch (err) {
      setErrorDetalles(err.message);
    } finally {
      setCargandoDetalles(false);
    }
  };

  // Agregar venta
  const agregarVenta = async ({ id_usuario, fecha_venta, total_venta, detalles }) => {
    try {
      const res = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, fecha_venta, total_venta, detalles })
      });
      if (!res.ok) throw new Error('Error al registrar la venta');
      await obtenerVentas();
      setMostrarModalRegistro(false);
      setDetallesNuevos([]);
      setErrorCarga(null);
    } catch (err) {
      setErrorCarga(err.message);
    }
  };

  // Actualizar venta
  const actualizarVenta = async (ventaActualizada, detalles) => {
    try {
      const res = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_usuario: Number(localStorage.getItem('id_usuario')),
          fecha_venta: new Date(Date.now() - (new Date().getTimezoneOffset()*60000))
                        .toISOString().slice(0,19).replace('T',' '),
          total_venta: detalles.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0),
          detalles
        })
      });
      if (!res.ok) throw new Error('Error al actualizar la venta');
      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setVentaAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (err) {
      setErrorCarga(err.message);
    }
  };

  // Abrir modal actualización
  const abrirModalActualizacion = async venta => {
    try {
      const resVenta = await fetch(`http://localhost:3000/api/obtenerventaporid/${venta.id_venta}`);
      if (!resVenta.ok) throw new Error('Error al cargar venta');
      const datos = await resVenta.json();
      setVentaAEditar(datos);

      const resDet = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${venta.id_venta}`);
      if (!resDet.ok) throw new Error('Error al cargar detalles');
      const dets = await resDet.json();
      setDetallesEditados(dets);

      setMostrarModalActualizacion(true);
    } catch (err) {
      setErrorCarga(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Ventas con Detalles</h4>

      <Row className="mb-3">
        <Col xs="auto">
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
            Nueva Venta
          </Button>
        </Col>
      </Row>

      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
        abrirModalActualizacion={abrirModalActualizacion}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={setMostrarModalDetalles}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

    </Container>
  );
};

export default Ventas;
