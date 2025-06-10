// ModalActualizacionVenta.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalActualizacionVenta = ({
  show,
  onHide,
  venta,
  detalles = [],
  setDetalles,
  onGuardar,
  error,
  usuarios = [],
  productos = []
}) => {
  const [ventaAct, setVentaAct] = useState({
    numero_factura: venta?.numero_factura || '',
    id_usuario: venta?.id_usuario || '',
    fecha_venta: venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date(),
    total_venta: venta?.total_venta || 0
  });
  const [userSel, setUserSel] = useState(null);
  const [prodSel, setProdSel] = useState(null);
  const [tmpDet, setTmpDet] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });
  const [editIdx, setEditIdx] = useState(null);
  const [msgErr, setMsgErr] = useState('');

  // Total dinámico
  const total = detalles.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0);

  // Inicializar al abrir
  useEffect(() => {
    if (venta && usuarios.length) {
      setUserSel({ value: venta.id_usuario, label: venta.nombre_usuario });
      setVentaAct({
        numero_factura: venta.numero_factura,
        id_usuario: venta.id_usuario,
        fecha_venta: new Date(venta.fecha_venta),
        total_venta: venta.total_venta
      });
    }
  }, [venta, usuarios]);

  // Loaders para AsyncSelect
  const loadUsers = (input, cb) =>
    cb(
      usuarios
        .filter(u => u.nombre_usuario.toLowerCase().includes(input.toLowerCase()))
        .map(u => ({ value: u.id_usuario, label: u.nombre_usuario }))
    );
  const loadProds = (input, cb) =>
    cb(
      productos
        .filter(p => p.nombre_producto.toLowerCase().includes(input.toLowerCase()))
        .map(p => ({ value: p.id_producto, label: p.nombre_producto, precio: p.precio_unitario }))
    );

  // Handlers
  const onUserChange = sel => {
    setUserSel(sel);
    setVentaAct(prev => ({ ...prev, id_usuario: sel?.value || '' }));
  };
  const onProdChange = sel => {
    setProdSel(sel);
    setTmpDet(prev => ({ ...prev, id_producto: sel.value, precio_unitario: sel.precio }));
  };
  const onDetChange = e =>
    setTmpDet(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addDetalle = () => {
    if (!tmpDet.id_producto || tmpDet.cantidad <= 0) {
      setMsgErr('Cantidad inválida');
      return;
    }
    setDetalles(prev => [
      ...prev,
      {
        id_producto: tmpDet.id_producto,
        nombre_producto: prodSel.label,
        cantidad: parseInt(tmpDet.cantidad),
        precio_unitario: parseFloat(tmpDet.precio_unitario)
      }
    ]);
    setTmpDet({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProdSel(null);
  };

  const startEdit = (i, d) => {
    setEditIdx(i);
    setTmpDet({ id_producto: d.id_producto, cantidad: d.cantidad, precio_unitario: d.precio_unitario });
    setProdSel({ value: d.id_producto, label: d.nombre_producto, precio: d.precio_unitario });
  };
  const saveEdit = () => {
    if (editIdx === null) return;
    const updated = [...detalles];
    updated[editIdx] = {
      id_producto: tmpDet.id_producto,
      nombre_producto: prodSel.label,
      cantidad: parseInt(tmpDet.cantidad),
      precio_unitario: parseFloat(tmpDet.precio_unitario)
    };
    setDetalles(updated);
    setEditIdx(null);
    setTmpDet({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProdSel(null);
  };

  const formatDate = d => d.toISOString().slice(0, 19).replace('T', ' ');

  const handleSave = async () => {
    if (!detalles.length) {
      setMsgErr('Agrega al menos un producto');
      return;
    }
    setMsgErr('');
    try {
      const payload = {
        ...ventaAct,
        fecha_venta: formatDate(ventaAct.fecha_venta),
        total_venta: total,
        detalles: detalles.map(d => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario
        }))
      };
      const res = await axios.put(`/api/ventas/${ventaAct.numero_factura}`, payload);
      onHide();
      onGuardar(res.data);
    } catch (e) {
      setMsgErr(e.response?.data?.mensaje || 'Error actualizando');
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Label>Usuario</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadUsers}
                onChange={onUserChange}
                value={userSel}
                isClearable
              />
            </Col>
            <Col md={4}>
              <Form.Label>Fecha de Venta</Form.Label>
              <DatePicker
                selected={ventaAct.fecha_venta}
                onChange={d => setVentaAct(prev => ({ ...prev, fecha_venta: d }))}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                className="form-control"
              />
            </Col>
          </Row>
          <hr />
          <h5>{editIdx !== null ? 'Editar Detalle' : 'Agregar Detalle'}</h5>
          <Row>
            <Col md={4}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadProds}
                onChange={onProdChange}
                value={prodSel}
                isDisabled={editIdx !== null}
                isClearable
              />
            </Col>
            <Col md={2}>
              <FormControl
                name="cantidad"
                type="number"
                value={tmpDet.cantidad}
                onChange={onDetChange}
                min={1}
                placeholder="Cantidad"
              />
            </Col>
            <Col md={2}>
              <FormControl
                name="precio_unitario"
                type="number"
                value={tmpDet.precio_unitario}
                disabled
                placeholder="Precio"
              />
            </Col>
            <Col md={2}>
              {editIdx !== null ? (
                <Button onClick={saveEdit}>Guardar</Button>
              ) : (
                <Button onClick={addDetalle}>Agregar</Button>
              )}
            </Col>
          </Row>
          {detalles.length > 0 && (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.cantidad}</td>
                    <td>{d.precio_unitario.toFixed(2)}</td>
                    <td>{(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                    <td>
                      <Button size="sm" onClick={() => startEdit(i, d)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td>{total.toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          )}
          {error && <div className="text-danger">{error}</div>}
          {msgErr && <div className="alert alert-danger">{msgErr}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Actualizar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionVenta;
