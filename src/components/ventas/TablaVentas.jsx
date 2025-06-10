// Importaciones necesarias para el componente visual
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


   const usuarioLogueado = localStorage.getItem("usuario") || "Usuario Desconocido";

const TablaVentas = ({ ventas, cargando, error, obtenerDetalles, abrirModalEliminacion,
   abrirModalActualizacion  }) => {
  if (cargando) {
    return <div>Cargando ventas...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;     // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Numero de Factura</th>
          <th>Fecha de Venta</th>
          <th>Usuario</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={`${venta.numero_factura}`}>
            <td>{venta.numero_factura}</td>
            <td>{new Date(venta.fecha_venta).toLocaleString('es-ES', {
                //Muestra los horas y am o pm
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
            })}</td>

            <td>{venta.usuario || "Usuario desconocido"}</td>
            <td>C$ {venta.total_venta}</td>
            <td  >
            
                <div className="text-center" style={{ whiteSpace: 'nowrap' }} >
                  <Button
                    variant="outline-success"
                    size="sm"
                    className='me-2 btn-animado'
                    onClick={() => obtenerDetalles(venta.numero_factura)}
                    
                  >
                    <i className="bi bi-list-ul"></i>
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className='me-2 btn-animado'
                    onClick={() => abrirModalActualizacion(venta)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    className='me-2 btn-animado'
                    onClick={() => abrirModalEliminacion(venta)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>

                  
                </div>
              </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};



// Exportación del componente
export default TablaVentas;