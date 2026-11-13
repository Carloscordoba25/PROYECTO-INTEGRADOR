import { servicios } from "../api/servicios.js";

const pagina = document.body.dataset.page;
const sesionResultado = servicios.obtenerSesionActiva();
const sesion = sesionResultado.ok ? sesionResultado.data : null;

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function mostrarMensaje(contenedor, texto, esError = false) {
  if (!contenedor) return;
  if (contenedor.matches("p")) {
    contenedor.textContent = texto;
    contenedor.classList.toggle("mensaje-error", esError);
    return;
  }
  const mensaje = crearElemento("p", "mensaje-formulario", texto);
  mensaje.classList.toggle("mensaje-error", esError);
  contenedor.replaceChildren(mensaje);
}

function obtenerLugares() {
  const resultado = servicios.listarLugares();
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.data;
}

function obtenerFavoritos() {
  if (!sesion) return [];
  const resultado = servicios.listarFavoritos(sesion.id);
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.data;
}

function crearTarjetaLugar(lugar, favoritos, esAdministrador = false) {
  const tarjeta = crearElemento("article", "tarjeta-publicacion tarjeta-lugar");
  tarjeta.dataset.lugarId = lugar.id;
  tarjeta.append(
    crearElemento("span", "etiqueta-publicacion", lugar.categoria || "Lugar recomendado"),
    crearElemento("h3", "", lugar.nombre),
    crearElemento("p", "ubicacion-publicacion", lugar.direccion),
    crearElemento(
      "p",
      "detalle-guia",
      `Coordenadas: ${Number(lugar.lat).toFixed(5)}, ${Number(lugar.lng).toFixed(5)}`
    )
  );

  if (sesion) {
    const esFavorito = favoritos.has(lugar.id);
    const botonFavorito = crearElemento(
      "button",
      "boton boton-secundario boton-moderacion",
      esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"
    );
    botonFavorito.type = "button";
    botonFavorito.dataset.alternarFavorito = lugar.id;
    botonFavorito.setAttribute("aria-pressed", String(esFavorito));
    tarjeta.append(botonFavorito);
  }

  if (esAdministrador) {
    const botonEliminar = crearElemento(
      "button",
      "boton boton-secundario boton-moderacion",
      "Eliminar lugar"
    );
    botonEliminar.type = "button";
    botonEliminar.dataset.eliminarLugar = lugar.id;
    tarjeta.append(botonEliminar);
  }
  return tarjeta;
}

function mostrarLugares(contenedor, lugares, favoritos, mensajeVacio) {
  if (!contenedor) return;
  if (lugares.length === 0) {
    const estado = crearElemento("div", "estado-vacio");
    estado.append(
      crearElemento("span", "icono icono-estado", "location_on"),
      crearElemento("h3", "", "Todavía no hay lugares"),
      crearElemento("p", "", mensajeVacio)
    );
    contenedor.replaceChildren(estado);
    return;
  }
  contenedor.replaceChildren(...lugares.map((lugar) => crearTarjetaLugar(lugar, favoritos)));
}

function actualizarNavegacion() {
  document.querySelectorAll(".enlace-sesion").forEach((enlace) => {
    enlace.hidden = Boolean(sesion);
  });
  document.querySelectorAll(".boton-cerrar-sesion").forEach((boton) => {
    boton.hidden = !sesion;
    boton.addEventListener("click", () => {
      servicios.cerrarSesion();
      window.location.assign("index.html");
    });
  });
  document.querySelectorAll(".acciones-comunidad").forEach((acciones) => {
    if (!sesion) return;
    const identidad = crearElemento("a", "identidad-sesion", sesion.nombre);
    identidad.href = "perfilViajero.html";
    identidad.setAttribute("aria-label", `Perfil de ${sesion.nombre}`);
    acciones.prepend(identidad);
  });
  document.querySelectorAll(".enlace-administracion").forEach((enlace) => {
    enlace.hidden = sesion?.rol !== "administrador";
  });
}

function configurarFormularioLugar() {
  const formulario = document.getElementById("formulario-lugar");
  if (!formulario) return;
  const mensaje = formulario.querySelector("[data-mensaje-formulario]");

  if (!sesion) {
    const aviso = crearElemento("p", "aviso-sesion");
    aviso.append(document.createTextNode("Para publicar un lugar, "));
    const enlace = crearElemento("a", "enlace-texto", "inicia sesión");
    enlace.href = "InicioSesion.html";
    aviso.append(enlace, document.createTextNode("."));
    formulario.before(aviso);
    formulario.querySelectorAll("input, select, button").forEach((campo) => {
      campo.disabled = true;
    });
    return;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;

    const datos = new FormData(formulario);
    const lat = Number(datos.get("lat"));
    const lng = Number(datos.get("lng"));
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      mostrarMensaje(mensaje, "La latitud debe estar entre -90 y 90.", true);
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      mostrarMensaje(mensaje, "La longitud debe estar entre -180 y 180.", true);
      return;
    }

    const resultado = servicios.crearLugar({
      nombre: datos.get("nombre").trim(),
      direccion: datos.get("direccion").trim(),
      lat,
      lng,
      categoria: datos.get("categoria"),
      usuarioId: sesion.id,
    });
    if (!resultado.ok) {
      mostrarMensaje(mensaje, resultado.error, true);
      return;
    }

    formulario.reset();
    mostrarMensaje(mensaje, "El lugar se guardó correctamente.");
    renderizarLugares();
  });
}

function renderizarLugares() {
  const lugares = obtenerLugares();
  const favoritos = new Set(obtenerFavoritos().map((lugar) => lugar.id));
  mostrarLugares(
    document.getElementById("lugares-inicio"),
    lugares,
    favoritos,
    "Sé la primera persona en compartir un lugar."
  );
  mostrarLugares(
    document.getElementById("lugares-canales"),
    lugares,
    favoritos,
    "Inicia sesión para recomendar el primer lugar."
  );
  mostrarLugares(
    document.getElementById("lugares-favoritos"),
    obtenerFavoritos(),
    favoritos,
    sesion
      ? "Usa «Añadir a favoritos» en un lugar para guardarlo aquí."
      : "Inicia sesión para guardar y consultar tus lugares favoritos."
  );

  const total = document.querySelector("[data-total-lugares]");
  if (total) total.textContent = String(lugares.length);

  const contenedorAdmin = document.getElementById("admin-publicaciones");
  if (contenedorAdmin) {
    if (sesion?.rol !== "administrador") {
      mostrarMensaje(contenedorAdmin, "Inicia sesión con una cuenta de administrador para moderar lugares.");
    } else if (lugares.length === 0) {
      mostrarMensaje(contenedorAdmin, "Aún no hay lugares para moderar.");
    } else {
      contenedorAdmin.replaceChildren(
        ...lugares.map((lugar) => crearTarjetaLugar(lugar, favoritos, true))
      );
    }
  }

  const perfilNombre = document.querySelector("[data-nombre-perfil]");
  if (perfilNombre) perfilNombre.textContent = sesion?.nombre || "Inicia sesión para ver tu perfil";
  const perfilCorreo = document.querySelector("[data-correo-perfil]");
  if (perfilCorreo) perfilCorreo.textContent = sesion?.correo || "";
}

function configurarAccionesLugares() {
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-alternar-favorito], [data-eliminar-lugar]");
    if (!boton) return;

    if (boton.dataset.alternarFavorito) {
      const favoritos = new Set(obtenerFavoritos().map((lugar) => lugar.id));
      const resultado = favoritos.has(boton.dataset.alternarFavorito)
        ? servicios.quitarFavorito(sesion.id, boton.dataset.alternarFavorito)
        : servicios.agregarFavorito(sesion.id, boton.dataset.alternarFavorito);
      if (!resultado.ok) {
        mostrarMensaje(document.getElementById("mensaje-pagina"), resultado.error, true);
        return;
      }
      renderizarLugares();
    }

    if (boton.dataset.eliminarLugar) {
      if (sesion?.rol !== "administrador") return;
      const resultado = servicios.eliminarLugar(boton.dataset.eliminarLugar);
      if (!resultado.ok) {
        mostrarMensaje(document.getElementById("mensaje-moderacion"), resultado.error, true);
        return;
      }
      mostrarMensaje(document.getElementById("mensaje-moderacion"), "El lugar se eliminó correctamente.");
      renderizarLugares();
    }
  });
}

function iniciarAplicacion() {
  actualizarNavegacion();
  configurarFormularioLugar();
  configurarAccionesLugares();

  try {
    renderizarLugares();
  } catch (error) {
    console.error("No se pudieron cargar los lugares:", error);
    mostrarMensaje(
      document.getElementById("mensaje-pagina") || document.getElementById("lugares-inicio"),
      "No se pudieron cargar los lugares. Revisa el almacenamiento local e inténtalo de nuevo.",
      true
    );
  }
}

iniciarAplicacion();
