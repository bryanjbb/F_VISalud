import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionLaboratorio = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarLaboratorio,
}) => {
  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar este laboratorio?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarLaboratorio}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionLaboratorio;
