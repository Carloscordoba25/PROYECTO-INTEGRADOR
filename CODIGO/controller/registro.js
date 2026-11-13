const botonTurista = document.getElementById("boton-turista");
const botonPrestador = document.getElementById("boton-prestador");
const seccionTurista = document.getElementById("seccion-turista");
const seccionPrestador = document.getElementById("seccion-prestador");
const textoAccesibilidad = document.getElementById("texto-accesibilidad");
const formularioRegistro = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");
const contrasenaRegistro = document.getElementById("contrasena-registro");
const confirmacionContrasena = document.getElementById("confirmacion-contrasena");

function seleccionarPerfil(tipoPerfil) {
  const esTurista = tipoPerfil === "turista";

  botonTurista.classList.toggle("perfil-seleccionado", esTurista);
  botonPrestador.classList.toggle("perfil-seleccionado", !esTurista);
  botonTurista.setAttribute("aria-pressed", String(esTurista));
  botonPrestador.setAttribute("aria-pressed", String(!esTurista));
  document.getElementById("insignia-turista").hidden = !esTurista;
  document.getElementById("insignia-prestador").hidden = esTurista;
  seccionTurista.hidden = !esTurista;
  seccionPrestador.hidden = esTurista;
  seccionTurista.classList.toggle("seccion-oculta", !esTurista);
  seccionPrestador.classList.toggle("seccion-oculta", esTurista);
  seccionPrestador.querySelectorAll("input, select").forEach((campo) => {
    campo.disabled = esTurista;
  });
  textoAccesibilidad.textContent = esTurista
    ? "Opcional para Turistas / Recomendado"
    : "Recomendado para Prestadores";
}

function validarContrasenas() {
  confirmacionContrasena.setCustomValidity(
    confirmacionContrasena.value === contrasenaRegistro.value
      ? ""
      : "Las claves ingresadas no coinciden."
  );
}

botonTurista.addEventListener("click", () => seleccionarPerfil("turista"));
botonPrestador.addEventListener("click", () => seleccionarPerfil("prestador"));
contrasenaRegistro.addEventListener("input", validarContrasenas);
confirmacionContrasena.addEventListener("input", validarContrasenas);

formularioRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  validarContrasenas();

  if (!formularioRegistro.reportValidity()) {
    return;
  }

});
