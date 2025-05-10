import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../paginacion/Paginacion';
import ModalEliminacionLaboratorio from './ModalEliminarLaboratorio';
import ModalEdicionLaboratorio from './ModalactualizacionLaboratorio';

const TablaLaboratorios = ({
  laboratorios,
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
    return <div>Cargando laboratorios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Laboratorio</th>
            <th>Nombre</th>
            <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {laboratorios.map((laboratorio) => (
            <tr key={laboratorio.id_laboratorio}>
              <td>{laboratorio.id_laboratorio}</td>
              <td>{laboratorio.nombre_laboratorio}</td>
              <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(laboratorio)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(laboratorio)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalElementos > elementosPorPagina && (
        <Paginacion
          totalElementos={totalElementos}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          onPageChange={establecerPaginaActual}
        />
      )}
    </>
  );
};

export default TablaLaboratorios;
