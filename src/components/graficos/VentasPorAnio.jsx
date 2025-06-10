import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorAño = ({ años, total_ventas }) => {
  const data = {
    labels: años, // Ej: [2022, 2023, 2024, 2025]
    datasets: [
      {
        label: 'Ventas por Año (C$)',
        data: total_ventas,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgb(255, 159, 64)',
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
          text: 'Año',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Ventas por Año</Card.Title>
        <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default VentasPorAño;
