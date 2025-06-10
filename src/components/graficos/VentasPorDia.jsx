import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorSemana = ({ fechas, total_ventas }) => {
  const data = {
    labels: fechas, // Ej: ["Enero - Semana 1", ...]
    datasets: [
      {
        label: 'Ventas (C$)',
        data: total_ventas,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Córdobas (C$)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Semana',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Ventas Semanales por Mes</Card.Title>
        <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default VentasPorSemana;

