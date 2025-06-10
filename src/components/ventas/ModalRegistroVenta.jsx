import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  setNuevaVenta,
  detallesVenta,
  setDetallesVenta,
  agregarDetalle,
  agregarVenta,
  errorCarga,
  laboratorios,
  presentaciones,
  productos
}) => {
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(null);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });

  const nombreUsuario = localStorage.getItem("nombre") || "Usuario Desconocido";
  const id_usuario = localStorage.getItem("id_usuario");

  // Actualiza nuevaVenta con id_usuario al montar el componente
  useEffect(() => {
    setNuevaVenta(prev => ({ prev, id_usuario }));
  }, [id_usuario, setNuevaVenta]);

  const totalVenta = (detallesVenta || []).reduce(
    (acc, item) => acc + item.precio_unitario * item.cantidad,
    0
  );

  const cargarLaboratorios = (inputValue, callback) => {
    const filtrados = laboratorios.filter(lab =>
      lab.nombre_laboratorio.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(lab => ({
      value: lab.id_laboratorio,
      label: lab.nombre_laboratorio
    })));
  };

  const cargarPresentaciones = (inputValue, callback) => {
    const filtrados = presentaciones.filter(pre =>
      pre.nombre_presentacion.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(pre => ({
      value: pre.id_presentacion,
      label: pre.nombre_presentacion
    })));
  };

  const cargarProductos = (inputValue, callback) => {
    const filtrados = productos.filter(prod =>
      prod.nombre_producto.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(prod => ({
      value: prod.id_producto,
      label: prod.nombre_producto,
      precio: prod.precio_unitario
    })));
  };

  const manejarCambioLaboratorio = (seleccionado) => {
    setLaboratorioSeleccionado(seleccionado);
    setNuevaVenta(prev => ({ ...prev, id_laboratorio: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioPresentacion = (seleccionado) => {
    setPresentacionSeleccionada(seleccionado);
    setNuevaVenta(prev => ({ ...prev, id_presentacion: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioProducto = (seleccionado) => {
    setProductoSeleccionado(seleccionado);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: seleccionado ? seleccionado.value : '',
      precio_unitario: seleccionado ? seleccionado.precio : ''
    }));
  };

  const manejarCambioDetalle = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle(prev => ({ ...prev, [name]: value }));
  };

  const manejarAgregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Por favor, selecciona un producto y una cantidad válida.");
      return;
    }

    const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
      return;
    }

    agregarDetalle({
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario),
    });
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formLaboratorio">
                <Form.Label>Laboratorio</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarLaboratorios}
                  onChange={manejarCambioLaboratorio}
                  value={laboratorioSeleccionado}
                  placeholder="Buscar laboratorio..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formPresentacion">
                <Form.Label>Presentación</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarPresentaciones}
                  onChange={manejarCambioPresentacion}
                  value={presentacionSeleccionada}
                  placeholder="Buscar presentación..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <FormControl type="text" value={nombreUsuario} disabled />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formFechaVenta">
                <Form.Label>Fecha de Venta</Form.Label>
                <DatePicker
                  selected={nuevaVenta?.fecha_venta || new Date()}
                  onChange={(date) => setNuevaVenta(prev => ({ ...prev, fecha_venta: date }))}
                  className="form-control"
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h5>Agregar producto a la venta</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formProducto">
                <Form.Label>Producto</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarProductos}
                  onChange={manejarCambioProducto}
                  value={productoSeleccionado}
                  placeholder="Buscar producto..."
                  isClearable
                />
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <FormControl
                  type="number"
                  name="cantidad"
                  value={nuevoDetalle.cantidad}
                  onChange={manejarCambioDetalle}
                  placeholder="Cantidad"
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formPrecioUnitario">
                <Form.Label>Precio </Form.Label>
                <FormControl
                  type="number"
                  name="precio_unitario"
                  value={nuevoDetalle.precio_unitario}
                  disabled
                  placeholder="Automático"
                />
              </Form.Group>
            </Col>
            
            <Col md={2} className="mb-3 ">
              <Button variant="success" onClick={manejarAgregarDetalle} >
                Agregar Producto
              </Button>
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
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.precio_unitario.toFixed(2)}</td>
                      <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>{totalVenta.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarVenta}>
          Crear Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;