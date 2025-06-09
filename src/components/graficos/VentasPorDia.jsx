import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const VentasPorDia = ({ fechas, total_ventas }) => {
    console.log("Fechas:", fechas);
console.log("Totales:", total_ventas);

  const data = {
    labels: fechas, // Fechas de ventas
    datasets: [
      {
        label: 'Ventas (C$)',
        data: total_ventas, // Total de ventas por día
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
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
        text: 'Fecha',
      },
      ticks: {
        autoSkip: false, // ← ❗ Agrega esto
        maxRotation: 90, // ← Gira las etiquetas si son muchas
        minRotation: 45, // ← Opcional
      },
    },
  },
};
  return (
    <Card>
      <Card.Body>
        <Card.Title>Ventas por Día</Card.Title>
        <div style={{ height: "300px", justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Bar data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default VentasPorDia;
