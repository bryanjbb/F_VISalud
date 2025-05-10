import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
  mostrarModal,
  setMostrarModal,
  producto,
  eliminarProducto,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el producto{" "}
        <strong>{producto?.nombre_producto}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => eliminarProducto(producto?.id_producto)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;
