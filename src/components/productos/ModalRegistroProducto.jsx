import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  manejarCambioImagen,
  manejarRegistroProducto,
  errorCarga,
  listaLaboratorios,
  listaPresentaciones,
  manejarSeleccionLaboratorio,
  manejarSeleccionPresentacion
}) => {
  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <Modal show={mostrarModal} onHide={cerrarModal} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}
        <Form>
          <Form.Group>
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={nuevoProducto.nombre_producto}
              onChange={manejarCambioInput}
              placeholder="Ingrese el nombre"
            />
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

          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={nuevoProducto.precio_unitario}
              onChange={manejarCambioInput}
              placeholder="Ingrese el precio"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={nuevoProducto.stock}
              onChange={manejarCambioInput}
              placeholder="Ingrese el stock"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="id_laboratorio"
              value={nuevoProducto.id_laboratorio}
              onChange={(e) =>
                manejarSeleccionLaboratorio({
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                })
              }
            >
              <option value="">Seleccione un laboratorio</option>
              {listaLaboratorios.map((lab) => (
                <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                  {lab.nombre_laboratorio}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Presentación</Form.Label>
            <Form.Select
              name="id_presentacion"
              value={nuevoProducto.id_presentacion}
              onChange={(e) =>
                manejarSeleccionPresentacion({
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                })
              }
            >
              <option value="">Seleccione una presentación</option>
              {listaPresentaciones.map((pres) => (
                <option key={pres.id_presentacion} value={pres.id_presentacion}>
                  {pres.nombre_presentacion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              name="imagen"
              accept="image/*"
              onChange={manejarCambioImagen}
            />
            <Form.Text className="text-muted">
              (Opcional) Seleccione una imagen para el producto.
            </Form.Text>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cerrarModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={manejarRegistroProducto}>
          Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;
