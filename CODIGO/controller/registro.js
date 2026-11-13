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

contrasena.addEventListener("input", validarContrasenas);
confirmacion.addEventListener("input", validarContrasenas);

formulario.addEventListener("submit", async (evento) => {
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
    confirmacion.setCustomValidity("");
  } catch (error) {
    console.error("No se pudo crear la cuenta:", error);
    mostrarMensaje("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.", true);
  } finally {
    botonEnviar.disabled = false;
  }
});
