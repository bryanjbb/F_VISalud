import React from 'react';
import { Table, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../paginacion/Paginacion';

const TablaProductos = ({
  productos,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  if (cargando) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Laboratorio</th>
            <th>Presentación</th>
            <th>Vencimiento</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.nombre_laboratorio || 'N/A'}</td>
              <td>{producto.nombre_presentacion || 'N/A'}</td>
              <td>{new Date(producto.vencimiento).toLocaleDateString('en-ES')}</td>
              <td>{parseFloat(producto.precio_unitario).toFixed(2)}</td>
              <td>{producto.stock}</td>
              <td>
                {producto.imagen_url ? (
                  <img
                    src={`data:image/png;base64,${producto.imagen}`}
                    alt={producto.nombre_producto}
                    style={{ maxWidth: '100px' }}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td className="text-center" style={{ whiteSpace: 'nowrap' }} > 
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2 btn-animado"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className='btn-animado'
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
  
    </>
  );
};

export default TablaProductos;
