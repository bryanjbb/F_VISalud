// ModalActualizacionVenta.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalActualizacionVenta = ({
  mostrarModal,
  setMostrarModal,
  venta,
  detallesVenta,
  setDetallesVenta,
  actualizarVenta,
  errorCarga,
  laboratorios,
  presentaciones,
  productos
}) => {
  const [ventaActualizada, setVentaActualizada] = useState({
    id_venta: venta?.id_venta || '',
    id_laboratorio: venta?.id_laboratorio || '',
    id_presentacion: venta?.id_presentacion || '',
    fecha_venta: venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date(),
    total_venta: venta?.total_venta || 0
  });

  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });
  const [editandoDetalle, setEditandoDetalle] = useState(null);
  const [mensajeError, setMensajeError] = useState('');

const totalVenta = (detallesVenta || []).reduce(
  (acc, item) => acc + item.precio_unitario * item.cantidad,
  0
);

  useEffect(() => {
    if (venta && laboratorios.length > 0 && presentaciones.length > 0) {
      setLaboratorioSeleccionado({ value: venta.id_laboratorio, label: venta.nombre_laboratorio });
      setPresentacionSeleccionada({ value: venta.id_presentacion, label: venta.nombre_presentacion });
      setVentaActualizada({
        id_venta: venta.id_venta || '',
        id_laboratorio: venta.id_laboratorio || '',
        id_presentacion: venta.id_presentacion || '',
        fecha_venta: venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date(),
        total_venta: parseFloat(venta.total_venta) || 0
      });
    }
  }, [venta, laboratorios, presentaciones]);

  const cargarLaboratorios = (input, cb) => {
    const filtrados = laboratorios.filter(l => l.nombre_laboratorio.toLowerCase().includes(input.toLowerCase()));
    cb(filtrados.map(l => ({ value: l.id_laboratorio, label: l.nombre_laboratorio })));
  };

  const cargarPresentaciones = (input, cb) => {
    const filtrados = presentaciones.filter(p => p.nombre_presentacion.toLowerCase().includes(input.toLowerCase()));
    cb(filtrados.map(p => ({ value: p.id_presentacion, label: p.nombre_presentacion })));
  };

  const cargarProductos = (input, cb) => {
    const filtrados = productos.filter(p => p.nombre_producto.toLowerCase().includes(input.toLowerCase()));
    cb(filtrados.map(p => ({
      value: p.id_producto,
      label: p.nombre_producto,
      precio: p.precio_unitario
    })));
  };

  const manejarCambioLaboratorio = (s) => {
    setLaboratorioSeleccionado(s);
    setVentaActualizada(prev => ({ ...prev, id_laboratorio: s ? s.value : '' }));
  };

  const manejarCambioPresentacion = (s) => {
    setPresentacionSeleccionada(s);
    setVentaActualizada(prev => ({ ...prev, id_presentacion: s ? s.value : '' }));
  };

  const manejarCambioProducto = (s) => {
    setProductoSeleccionado(s);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: s ? s.value : '',
      precio_unitario: s ? s.precio : ''
    }));
  };

  const manejarCambioDetalle = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle(prev => ({ ...prev, [name]: value }));
  };

  const manejarAgregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }
    const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Disponibles: ${producto.stock}`);
      return;
    }
    setDetallesVenta(prev => [...prev, {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    }]);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  const eliminarDetalle = (index) => {
    setDetallesVenta(prev => prev.filter((_, i) => i !== index));
  };

  const iniciarEdicionDetalle = (index, detalle) => {
    setEditandoDetalle({ index, detalle });
    setNuevoDetalle({
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad.toString(),
      precio_unitario: detalle.precio_unitario.toString()
    });
    setProductoSeleccionado({
      value: detalle.id_producto,
      label: detalle.nombre_producto,
      precio: detalle.precio_unitario
    });
  };

  const guardarEdicionDetalle = () => {
    if (!editandoDetalle) return;
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }
    const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Disponibles: ${producto.stock}`);
      return;
    }
    const nuevosDetalles = [...detallesVenta];
    nuevosDetalles[editandoDetalle.index] = {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    };
    setDetallesVenta(nuevosDetalles);
    setEditandoDetalle(null);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => {
      setMostrarModal(false);
      setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
      setProductoSeleccionado(null);
      setEditandoDetalle(null);
    }} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Label>Laboratorio</Form.Label>
              <AsyncSelect
                cacheOptions defaultOptions
                loadOptions={cargarLaboratorios}
                onChange={manejarCambioLaboratorio}
                value={laboratorioSeleccionado}
                placeholder="Buscar laboratorio..."
                isClearable
              />
            </Col>
            <Col md={4}>
              <Form.Label>Presentación</Form.Label>
              <AsyncSelect
                cacheOptions defaultOptions
                loadOptions={cargarPresentaciones}
                onChange={manejarCambioPresentacion}
                value={presentacionSeleccionada}
                placeholder="Buscar presentación..."
                isClearable
              />
            </Col>
            <Col md={4}>
              <Form.Label>Fecha</Form.Label>
              <DatePicker
                selected={ventaActualizada.fecha_venta}
                onChange={date => setVentaActualizada(prev => ({ ...prev, fecha_venta: date }))}
                className="form-control"
                dateFormat="dd/MM/yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
              />
            </Col>
          </Row>

          <hr />
          <h5>{editandoDetalle ? "Editar Detalle" : "Agregar Detalle"}</h5>
          <Row>
            <Col md={4}>
              <Form.Label>Producto</Form.Label>
              <AsyncSelect
                cacheOptions defaultOptions
                loadOptions={cargarProductos}
                onChange={manejarCambioProducto}
                value={productoSeleccionado}
                placeholder="Buscar producto..."
                isClearable
                isDisabled={!!editandoDetalle}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Cantidad</Form.Label>
              <FormControl type="number" name="cantidad" value={nuevoDetalle.cantidad} onChange={manejarCambioDetalle} min={1} />
            </Col>
            <Col md={3}>
              <Form.Label>Precio</Form.Label>
              <FormControl type="number" name="precio_unitario" value={nuevoDetalle.precio_unitario} disabled />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              {editandoDetalle ? (
                <Button onClick={guardarEdicionDetalle} variant="primary" className="w-100">Guardar</Button>
              ) : (
                <Button onClick={manejarAgregarDetalle} variant="success" className="w-100">Agregar</Button>
              )}
            </Col>
          </Row>

          {detallesVenta?.length > 0 && (
            <>
              <h5 className="mt-4">Detalles Agregados</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta.map((d, i) => (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{d.cantidad}</td>
                      <td>{d.precio_unitario.toFixed(2)}</td>
                      <td>{(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => iniciarEdicionDetalle(i, d)} className="me-2">Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => eliminarDetalle(i)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                    <td><strong>{totalVenta.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}

          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
          {mensajeError && <div className="alert alert-danger mt-3">{mensajeError}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setMostrarModal(false);
          setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
          setProductoSeleccionado(null);
          setEditandoDetalle(null);
        }}>Cancelar</Button>
        <Button variant="primary" onClick={() => {
          if (detallesVenta.length === 0) {
            setMensajeError("No puedes actualizar una venta sin productos.");
            return;
          }
          setMensajeError("");
          actualizarVenta({
            ...ventaActualizada,
            total_venta: totalVenta
          }, detallesVenta);
        }}>Actualizar Venta</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionVenta;
