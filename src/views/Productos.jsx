import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos';
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import ModalEdicionProducto from '../components/productos/ModalActualizacionProducto';
import ModalEliminacionProducto from '../components/productos/ModalEliminarProducto';
import Paginacion from '../components/paginacion/Paginacion';
import CuadroBusquedas from '../components/busquedas/CuadroBusqueda';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Container, Button, Row, Col } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    id_laboratorio: '',
    id_presentacion: '',
    vencimiento: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });
  const [listaLaboratorios, setListaLaboratorios] = useState([]);
    const [listaPresentaciones, setlistaPresentaciones] = useState([]);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const elementosPorPagina = 10;
  //Modal actualizar
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  //Modal Eliminar
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerLaboratorios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/laboratorios');
      if (!respuesta.ok) throw new Error('Error al cargar los laboratorios');
      const datos = await respuesta.json();
      setListaLaboratorios(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerPresentaciones = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/presentaciones');
      if (!respuesta.ok) throw new Error('Error al cargar las presentaciones');
      const datos = await respuesta.json();
      setlistaPresentaciones(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerLaboratorios();
    obtenerPresentaciones();
  }, []);

  useEffect(() => {
    const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina);
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(totalPaginas);
    }
  }, [productosFiltrados]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_laboratorio ||
        !nuevoProducto.id_presentacion || !nuevoProducto.vencimiento ||
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        id_laboratorio: '',
        id_presentacion: '',
        vencimiento: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

 

 const eliminaProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('Error al eliminar el producto');

      setMostrarModalEliminacion(false);
      await obtenerProductos();
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarProducto = async () => {
    if (!productoEditado?.nombre_producto || !productoEditado?.id_laboratorio|| !productoEditado.id_presentacion||
       !productoEditado?.precio_unitario || !productoEditado?.precio_unitario || !productoEditado?.stock ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoEditado.id_producto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: productoEditado.nombre_producto,
          id_laboratorio: productoEditado.id_laboratorio,
          id_presentacion: productoEditado.id_presentacion,
          precio_unitario : productoEditado.precio_unitario,
          stock : productoEditado.stock,
          imagen : productoEditado.imagen,
        }),
      });

      if (!respuesta.ok) throw new Error('Error al actualizar el producto');

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado(producto);
    setMostrarModalEdicion(true);
  };

 const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase()//Cambia las mayusculas por minusculas 
    .normalize("NFD")// Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los signos diacríticos (tildes)
    setTextoBusqueda(texto);
    const filtrados = listaProductos.filter(producto => {
      const id = (producto.id_producto || '').toString();
      const nombre = (producto.nombre_producto || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      const laboratorio = (producto.nombre_laboratorio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      return id.includes(texto) || nombre.includes(texto) || laboratorio.includes(texto);
    });

    setProductosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

//GgenerarPDFProductos()
const generarPDFProductos = () => {
  const doc = new jsPDF();

  // Encabezado del documento
  doc.setFillColor(28, 41, 51);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("Lista de productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

  const columnas = ["ID", "Nombre", "Laboratorio", "Presentación","Vencimiento", "Precio", "Stock"];
  const filas = productosFiltrados.map((producto) => {
    const fechaVencimiento = new Date(producto.vencimiento);
    const dia = String(fechaVencimiento.getDate()).padStart(2, '0');
    const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0');
    const anio = fechaVencimiento.getFullYear();
    const vencimientoFormateado = `${dia}/${mes}/${anio}`;

    return [
      producto.id_producto,
      producto.nombre_producto,
      producto.nombre_laboratorio,
      producto.nombre_presentacion,
      vencimientoFormateado,
      `C$ ${producto.precio_unitario}`,
      producto.stock,
    ];
  });

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 40,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2 },
    margin: { top: 20, left: 14, right: 14 },
    tableLineWidth: "auto",
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
    },
    pageBreak: "auto",
    rowPageBreak: "auto",

    didDrawPage: function (data) {
      const anchoPagina = doc.internal.pageSize.getWidth();
      const alturaPagina = doc.internal.pageSize.getHeight();
      const numeroPagina = doc.internal.getNumberOfPages();

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
  });

  const totalPaginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Página ${i} de ${totalPaginas}`, 190, 290, { align: 'right' });
  }

  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const nombreArchivo = `productos${dia}-${mes}-${anio}.pdf`;

  doc.save(nombreArchivo);
};

 const exportarExelProductos = () => {
  //estructura de datos para la hoja de exel
  const datos = productosFiltrados.map((producto) => ({
  ID: producto.id_producto,
  Nombre: producto.nombre_producto,
  Descripcion: producto.nombre_laboratorio,
  Categoria: producto.nombre_presentacion,
  Vencimiento: producto.vencimiento,
  Precio: producto.precio_unitario,
  Stock: producto.stock
  }));

  //crea la hoja y el libro exel
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

  //crear el archivo binario
  const exelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array'});

  //guardar el exel con nombre basado en la facha actual
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  const nombreArchivo = `Productos ${dia} ${mes} ${anio}.xlsx`;

  //guardar el archivo
  const blob = new Blob ([exelBuffer], { type: 'application/octet-stream'});
  saveAs(blob, nombreArchivo)
 }


//generar pdf con todos los datos de 1 producto
const generarPDFDetallesproducto = (producto) => {
  const pdf = new jsPDF();
  const anchoPagina = pdf.internal.pageSize.getWidth();

  // Encabezado
  pdf.setFillColor(28, 41, 51);
  pdf.rect(0, 0, 220, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text(producto.nombre_producto, anchoPagina / 2, 18, { align: "center" });

  let posicionY = 50;

  if (producto.imagen) {
    try {
      const propiedadesImagen = pdf.getImageProperties(producto.imagen);
      const anchoImagen = 100;
      const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
      const posicionX = (anchoPagina - anchoImagen) / 2;

      pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
      posicionY = 40 + altoImagen + 10;
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      // Podrías mostrar una advertencia en el PDF o en consola si la imagen está mal codificada.
    }
  }

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.text(`Descripción: ${producto.descripcion_producto}`, anchoPagina / 2, posicionY, { align: "center" });
  pdf.text(`Categoría: ${producto.id_categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
  pdf.text(`Precio: ${producto.precio_unitario}`, anchoPagina / 2, posicionY + 20, { align: "center" });
  pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 30, { align: "center" });

  pdf.save(`${producto.nombre_producto}.pdf`);
};


  return (
    <>
<Container className="mt-1" 
          style={{textAlign:"center"}}>
<Col md={6}>
      <h4>Productos</h4>
</Col>
        
        <Row>
         
          <Col lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col md={4}></Col>
          <Col lg={3}>
          <Button variant="success" 
            onClick={() => setMostrarModal(true)} 
            style={{ width: "100%" }}
            className='btn-animado'
            >
            <i class="bi bi-file-plus"></i> Agregar Producto 
            </Button></Col>
        </Row>

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />
<Row>
    <Col md={6}></Col>

          <Col md={3}>
             <Button variant='primary'
                    className='me-3 btn-animado'
                    onClick={ exportarExelProductos}
                    style={{width: "100%"}}
                    >
                      Generar Exel
                  </Button>
                </Col>
                
          
                 <Col  lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3 btn-animado"
            onClick={generarPDFProductos}
            variant="secondary"
            style= {{width: "100%"}}
            >
            Generar Reporte PDF 
          </Button>
          </Col>
          </Row>

        <Paginacion
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          laboratorios={listaLaboratorios}
          presentaciones={listaPresentaciones}
        />

         <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorCarga}
          laboratorios={listaLaboratorios}
          presentaciones={listaPresentaciones}
        />

        <ModalEliminacionProducto
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminaProducto}
        />

      </Container>

    
        
      
    </>
  );
};

export default Productos;
