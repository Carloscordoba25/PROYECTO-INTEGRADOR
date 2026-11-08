const botonesRolSesion = document.querySelectorAll(".boton-rol-sesion");
const modoAcceso = document.getElementById("modo-acceso");
const formularioSesion = document.getElementById("formulario-sesion");
const mensajeSesion = document.getElementById("mensaje-sesion");
const botonRecuperacion = document.getElementById("boton-recuperacion");
const botonVisibilidad = document.getElementById("alternar-contrasena");
const contrasenaAcceso = document.getElementById("contrasena-acceso");
const nombresRoles = {
  explorador: "Explorador",
  prestador: "Prestador Local",
  administrador: "Administrador",
};

botonesRolSesion.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesRolSesion.forEach((otroBoton) => {
      const seleccionado = otroBoton === boton;
      otroBoton.classList.toggle("rol-seleccionado", seleccionado);
      otroBoton.setAttribute("aria-pressed", String(seleccionado));
    });

    modoAcceso.textContent = `Modo ${nombresRoles[boton.dataset.rol]}`;
  });
});

botonVisibilidad.addEventListener("click", () => {
  const mostrarContrasena = contrasenaAcceso.type === "password";
  contrasenaAcceso.type = mostrarContrasena ? "text" : "password";
  botonVisibilidad.setAttribute(
    "aria-label",
    mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
  );
  botonVisibilidad.querySelector(".icono").textContent = mostrarContrasena
    ? "visibility_off"
    : "visibility";
});

botonRecuperacion.addEventListener("click", () => {
  mensajeSesion.textContent =
    "La recuperación estará disponible cuando se conecte el servicio de correo.";
  document.getElementById("correo-acceso").focus();
});

formularioSesion.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!formularioSesion.reportValidity()) {
    return;
  }

  mensajeSesion.textContent =
    "El formulario es válido. Para iniciar sesión, conecta el servicio de autenticación.";
});
