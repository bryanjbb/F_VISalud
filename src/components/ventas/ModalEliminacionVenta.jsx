import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({
  show,
  onHide,
  venta,
  onConfirmar
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {venta ? (
          <>
            <p>¿Estás seguro de que deseas eliminar esta venta?</p>
            <p><strong>Total:</strong> ${parseFloat(venta.total_venta).toFixed(2)}</p>
          </>
        ) : (
          <p>¿Estás seguro de que deseas eliminar esta venta?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEliminacionVenta;
