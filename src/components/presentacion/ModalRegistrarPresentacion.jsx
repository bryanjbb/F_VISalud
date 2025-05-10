// ModalRegistroLaboratorio.jsx
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroPresentacion= ({
  mostrarModal,
  setMostrarModal,
  nuevaPresentaciones,
  manejarCambioInput,
  agregarPresentacion,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Presentacion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombrePresentacion">
            <Form.Label>Nombre de la Presentacion</Form.Label>
            <Form.Control
              type="text"
              name="nombre_presentacion"
              value={nuevaPresentaciones.nombre_presentacion}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 30 caracteres)"
              maxLength={30}
              required
            />
          </Form.Group>
          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarPresentacion}>
          Guardar Presentacion
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroPresentacion;
