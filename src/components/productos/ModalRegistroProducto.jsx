import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
  errorCarga,
  laboratorios, // Lista de categorías obtenidas
  presentaciones

}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={nuevoProducto.nombre_producto}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 30 caracteres)"
              maxLength={30}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLaboratorioProducto">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="id_laboratorio"
              value={nuevoProducto.id_laboratorio}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona un laboratorio</option>
              {laboratorios.map((laboratorio) => (
                <option key={laboratorio.id_laboratorio} value={laboratorio.id_laboratorio}>
                  {laboratorio.nombre_laboratorio}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

            <Form.Group className="mb-3" controlId="formPresentacionProducto">
            <Form.Label>Presentacion</Form.Label>
            <Form.Select
              name="id_presentacion"
              value={nuevoProducto.id_presentacion}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona una presentacion</option>
              {presentaciones.map((presentacion) => (
                <option key={presentacion.id_presentacion} value={presentacion.id_presentacion}>
                  {presentacion.nombre_presentacion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

            <Form.Group>
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="vencimiento"
              value={nuevoProducto.vencimiento}
              onChange={manejarCambioInput}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioProducto">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={nuevoProducto.precio_unitario}
              onChange={manejarCambioInput}
              placeholder="Ingresa el precio"
              min="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={nuevoProducto.stock}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad en stock"
              min="0"
              required
            />
          </Form.Group>
            <Form.Group className="mb-3" controlId="formImagenProducto">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      manejarCambioInput({
                        target: { name: 'imagen', value: reader.result.split(',')[1] } // Extrae solo la parte Base64
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Form.Group>          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarProducto}>
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;