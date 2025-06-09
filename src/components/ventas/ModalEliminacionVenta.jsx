import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarVenta,
  ventaSeleccionada // opcional: para mostrar info del laboratorio/presentación
}) => {
  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ventaSeleccionada ? (
          <>
            <p>¿Estás seguro de que deseas eliminar esta venta?</p>
            <p><strong>Total:</strong> ${parseFloat(ventaSeleccionada.total_venta).toFixed(2)}</p>
          </>
        ) : (
          <p>¿Estás seguro de que deseas eliminar esta venta?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarVenta}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;
