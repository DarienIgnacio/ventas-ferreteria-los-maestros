const contenedorProductos = document.querySelector("#grilla-productos");
const botonTodos = document.querySelector("#mostrar-todas");
const botonDisponibles = document.querySelector("#mostrar-disponibles");

// Obtener productos desde LocalStorage
function obtenerProductos() {
  const guardados = localStorage.getItem("productos_ferreteria");
  if (!guardados) {
    localStorage.setItem("productos_ferreteria", JSON.stringify(productosIniciales));
    return productosIniciales;
  }
  return JSON.parse(guardados);
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");

  // Tag de Imagen
  const imagen = document.createElement("img");
  imagen.src = producto.imagen || "assets/img/placeholder.png"; // Imagen por defecto si no existe
  imagen.alt = producto.nombre;
  imagen.classList.add("imagen-producto");

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const categoria = document.createElement("p");
  categoria.textContent = `Categoría: ${producto.categoria}`;

  const precio = document.createElement("p");
  precio.textContent = `Precio: $${producto.precio.toLocaleString("es-CL")}`;

  const stock = document.createElement("p");
  stock.textContent = `Stock: ${producto.stock} unidades`;

  if (producto.stock > 0 && producto.stock <= producto.stockCritico) {
    stock.textContent = `¡Últimas ${producto.stock} unidades disponibles!`;
    stock.classList.add("aviso-cupos");
  }

  if (producto.stock === 0) {
    stock.textContent = "Producto agotado";
    stock.classList.add("actividad-completa");
  }

  const botonDetalle = document.createElement("a");
  botonDetalle.href = `detalle-producto.html?codigo=${producto.codigo}`;
  botonDetalle.classList.add("boton");
  botonDetalle.style.marginRight = "0.5rem";
  botonDetalle.textContent = "Ver Detalle";

  const botonAgregar = document.createElement("button");
  botonAgregar.type = "button";
  botonAgregar.textContent = "Añadir al carrito";
  botonAgregar.disabled = producto.stock === 0;
  botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(categoria);
  tarjeta.appendChild(precio);
  tarjeta.appendChild(stock);
  tarjeta.appendChild(botonDetalle);
  tarjeta.appendChild(botonAgregar);

  return tarjeta;
}

// Renderizar lista
function mostrarProductos(lista) {
  if (!contenedorProductos) return;
  contenedorProductos.replaceChildren();

  for (const prod of lista) {
    const tarjeta = crearTarjetaProducto(prod);
    contenedorProductos.appendChild(tarjeta);
  }
}

// Inicializar Catálogo
if (contenedorProductos) {
  mostrarProductos(obtenerProductos());
}

