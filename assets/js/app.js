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

// Filtros
if (botonTodos) {
  botonTodos.addEventListener("click", () => mostrarProductos(obtenerProductos()));
}

if (botonDisponibles) {
  botonDisponibles.addEventListener("click", () => {
    const todos = obtenerProductos();
    const disponibles = todos.filter((p) => p.stock > 0);
    mostrarProductos(disponibles);
  });
}

// Inicializar Catálogo
if (contenedorProductos) {
  mostrarProductos(obtenerProductos());
}

// Vista Detalle de Producto
const contenedorDetalle = document.querySelector("#detalle-producto-container");

if (contenedorDetalle) {
  const urlParams = new URLSearchParams(window.location.search);
  const codigoProducto = urlParams.get("codigo");
  const listaProductos = obtenerProductos();
  const productoEncontrado = listaProductos.find(p => p.codigo === codigoProducto);

  if (productoEncontrado) {
    contenedorDetalle.replaceChildren();

    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    const etiqueta = document.createElement("p");
    etiqueta.classList.add("etiqueta");
    etiqueta.textContent = productoEncontrado.categoria;

    const titulo = document.createElement("h1");
    titulo.textContent = productoEncontrado.nombre;

    const codigo = document.createElement("p");
    codigo.innerHTML = `<strong>Código:</strong> ${productoEncontrado.codigo}`;

    const desc = document.createElement("p");
    desc.textContent = productoEncontrado.descripcion || "Sin descripción disponible.";

    const precio = document.createElement("p");
    precio.innerHTML = `<strong>Precio:</strong> $${productoEncontrado.precio.toLocaleString("es-CL")}`;

    const stock = document.createElement("p");
    stock.innerHTML = `<strong>Stock disponible:</strong> ${productoEncontrado.stock} unidades`;

    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.textContent = "Añadir al carrito";
    botonAgregar.disabled = productoEncontrado.stock === 0;
    botonAgregar.addEventListener("click", () => agregarAlCarrito(productoEncontrado));

    const botonVolver = document.createElement("a");
    botonVolver.href = "productos.html";
    botonVolver.classList.add("boton");
    botonVolver.style.marginLeft = "0.5rem";
    botonVolver.textContent = "Volver al catálogo";

    tarjeta.appendChild(etiqueta);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(codigo);
    tarjeta.appendChild(desc);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(stock);
    tarjeta.appendChild(botonAgregar);
    tarjeta.appendChild(botonVolver);

    contenedorDetalle.appendChild(tarjeta);
  }
}