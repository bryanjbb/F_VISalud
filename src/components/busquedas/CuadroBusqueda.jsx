import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda  }) => {
  return (
    <div className="position-relative mb-3" style={{ position: "relative", width: "100%" }}>
  <Form.Control
    type="text"
    value={textoBusqueda}
    onChange={manejarCambioBusqueda}
    placeholder="Buscar por nombre o descripción..."
  />
  {textoBusqueda && (
    <div
      onClick={() => manejarCambioBusqueda({ target: { value: "" } })}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#555",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ cursor: "pointer" }}
      >
        <line x1="4" y1="4" x2="16" y2="16" />
        <line x1="16" y1="4" x2="4" y2="16" />
      </svg>
    </div>
  )}
</div>

  );
};



export default CuadroBusquedas;