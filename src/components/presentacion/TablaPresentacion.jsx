import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../paginacion/Paginacion';

const TablaPresentaciones = ({
  presentaciones,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion
}) => {
  if (cargando) {
    return <div>Cargando presentaciones...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
           <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {presentaciones.map((presentacion) => (
            <tr key={presentacion.id_presentacion}>
              <td>{presentacion.id_presentacion}</td>
              <td>{presentacion.nombre_presentacion}</td>
              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(presentacion)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(presentacion)}
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

export default TablaPresentaciones;
