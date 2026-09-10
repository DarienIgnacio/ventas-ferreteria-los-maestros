// Funciones Globales para el Carrito en LocalStorage
function obtenerCarrito() {
  const guardado = localStorage.getItem("carrito_ferreteria");
  return guardado ? JSON.parse(guardado) : [];
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.codigo === producto.codigo);

  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad += 1;
    } else {
      alert("No hay suficiente stock en bodega.");
      return;
    }
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito_ferreteria", JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert(`${producto.nombre} fue añadido al carrito.`);
}

function actualizarContadorCarrito() {
  const contador = document.querySelector("#contador-carrito");
  if (!contador) return;
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  contador.textContent = totalItems;
}

// Lógica de Renderizado y Acciones en carrito.html
const tablaCarritoBody = document.querySelector("#tabla-carrito-body");
const botonVaciar = document.querySelector("#vaciar-carrito");
const botonConfirmar = document.querySelector("#boton-confirmar-pedido");

function renderizarTablaCarrito() {
  if (!tablaCarritoBody) return;

  const carrito = obtenerCarrito();
  tablaCarritoBody.replaceChildren();

  if (carrito.length === 0) {
    const filaVacia = document.createElement("tr");
    filaVacia.innerHTML = `<td colspan="5" style="text-align: center;">El carrito está vacío.</td>`;
    tablaCarritoBody.appendChild(filaVacia);
    return;
  }

  let totalGeneral = 0;

  carrito.forEach((prod) => {
    const subtotal = prod.precio * prod.cantidad;
    totalGeneral += subtotal;

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>$${prod.precio.toLocaleString("es-CL")}</td>
      <td>
        <button type="button" onclick="cambiarCantidad('${prod.codigo}', -1)">-</button>
        <span style="margin: 0 0.5rem;">${prod.cantidad}</span>
        <button type="button" onclick="cambiarCantidad('${prod.codigo}', 1)">+</button>
      </td>
      <td>$${subtotal.toLocaleString("es-CL")}</td>
      <td><button type="button" onclick="eliminarDelCarrito('${prod.codigo}')">❌</button></td>
    `;

    tablaCarritoBody.appendChild(fila);
  });

  const filaTotal = document.createElement("tr");
  filaTotal.innerHTML = `
    <td colspan="3" style="text-align: right;"><strong>Total Pedido:</strong></td>
    <td colspan="2"><strong>$${totalGeneral.toLocaleString("es-CL")}</strong></td>
  `;
  tablaCarritoBody.appendChild(filaTotal);
}

function cambiarCantidad(codigo, cambio) {
  let carrito = obtenerCarrito();
  const producto = carrito.find((item) => item.codigo === codigo);

  if (producto) {
    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter((item) => item.codigo !== codigo);
    }
  }

  localStorage.setItem("carrito_ferreteria", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarTablaCarrito();
}

function eliminarDelCarrito(codigo) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => item.codigo !== codigo);
  localStorage.setItem("carrito_ferreteria", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarTablaCarrito();
}

if (botonVaciar) {
  botonVaciar.addEventListener("click", () => {
    localStorage.removeItem("carrito_ferreteria");
    actualizarContadorCarrito();
    renderizarTablaCarrito();
  });
}

if (botonConfirmar) {
  botonConfirmar.addEventListener("click", (e) => {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      e.preventDefault();
      alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
      return;
    }

    localStorage.removeItem("carrito_ferreteria");
    actualizarContadorCarrito();
  });
}

// Inicialización al cargar la página
actualizarContadorCarrito();
renderizarTablaCarrito();