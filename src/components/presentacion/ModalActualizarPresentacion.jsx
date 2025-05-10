import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionPresentacion = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  PresentacionEditada,
  manejarCambioInputEdicion,
  actualizarPresentacion,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Presentacion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombrePresentacion">
            <Form.Label>Nombre de la Presentacion</Form.Label>
            <Form.Control
              type="text"
              name="nombre_presentacion"
              value={PresentacionEditada?.nombre_presentacion || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarPresentacion}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionPresentacion;