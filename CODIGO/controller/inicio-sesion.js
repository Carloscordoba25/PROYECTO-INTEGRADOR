import { servicios } from "../api/servicios.js";

const botonesRol = document.querySelectorAll(".boton-rol-sesion");
const modoAcceso = document.getElementById("modo-acceso");
const formulario = document.getElementById("formulario-sesion");
const mensaje = document.getElementById("mensaje-sesion");
const botonRecuperacion = document.getElementById("boton-recuperacion");
const botonVisibilidad = document.getElementById("alternar-contrasena");
const contrasena = document.getElementById("contrasena-acceso");
const nombresRoles = {
  turista: "Turista",
  prestador: "Prestador Local",
  administrador: "Administrador",
};

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("mensaje-error", esError);
  mensaje.classList.toggle("mensaje-exito", !esError);
}

botonesRol.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesRol.forEach((otroBoton) => {
      const seleccionado = otroBoton === boton;
      otroBoton.classList.toggle("rol-seleccionado", seleccionado);
      otroBoton.setAttribute("aria-pressed", String(seleccionado));
    });
    modoAcceso.textContent = `Modo ${nombresRoles[boton.dataset.rol]}`;
  });
});

botonVisibilidad.addEventListener("click", () => {
  const mostrarContrasena = contrasena.type === "password";
  contrasena.type = mostrarContrasena ? "text" : "password";
  botonVisibilidad.setAttribute(
    "aria-label",
    mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
  );
  botonVisibilidad.querySelector(".icono").textContent = mostrarContrasena
    ? "visibility_off"
    : "visibility";
});

botonRecuperacion.addEventListener("click", () => {
  mostrarMensaje("La recuperación de contraseña aún no está disponible.");
  document.getElementById("correo-acceso").focus();
});

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (!formulario.reportValidity()) return;

  const correo = document.getElementById("correo-acceso").value.trim();
  const botonEnviar = formulario.querySelector('[type="submit"]');
  botonEnviar.disabled = true;

  try {
    const resultado = await servicios.autenticarUsuario(correo, contrasena.value);
    if (!resultado.ok) {
      mostrarMensaje(resultado.error, true);
      return;
    }

    const rolSeleccionado = document.querySelector(
      ".boton-rol-sesion[aria-pressed='true']"
    ).dataset.rol;
    if (resultado.data.rol !== rolSeleccionado) {
      servicios.cerrarSesion();
      mostrarMensaje(
        `Esta cuenta está registrada como ${nombresRoles[resultado.data.rol] || resultado.data.rol}. Selecciona ese tipo de cuenta para continuar.`,
        true
      );
      return;
    }

    const destinosPorRol = { administrador: "administracion.html" };
    window.location.assign(destinosPorRol[resultado.data.rol] || "index.html");
  } catch (error) {
    console.error("No se pudo iniciar sesión:", error);
    mostrarMensaje("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.", true);
  } finally {
    botonEnviar.disabled = false;
  }
});
