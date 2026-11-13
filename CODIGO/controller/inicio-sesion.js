
import { servicios } from '../api/servicios.js';


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

  guia: "Guía Local",

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

formularioSesion.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (!formularioSesion.reportValidity()) {
    return;
  }

  const usuario = document.getElementById("correo-acceso").value.trim();
  const nombre = usuario.includes("@") ? usuario.slice(0, usuario.indexOf("@")) : usuario;
  const sesion = {
    id: usuario.toLocaleLowerCase(),
    nombre: nombre || usuario,
    rol: document.querySelector(".boton-rol-sesion[aria-pressed='true']").dataset.rol,
  };
  sessionStorage.setItem("mappal-sesion-demo", JSON.stringify(sesion));
  const destinosPorRol = {
    administrador: "administracion.html",
    guia: "GuiaLocal.html",
  };
  window.location.href = destinosPorRol[sesion.rol] || "index.html";

  const correo = document.getElementById("correo-acceso").value;
  const contrasena = document.getElementById("contrasena-acceso").value;

  const resultado = await servicios.autenticarUsuario(correo, contrasena);

  if (resultado.ok) {
    mensajeSesion.textContent = "Sesión iniciada correctamente";
    mensajeSesion.style.color = "green";
    mensajeSesion.style.display = "block";
  } else {
    mensajeSesion.textContent = resultado.error;
    mensajeSesion.style.color = "red";
    mensajeSesion.style.display = "block";
  }

});
