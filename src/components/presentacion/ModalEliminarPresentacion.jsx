import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionPresentacion = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarPresentacion,
}) => {
  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar esta presentacion?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarPresentacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default ModalEliminacionPresentacion;
