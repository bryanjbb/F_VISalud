import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPorMes';
import VentasPorDia from '../components/graficos/VentasPorDia';
import VentasPorAño from '../components/graficos/VentasPorAnio';

const Estadisticas = () => {
  const [meses, setMeses] = useState([]);
  const [totalesPorMes, setTotalesPorMes] = useState([]);
  const [dias, setDias] = useState([]);
  const [totalesPorDia, setTotalesPorDia] = useState([]);

useEffect(() => {
  const cargarVentas = async () => {
    try {
      // Ventas por mes
      const resMes = await fetch('http://localhost:3000/api/totalventaspormes');
      if (!resMes.ok) throw new Error('Error al cargar ventas por mes');
      const dataMes = await resMes.json();
      setMeses(dataMes.map(item => item.mes));
      setTotalesPorMes(dataMes.map(item => item.total_ventas));

      // Ventas por semana (por día)
      const resDia = await fetch('http://localhost:3000/api/totalventasporsemana');
      if (!resDia.ok) throw new Error('Error al cargar ventas por semana');
      const dataDia = await resDia.json();
      setDias(dataDia.map(item => item.dia));
      setTotalesPorDia(dataDia.map(item => item.total_ventas));

      // Ventas por año
      const resAnio = await fetch('http://localhost:3000/api/totalventasporanio');
      if (!resAnio.ok) throw new Error('Error al cargar ventas por año');
      const dataAnio = await resAnio.json();
      setAnios(dataAnio.map(item => item.anio));
      setTotalesPorAnio(dataAnio.map(item => item.total_ventas));

    } catch (error) {
      console.error('Error al cargar ventas:', error);
      alert('Error al cargar ventas: ' + error.message);
    }
  };

  cargarVentas();
}, []);

  return (
    <Container className="mt-5">
      <br />
      <h4>Estadísticas</h4>
      <Row className="mt-4">
        <Col xs={12} md={6} className="mb-4">
          <VentasPorMes meses={meses} totales_por_mes={totalesPorMes} />
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <VentasPorDia fechas={dias} total_ventas={totalesPorDia} />
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;
