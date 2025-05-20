import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditado,
  manejarCambioInputEdicion,
  actualizarProducto,
  errorCarga,
  laboratorios,
  presentaciones,

}) => {
  
  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditado?.nombre_producto || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Nombre del producto"
              maxLength={30}
              required
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="formLaboratorioProducto">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="id_laboratorio"
              value={productoEditado?.id_laboratorio || ""}
              onChange={manejarCambioInputEdicion}
              required
            >
                <option value="">Selecciona un laboratorio</option>
             {Array.isArray(laboratorios) && laboratorios.map((laboratorio) => (
                <option key={laboratorio.id_laboratorio} value={laboratorio.id_laboratorio}>
                  {laboratorio.nombre_laboratorio}
                </option>
              ))}

            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3" controlId="formPrecentacionProducto">
            <Form.Label>Presentación</Form.Label>
            <Form.Select
              name="id_presentacion"
              value={productoEditado?.id_presentacion || ""}
              onChange={manejarCambioInputEdicion}
              required
            >
                <option value="">Selecciona una presentacion</option>
             {Array.isArray(presentaciones) && presentaciones.map((presentacion) => (
                <option key={presentacion.id_presentacion} value={presentacion.id_presentacion}>
                  {presentacion.nombre_presentacion}
                </option>
              ))}

            </Form.Select>
          </Form.Group>


            <Form.Group className="mb-3" controlId="formVencimientoProducto">
               <Form.Label>Fecha de Vencimiento</Form.Label>
               <Form.Control
                      type="date"
                      name="vencimiento"
                      value={
                        productoEditado?.vencimiento
                          ? new Date(productoEditado.vencimiento)
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                      onChange={manejarCambioInputEdicion}
                    />
               </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={productoEditado?.precio_unitario || ""}
              onChange={manejarCambioInputEdicion}
              min="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productoEditado?.stock || ""}
              onChange={manejarCambioInputEdicion}
                min="0"
              required
            />
          </Form.Group>

            <Form.Group className="mb-3" controlId="formImagenProducto">
              <Form.Label>Imagen</Form.Label>
              {productoEditado?.imagen && (
                <div>
                  <img
                    src={`data:image/png;base64,${productoEditado.imagen}`}
                    alt="Imagen actual"
                    style={{ maxWidth: '100px', marginBottom: '10px' }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      manejarCambioInputEdicion({
                        target: { name: 'imagen', value: reader.result.split(',')[1] }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Form.Group>
          {errorCarga && <div className="text-danger">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={actualizarProducto}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
