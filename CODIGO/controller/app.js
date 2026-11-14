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

function puedeGestionarLugar(lugar) {
  return Boolean(
    sesion
    && (sesion.rol === "administrador" || lugar.usuarioId === sesion.id)
  );
}

function crearCampoEdicion(nombre, etiqueta, valor, opciones = {}) {
  const campo = crearElemento("label", "campo-comunidad", etiqueta);
  if (opciones.completo) campo.classList.add("campo-completo");

  const entrada = document.createElement("input");
  entrada.name = nombre;
  entrada.value = String(valor ?? "");
  entrada.required = true;
  entrada.maxLength = opciones.maxLength || 200;
  if (opciones.tipo) entrada.type = opciones.tipo;
  if (opciones.min !== undefined) entrada.min = String(opciones.min);
  if (opciones.max !== undefined) entrada.max = String(opciones.max);
  if (opciones.tipo === "number") entrada.step = "any";
  campo.append(entrada);
  return campo;
}

function crearFormularioEdicion(lugar) {
  const formulario = crearElemento("form", "formulario-edicion");
  formulario.dataset.formularioEdicion = "true";
  formulario.dataset.lugarId = lugar.id;
  formulario.append(
    crearCampoEdicion("nombre", "Nombre del lugar", lugar.nombre, { maxLength: 100 }),
    crearCampoEdicion("categoria", "Categoría", lugar.categoria, { maxLength: 60 }),
    crearCampoEdicion("direccion", "Dirección", lugar.direccion, { completo: true }),
    crearCampoEdicion("lat", "Latitud", lugar.lat, {
      tipo: "number",
      min: -90,
      max: 90,
    }),
    crearCampoEdicion("lng", "Longitud", lugar.lng, {
      tipo: "number",
      min: -180,
      max: 180,
    })
  );

  const mensaje = crearElemento("p", "mensaje-formulario campo-completo");
  mensaje.dataset.mensajeEdicion = "true";
  mensaje.setAttribute("role", "status");
  mensaje.setAttribute("aria-live", "polite");

  const acciones = crearElemento("div", "acciones-edicion");
  const botonGuardar = crearElemento("button", "boton boton-primario", "Guardar cambios");
  botonGuardar.type = "submit";
  const botonCancelar = crearElemento("button", "boton boton-secundario", "Cancelar");
  botonCancelar.type = "button";
  botonCancelar.dataset.cancelarEdicion = "true";
  acciones.append(botonGuardar, botonCancelar);
  formulario.append(mensaje, acciones);
  return formulario;
}

function mostrarMensajeAccionLugar(texto, esError = false) {
  let mensaje = document.getElementById("mensaje-moderacion")
    || document.getElementById("mensaje-pagina");
  if (!mensaje) {
    const lista = document.querySelector(
      "#lugares-inicio, #lugares-canales, #lugares-favoritos, #admin-publicaciones"
    );
    if (!lista) return;
    mensaje = crearElemento("p", "mensaje-formulario");
    mensaje.dataset.mensajePublicaciones = "true";
    mensaje.setAttribute("role", "status");
    mensaje.setAttribute("aria-live", "polite");
    lista.after(mensaje);
  }
  mostrarMensaje(mensaje, texto, esError);
}

function crearTarjetaLugar(lugar, favoritos) {
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

  const acciones = crearElemento("div", "acciones-moderacion");
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
    acciones.append(botonFavorito);
  }

  if (puedeGestionarLugar(lugar)) {
    const botonEditar = crearElemento(
      "button",
      "boton boton-secundario boton-moderacion",
      "Editar lugar"
    );
    botonEditar.type = "button";
    botonEditar.dataset.editarLugar = lugar.id;
    acciones.append(botonEditar);

    const botonEliminar = crearElemento(
      "button",
      "boton boton-secundario boton-moderacion",
      "Eliminar lugar"
    );
    botonEliminar.type = "button";
    botonEliminar.dataset.eliminarLugar = lugar.id;
    acciones.append(botonEliminar);
  }
  if (acciones.childElementCount > 0) tarjeta.append(acciones);
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
        ...lugares.map((lugar) => crearTarjetaLugar(lugar, favoritos))
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
    if (!(evento.target instanceof Element)) return;
    const boton = evento.target.closest(
      "[data-alternar-favorito], [data-editar-lugar], [data-eliminar-lugar], [data-cancelar-edicion]"
    );
    if (!boton) return;

    if (boton.dataset.cancelarEdicion) {
      boton.closest("[data-formulario-edicion]")?.remove();
      return;
    }

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

    if (boton.dataset.editarLugar) {
      const resultado = servicios.obtenerLugarPorId(boton.dataset.editarLugar);
      if (!resultado.ok) {
        mostrarMensajeAccionLugar(resultado.error, true);
        return;
      }
      if (!puedeGestionarLugar(resultado.data)) {
        mostrarMensajeAccionLugar("No tienes permiso para editar este lugar.", true);
        return;
      }

      const tarjeta = boton.closest(".tarjeta-lugar");
      if (!tarjeta.querySelector("[data-formulario-edicion]")) {
        const formulario = crearFormularioEdicion(resultado.data);
        tarjeta.append(formulario);
        formulario.querySelector("input").focus();
      }
    }

    if (boton.dataset.eliminarLugar) {
      const lugarResultado = servicios.obtenerLugarPorId(boton.dataset.eliminarLugar);
      if (!lugarResultado.ok) {
        mostrarMensajeAccionLugar(lugarResultado.error, true);
        return;
      }
      if (!puedeGestionarLugar(lugarResultado.data)) {
        mostrarMensajeAccionLugar("No tienes permiso para eliminar este lugar.", true);
        return;
      }
      if (!window.confirm(`¿Eliminar «${lugarResultado.data.nombre}»? Esta acción no se puede deshacer.`)) {
        return;
      }

      const resultado = servicios.eliminarLugar(boton.dataset.eliminarLugar, sesion);
      if (!resultado.ok) {
        mostrarMensajeAccionLugar(resultado.error, true);
        return;
      }
      renderizarLugares();
      mostrarMensajeAccionLugar("El lugar se eliminó correctamente.");
    }
  });

  document.addEventListener("submit", (evento) => {
    if (!(evento.target instanceof HTMLFormElement)) return;
    const formulario = evento.target;
    if (!formulario.matches("[data-formulario-edicion]")) return;
    evento.preventDefault();
    if (!formulario.reportValidity()) return;

    const lugarResultado = servicios.obtenerLugarPorId(formulario.dataset.lugarId);
    if (!lugarResultado.ok) {
      mostrarMensaje(formulario.querySelector("[data-mensaje-edicion]"), lugarResultado.error, true);
      return;
    }
    if (!puedeGestionarLugar(lugarResultado.data)) {
      mostrarMensaje(
        formulario.querySelector("[data-mensaje-edicion]"),
        "No tienes permiso para editar este lugar.",
        true
      );
      return;
    }

    const datos = new FormData(formulario);
    const nombre = String(datos.get("nombre")).trim();
    const direccion = String(datos.get("direccion")).trim();
    const categoria = String(datos.get("categoria")).trim();
    const lat = Number(datos.get("lat"));
    const lng = Number(datos.get("lng"));
    if (!nombre || !direccion || !categoria) {
      mostrarMensaje(
        formulario.querySelector("[data-mensaje-edicion]"),
        "Completa el nombre, la categoría y la dirección.",
        true
      );
      return;
    }
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      mostrarMensaje(
        formulario.querySelector("[data-mensaje-edicion]"),
        "La latitud debe estar entre -90 y 90.",
        true
      );
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      mostrarMensaje(
        formulario.querySelector("[data-mensaje-edicion]"),
        "La longitud debe estar entre -180 y 180.",
        true
      );
      return;
    }

    const resultado = servicios.actualizarLugar(
      formulario.dataset.lugarId,
      { nombre, direccion, categoria, lat, lng },
      sesion
    );
    if (!resultado.ok) {
      mostrarMensaje(formulario.querySelector("[data-mensaje-edicion]"), resultado.error, true);
      return;
    }

    renderizarLugares();
    mostrarMensajeAccionLugar("El lugar se actualizó correctamente.");
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
