import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionLaboratorio = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  laboratorioEditado,
  manejarCambioInputEdicion,
  actualizarLaboratorio,
  errorCarga,
}) => {
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreLaboratorio">
            <Form.Label>Nombre del Laboratorio</Form.Label>
            <Form.Control
              type="text"
              name="nombre_laboratorio"
              value={laboratorioEditado?.nombre_laboratorio || ""}
              onChange={manejarCambioInputEdicion}
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
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarLaboratorio}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionLaboratorio;
