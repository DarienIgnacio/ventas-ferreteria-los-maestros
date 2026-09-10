const formRegistro = document.querySelector("#form-registro");
const formLogin = document.querySelector("#form-login");

// Validar RUN chileno sin puntos ni guion (ej: 19011022K)
function validarRUN(run) {
  const regexRUN = /^[0-9]{7,8}[0-9kK]{1}$/;
  return regexRUN.test(run);
}

// Validar correo restringido a dominios @duoc.cl, @profesor.duoc.cl o @gmail.com
function validarCorreo(correo) {
  const regexCorreo = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regexCorreo.test(correo);
}

// Validación Registro
if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    const runInput = document.querySelector("#run");
    const correoInput = document.querySelector("#correo");
    const claveInput = document.querySelector("#contrasena");

    if (!validarRUN(runInput.value)) {
      alert("El RUN es inválido. Ingrésalo sin puntos ni guion (ej: 19011022K).");
      return;
    }

    if (!validarCorreo(correoInput.value)) {
      alert("Correo inválido. Solo se permiten dominios @duoc.cl, @profesor.duoc.cl y @gmail.com.");
      return;
    }

    if (claveInput.value.length < 4 || claveInput.value.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    alert("¡Registro completado con éxito! Redirigiendo al inicio de sesión...");
    window.location.href = "login.html";
  });
}

// Validación Login
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const correoInput = document.querySelector("#correo-login").value.trim().toLowerCase();
    const claveInput = document.querySelector("#clave-login").value.trim();

    // Credenciales de Administrador por defecto
    if (correoInput === "admin@duoc.cl" && claveInput === "admin123") {
      alert("¡Bienvenido, Administrador!");
      window.location.href = "admin-home.html";
      return;
    }

    // Validación básica de dominios autorizados
    const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const dominioEsValido = dominiosValidos.some((d) => correoInput.endsWith(d));

    if (!dominioEsValido) {
      alert("El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    if (claveInput.length < 4 || claveInput.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    // Si es un cliente normal
    alert("¡Inicio de sesión exitoso como Cliente!");
    window.location.href = "index.html";
  });
}

// Selector dinámico Región / Comuna
const selectRegion = document.querySelector("#region");
const selectComuna = document.querySelector("#comuna");

const comunasPorRegion = {
  coquimbo: ["La Serena", "Coquimbo", "Ovalle", "Vicuña"],
  rm: ["Santiago", "Maipú", "Providencia", "Puente Alto", "Las Condes"]
};

if (selectRegion && selectComuna) {
  selectRegion.addEventListener("change", (e) => {
    const regionSeleccionada = e.target.value;
    selectComuna.replaceChildren();

    const opcionDefecto = document.createElement("option");
    opcionDefecto.value = "";
    opcionDefecto.textContent = "Selecciona una comuna";
    selectComuna.appendChild(opcionDefecto);

    if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
      comunasPorRegion[regionSeleccionada].forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna.toLowerCase().replace(/\s+/g, "");
        opcion.textContent = comuna;
        selectComuna.appendChild(opcion);
      });
    }
  });
}