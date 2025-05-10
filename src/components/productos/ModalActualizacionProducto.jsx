import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModal,
  setMostrarModal,
  productoSeleccionado,
  manejarCambioInput,
  manejarCambioImagen,
  manejarActualizarProducto,
  errorCarga,
  laboratorios,
  presentaciones,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoSeleccionado?.nombre_producto || ""}
              onChange={manejarCambioInput}
              placeholder="Nombre del producto"
              maxLength={40}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="id_laboratorio"
              value={productoSeleccionado?.id_laboratorio || ""}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Seleccione un laboratorio</option>
              {laboratorios?.map((lab) => (
                <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                  {lab.nombre_laboratorio}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Presentación</Form.Label>
            <Form.Select
              name="id_presentacion"
              value={productoSeleccionado?.id_presentacion || ""}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Seleccione una presentación</option>
              {presentaciones?.map((pre) => (
                <option key={pre.id_presentacion} value={pre.id_presentacion}>
                  {pre.nombre_presentacion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="vencimiento"
              value={productoSeleccionado?.vencimiento?.slice(0, 10) || ""}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={productoSeleccionado?.precio_unitario || ""}
              onChange={manejarCambioInput}
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productoSeleccionado?.stock || ""}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              name="imagen"
              onChange={manejarCambioImagen}
              accept="image/*"
            />
          </Form.Group>

          {errorCarga && <div className="text-danger">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={manejarActualizarProducto}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
