const botonMenu = document.querySelector("#boton-menu");
const menuPrincipal = document.querySelector("#menu-principal");

function alternarMenu() {
  if (!botonMenu || !menuPrincipal) return;
  const menuAbierto = menuPrincipal.classList.toggle("menu-abierto");
  botonMenu.setAttribute("aria-expanded", String(menuAbierto));
}

if (botonMenu) {
  botonMenu.addEventListener("click", alternarMenu);
}