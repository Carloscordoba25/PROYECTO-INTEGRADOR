<<<<<<< Updated upstream
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
=======
import { servicios } from "../api/servicios.js";

const formulario = document.getElementById("formulario-registro");
const mensaje = document.getElementById("mensaje-registro");
const contrasena = document.getElementById("contrasena-registro");
const confirmacion = document.getElementById("confirmacion-contrasena");
const botonesPerfil = document.querySelectorAll(".opcion-perfil");

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("mensaje-error", esError);
  mensaje.classList.toggle("mensaje-exito", !esError);
>>>>>>> Stashed changes
}

botonesPerfil.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesPerfil.forEach((otroBoton) => {
      const seleccionado = otroBoton === boton;
      otroBoton.classList.toggle("perfil-seleccionado", seleccionado);
      otroBoton.setAttribute("aria-pressed", String(seleccionado));
      otroBoton.querySelector(".insignia-activa").hidden = !seleccionado;
    });
  });
});

function validarContrasenas() {
  confirmacion.setCustomValidity(
    confirmacion.value === contrasena.value
      ? ""
      : "Las contraseñas ingresadas no coinciden."
  );
}

<<<<<<< Updated upstream
botonTurista.addEventListener("click", () => seleccionarPerfil("turista"));
botonPrestador.addEventListener("click", () => seleccionarPerfil("prestador"));
contrasenaRegistro.addEventListener("input", validarContrasenas);
confirmacionContrasena.addEventListener("input", validarContrasenas);

formularioRegistro.addEventListener("submit", (evento) => {
=======
contrasena.addEventListener("input", validarContrasenas);
confirmacion.addEventListener("input", validarContrasenas);

formulario.addEventListener("submit", async (evento) => {
>>>>>>> Stashed changes
  evento.preventDefault();
  validarContrasenas();
  if (!formulario.reportValidity()) return;

  const botonEnviar = formulario.querySelector('[type="submit"]');
  const perfilSeleccionado = document.querySelector(".perfil-seleccionado");
  botonEnviar.disabled = true;

  try {
    const resultado = await servicios.registrarUsuario({
      nombre: formulario.elements.nombre.value.trim(),
      correo: formulario.elements.correo.value.trim(),
      contrasena: contrasena.value,
      rol: perfilSeleccionado.dataset.rol,
    });

    if (!resultado.ok) {
      mostrarMensaje(resultado.error, true);
      return;
    }

    mostrarMensaje("Cuenta creada correctamente. Ya puedes iniciar sesión.");
    formulario.reset();
    contrasena.setCustomValidity("");
    confirmacion.setCustomValidity("");
  } catch (error) {
    console.error("No se pudo crear la cuenta:", error);
    mostrarMensaje("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.", true);
  } finally {
    botonEnviar.disabled = false;
  }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
});
