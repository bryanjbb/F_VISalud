// ModalRegistroLaboratorio.jsx
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroLaboratorio = ({
  mostrarModal,
  setMostrarModal,
  nuevoLaboratorio,
  manejarCambioInput,
  agregarLaboratorio,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreLaboratorio">
            <Form.Label>Nombre del Laboratorio</Form.Label>
            <Form.Control
              type="text"
              name="nombre_laboratorio"
              value={nuevoLaboratorio.nombre_laboratorio}
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
        <Button variant="primary" onClick={agregarLaboratorio}>
          Guardar Laboratorio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroLaboratorio;
