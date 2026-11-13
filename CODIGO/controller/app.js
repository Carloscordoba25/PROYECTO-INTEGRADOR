const { CLAVES, leerJSON, guardarJSON } = window.MapPalStorage;
const {
  obtenerConfiguracion,
  obtenerPublicaciones,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
} = window.MapPalServicios;

const pagina = document.body.dataset.page;
const iconoPersona = "person";

function obtenerSesion() {
  const sesion = sessionStorage.getItem(CLAVES.sesion);
  return sesion === null ? null : JSON.parse(sesion);
}

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function actualizarNavegacion(sesion) {
  document.querySelectorAll(".enlace-sesion").forEach((enlace) => {
    enlace.hidden = Boolean(sesion);
  });
  document.querySelectorAll(".boton-cerrar-sesion").forEach((boton) => {
    boton.hidden = !sesion;
    boton.addEventListener("click", () => {
      sessionStorage.removeItem(CLAVES.sesion);
      window.location.reload();
    });
  });
  document.querySelectorAll(".acciones-comunidad").forEach((acciones) => {
    if (sesion) {
      let identidad = acciones.querySelector(".identidad-sesion");
      if (!identidad) identidad = crearElemento("a", "identidad-sesion");
      identidad.textContent = sesion.nombre;
      identidad.href = "perfilViajero.html";
      identidad.setAttribute("aria-label", `Perfil de ${sesion.nombre}`);
      if (!identidad.isConnected) acciones.prepend(identidad);
    }
  });

  document.querySelectorAll(".navegacion-comunidad").forEach((navegacion) => {
    let enlaceAdmin = navegacion.querySelector(".enlace-administracion");
    const esAdmin = sesion?.rol === "administrador";
    if (esAdmin && !enlaceAdmin) {
      enlaceAdmin = crearElemento("a", "enlace-administracion", "Moderación");
      enlaceAdmin.href = "administracion.html";
      navegacion.append(enlaceAdmin);
    }
    if (enlaceAdmin) enlaceAdmin.hidden = !esAdmin;
  });
}

function crearEstadoVacio(contenedor, icono, titulo, mensaje, destino, textoEnlace) {
  const estado = crearElemento("div", "estado-vacio");
  const simbolo = crearElemento("span", "icono icono-estado", icono);
  simbolo.setAttribute("aria-hidden", "true");
  const tituloEstado = crearElemento("h3", "", titulo);
  const descripcion = crearElemento("p", "", mensaje);
  const enlace = crearElemento("a", "enlace-texto");
  enlace.href = destino;
  enlace.append(document.createTextNode(textoEnlace));
  const flecha = crearElemento("span", "icono", "arrow_forward");
  enlace.append(flecha);
  estado.append(simbolo, tituloEstado, descripcion, enlace);
  contenedor.replaceChildren(estado);
}

function crearTarjetaLugar(lugar) {
  const tarjeta = crearElemento("article", "tarjeta-publicacion tarjeta-lugar");
  const categoria = crearElemento("span", "etiqueta-publicacion", "Lugar recomendado");
  const titulo = crearElemento("h3", "", lugar.nombre);
  const ubicacion = crearElemento("p", "ubicacion-publicacion");
  const pin = crearElemento("span", "icono", "location_on");
  ubicacion.append(pin, document.createTextNode(lugar.ubicacion));
  const descripcion = crearElemento("p", "descripcion-publicacion", lugar.descripcion);
  const autor = crearElemento("span", "autor-publicacion", `Recomendado por ${lugar.autor}`);
  const fecha = crearElemento("time", "fecha-publicacion", new Date(lugar.fecha).toLocaleDateString("es"));
  tarjeta.append(categoria, titulo, ubicacion, descripcion, autor, fecha);
  return tarjeta;
}

function crearTarjetaDiscusion(discusion) {
  const tarjeta = crearElemento("article", "tarjeta-publicacion tarjeta-discusion");
  const categoria = crearElemento("span", "etiqueta-publicacion etiqueta-ambar", "Discusión comunitaria");
  const titulo = crearElemento("h3", "", discusion.titulo);
  const ubicacion = crearElemento("p", "ubicacion-publicacion");
  const pin = crearElemento("span", "icono", "location_on");
  ubicacion.append(pin, document.createTextNode(discusion.ubicacion));
  const descripcion = crearElemento("p", "descripcion-publicacion", discusion.descripcion);
  const autor = crearElemento("span", "autor-publicacion", `Iniciada por ${discusion.autor}`);
  const fecha = crearElemento("time", "fecha-publicacion", new Date(discusion.fecha).toLocaleDateString("es"));
  tarjeta.append(categoria, titulo, ubicacion, descripcion, autor, fecha);
  return tarjeta;
}

function crearTarjetaGuia(publicacion, tipo) {
  const tarjeta = crearElemento("article", "tarjeta-publicacion tarjeta-guia");
  const categoria = crearElemento(
    "span",
    tipo === "ruta" ? "etiqueta-publicacion etiqueta-ambar" : "etiqueta-publicacion",
    tipo === "ruta" ? "Ruta guiada" : "Servicio especializado"
  );
  const titulo = crearElemento("h3", "", publicacion.nombre);
  const ubicacion = crearElemento("p", "ubicacion-publicacion");
  const pin = crearElemento("span", "icono", "location_on");
  ubicacion.append(pin, document.createTextNode(publicacion.ubicacion));
  const descripcion = crearElemento("p", "descripcion-publicacion", publicacion.descripcion);
  const autor = crearElemento("span", "autor-publicacion", `Publicado por ${publicacion.autor}`);
  const fecha = crearElemento("time", "fecha-publicacion", new Date(publicacion.fecha).toLocaleDateString("es"));
  tarjeta.append(categoria, titulo, ubicacion, descripcion);
  if (publicacion.duracion) tarjeta.append(crearElemento("p", "detalle-guia", `Duración: ${publicacion.duracion}`));
  if (publicacion.precio) tarjeta.append(crearElemento("p", "detalle-guia", `Precio: ${publicacion.precio}`));
  tarjeta.append(autor, fecha);
  return tarjeta;
}

function mostrarLugares(contenedorId, lugares, esPerfil = false) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  if (lugares.length === 0) {
    crearEstadoVacio(
      contenedor,
      "add_location_alt",
      esPerfil ? "Aún no has recomendado lugares" : "Todavía no hay lugares recomendados",
      esPerfil
        ? "Tus recomendaciones se mostrarán aquí y ayudarán a otros viajeros."
        : "Cuando un viajero publique una recomendación en su perfil o en los canales en vivo, aparecerá aquí.",
      esPerfil ? "#formulario-lugar-perfil" : "canalesEnVivo.html",
      esPerfil ? "Publicar recomendación" : "Recomendar un lugar"
    );
    return;
  }
  contenedor.replaceChildren(...lugares.map(crearTarjetaLugar));
}

function mostrarDiscusiones(contenedorId, discusiones) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  if (discusiones.length === 0) {
    crearEstadoVacio(
      contenedor,
      "forum",
      "Aún no se han iniciado discusiones",
      "Las conversaciones destacadas se crean en Alertas comunitarias y se mostrarán aquí cuando alguien publique.",
      "SeccionAlertasComunitarias.html",
      "Iniciar una discusión"
    );
    return;
  }
  contenedor.replaceChildren(...discusiones.map(crearTarjetaDiscusion));
}

function mostrarPublicacionesGuia(contenedorId, publicaciones, tipo) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  if (publicaciones.length === 0) {
    const esRuta = tipo === "ruta";
    crearEstadoVacio(
      contenedor,
      esRuta ? "route" : "workspace_premium",
      esRuta ? "Aún no hay rutas publicadas" : "Aún no hay servicios especializados",
      esRuta
        ? "Las rutas aparecerán aquí cuando un guía local cree y publique la primera."
        : "El catálogo se activará cuando un guía local publique su primer servicio.",
      esRuta ? "#formulario-ruta" : "#formulario-servicio",
      esRuta ? "Crear primera ruta" : "Crear primer servicio"
    );
    return;
  }
  contenedor.replaceChildren(...publicaciones.map((publicacion) => crearTarjetaGuia(publicacion, tipo)));
}

function inicializarFormularios(sesion) {
  document.querySelectorAll("form[data-requiere-sesion]").forEach((formulario) => {
    const mensaje = formulario.querySelector("[data-mensaje-formulario]");
    const rolRequerido = formulario.dataset.rolRequerido;
    if (!sesion || (rolRequerido && sesion.rol !== rolRequerido)) {
      const aviso = crearElemento("div", "aviso-sesion");
      const requisito = rolRequerido === "guia" ? "Para crear servicios y rutas necesitas una cuenta de Guía Local. " : "";
      aviso.append(document.createTextNode(`${requisito}Para publicar, `));
      const enlace = crearElemento("a", "enlace-texto", sesion ? "cambiar de cuenta" : "inicia sesión");
      enlace.href = "InicioSesion.html";
      aviso.append(enlace, document.createTextNode("."));
      formulario.before(aviso);
      formulario.querySelectorAll("input, textarea, button").forEach((campo) => {
        campo.disabled = true;
      });
      return;
    }

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (!formulario.reportValidity()) return;

      const datos = new FormData(formulario);
      if (formulario.id === "formulario-lugar" || formulario.dataset.tipo === "lugar") {
        crearPublicacion("lugar", {
          id: `${Date.now()}-${Math.random()}`,
          nombre: datos.get("nombre").trim(),
          ubicacion: datos.get("ubicacion").trim(),
          descripcion: datos.get("descripcion").trim(),
          autor: sesion.nombre,
          autorId: sesion.id,
          fecha: new Date().toISOString(),
        });
        formulario.reset();
        mensaje.textContent = "Tu recomendación ya está publicada en tu perfil, Canales en vivo e Inicio.";
        renderizarLugares(sesion);
      } else if (formulario.id === "formulario-discusion") {
        crearPublicacion("alerta", {
          id: `${Date.now()}-${Math.random()}`,
          titulo: datos.get("titulo").trim(),
          ubicacion: datos.get("ubicacion").trim(),
          descripcion: datos.get("descripcion").trim(),
          autor: sesion.nombre,
          autorId: sesion.id,
          fecha: new Date().toISOString(),
        });
        formulario.reset();
        mensaje.textContent = "La discusión ya está publicada en Alertas comunitarias e Inicio.";
        renderizarDiscusiones();
      } else if (formulario.id === "formulario-servicio" || formulario.id === "formulario-ruta") {
        const esRuta = formulario.id === "formulario-ruta";
        crearPublicacion(esRuta ? "ruta" : "servicio", {
          id: `${Date.now()}-${Math.random()}`,
          nombre: datos.get("nombre").trim(),
          ubicacion: datos.get("ubicacion").trim(),
          descripcion: datos.get("descripcion").trim(),
          duracion: esRuta ? datos.get("duracion").trim() : "",
          precio: datos.get("precio").trim(),
          autor: sesion.nombre,
          autorId: sesion.id,
          fecha: new Date().toISOString(),
        });
        formulario.reset();
        mensaje.textContent = esRuta ? "La ruta ya está publicada en el directorio local." : "El servicio ya está publicado en el directorio local.";
        renderizarServiciosYRutas();
      } else if (formulario.id === "formulario-perfil") {
        guardarPerfil(formulario, sesion, mensaje);
      }
    });
  });
}

function clavePerfil(sesion) {
  return `${CLAVES.perfil}${encodeURIComponent(sesion.id)}`;
}

function cargarFoto(file, callback, mensaje) {
  if (!file) {
    callback(null);
    return;
  }
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    mensaje.textContent = "Elige una imagen PNG, JPG o WebP.";
    return;
  }
  if (file.size > 500 * 1024) {
    mensaje.textContent = "La imagen supera el límite de 500 KB.";
    return;
  }
  const lector = new FileReader();
  lector.addEventListener("load", () => callback(lector.result));
  lector.addEventListener("error", () => {
    mensaje.textContent = "No se pudo leer la imagen. Inténtalo de nuevo.";
  });
  lector.readAsDataURL(file);
}

function guardarPerfil(formulario, sesion, mensaje) {
  const datos = new FormData(formulario);
  const foto = formulario.elements.foto.files[0];
  cargarFoto(foto, (imagen) => {
    const perfilAnterior = leerJSON(clavePerfil(sesion), {});
    const perfil = {
      nombre: datos.get("nombre").trim(),
      biografia: datos.get("biografia").trim(),
      foto: imagen || perfilAnterior.foto || "",
    };
    guardarJSON(clavePerfil(sesion), perfil);
    sesion.nombre = perfil.nombre;
    sessionStorage.setItem(CLAVES.sesion, JSON.stringify(sesion));
    mensaje.textContent = "Tu perfil se guardó correctamente.";
    mostrarPerfil(sesion);
    actualizarNavegacion(sesion);
  }, mensaje);
}

function mostrarPerfil(sesion) {
  const formulario = document.getElementById("formulario-perfil");
  if (!formulario || !sesion) return;
  const perfil = leerJSON(clavePerfil(sesion), { nombre: sesion.nombre, biografia: "", foto: "" });
  formulario.elements.nombre.value = perfil.nombre || sesion.nombre;
  formulario.elements.biografia.value = perfil.biografia || "";
  document.querySelector("[data-nombre-perfil]").textContent = perfil.nombre || sesion.nombre;
  document.querySelector("[data-biografia-perfil]").textContent = perfil.biografia || "Aún no has agregado una descripción.";
  const avatar = document.querySelector("[data-avatar-perfil]");
  avatar.replaceChildren();
  if (perfil.foto) {
    const imagen = document.createElement("img");
    imagen.src = perfil.foto;
    imagen.alt = `Foto de perfil de ${perfil.nombre}`;
    avatar.append(imagen);
    avatar.setAttribute("aria-label", `Foto de perfil de ${perfil.nombre}`);
  } else {
    const icono = crearElemento("span", "icono", iconoPersona);
    icono.setAttribute("aria-hidden", "true");
    avatar.append(icono);
    avatar.setAttribute("aria-label", "Sin foto de perfil");
  }
}

function renderizarLugares(sesion) {
  const lugares = leerJSON(CLAVES.lugares, []);
  const recientes = [...lugares].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  mostrarLugares("lugares-inicio", recientes);
  mostrarLugares("lugares-canales", recientes);
  mostrarLugares("lugares-perfil", sesion ? recientes.filter((lugar) => lugar.autorId === sesion.id) : [], true);
}

function renderizarDiscusiones() {
  const recientes = leerJSON(CLAVES.discusiones, [])
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  mostrarDiscusiones("discusiones-inicio", recientes.slice(0, 3));
  mostrarDiscusiones("discusiones-alertas", recientes);
}

function renderizarServiciosYRutas() {
  const servicios = leerJSON(CLAVES.servicios, [])
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const rutas = leerJSON(CLAVES.rutas, [])
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const sesion = obtenerSesion();
  const nombreGuia = document.querySelector("[data-nombre-guia]");
  if (nombreGuia && sesion?.rol === "guia") nombreGuia.textContent = sesion.nombre;
  mostrarPublicacionesGuia("servicios-guia", servicios, "servicio");
  mostrarPublicacionesGuia("rutas-guia", rutas, "ruta");
  document.querySelectorAll("[data-total-servicios]").forEach((total) => {
    total.textContent = servicios.length;
  });
  document.querySelectorAll("[data-total-rutas]").forEach((total) => {
    total.textContent = rutas.length;
  });
}

function crearBotonModeracion(accion, texto, icono) {
  const boton = crearElemento("button", "boton boton-secundario boton-moderacion");
  boton.type = "button";
  boton.dataset.accionPublicacion = accion;
  boton.append(crearElemento("span", "icono", icono), document.createTextNode(texto));
  return boton;
}

function crearCampoEdicion(nombre, etiqueta, valor, esTextoLargo = false) {
  const campo = crearElemento("label", "campo-comunidad");
  campo.append(document.createTextNode(etiqueta));
  const control = crearElemento(esTextoLargo ? "textarea" : "input");
  control.name = nombre;
  control.value = valor || "";
  control.maxLength = nombre === "descripcion" ? 700 : 100;
  control.required = ["nombre", "ubicacion", "descripcion"].includes(nombre);
  if (esTextoLargo) campo.classList.add("campo-completo");
  if (esTextoLargo) control.rows = 3;
  campo.append(control);
  return campo;
}

function crearEditorPublicacion(publicacion) {
  const formulario = crearElemento("form", "formulario-comunidad formulario-edicion");
  formulario.dataset.editarPublicacion = "";
  formulario.append(
    crearCampoEdicion("nombre", publicacion.tipo === "alerta" ? "Tema" : "Nombre", publicacion.tipo === "alerta" ? publicacion.titulo : publicacion.nombre),
    crearCampoEdicion("ubicacion", "Ciudad o zona", publicacion.ubicacion),
    crearCampoEdicion("descripcion", "Descripción", publicacion.descripcion, true)
  );
  if (publicacion.tipo === "servicio" || publicacion.tipo === "ruta") {
    formulario.append(crearCampoEdicion("precio", "Precio", publicacion.precio));
  }
  if (publicacion.tipo === "ruta") {
    formulario.append(crearCampoEdicion("duracion", "Duración", publicacion.duracion));
  }
  const acciones = crearElemento("div", "fila-formulario acciones-edicion");
  const cancelar = crearBotonModeracion("cancelar", "Cancelar", "close");
  const guardar = crearElemento("button", "boton boton-primario");
  guardar.type = "submit";
  guardar.append(crearElemento("span", "icono", "save"), document.createTextNode("Guardar cambios"));
  acciones.append(cancelar, guardar);
  formulario.append(acciones);
  return formulario;
}

function crearTarjetaModeracion(publicacion) {
  const tarjeta = crearElemento("article", "tarjeta-publicacion tarjeta-moderacion");
  tarjeta.dataset.publicacionId = String(publicacion.id);
  tarjeta.dataset.publicacionTipo = publicacion.tipo;
  const categoria = crearElemento(
    "span",
    publicacion.tipo === "alerta" || publicacion.tipo === "ruta"
      ? "etiqueta-publicacion etiqueta-ambar"
      : "etiqueta-publicacion",
    publicacion.etiqueta
  );
  const titulo = crearElemento("h3", "", publicacion.tipo === "alerta" ? publicacion.titulo : publicacion.nombre);
  const ubicacion = crearElemento("p", "ubicacion-publicacion");
  ubicacion.append(
    crearElemento("span", "icono", "location_on"),
    document.createTextNode(publicacion.ubicacion || "Ubicación no especificada")
  );
  const descripcion = crearElemento("p", "descripcion-publicacion", publicacion.descripcion);
  const autor = crearElemento("span", "autor-publicacion", `Publicado por ${publicacion.autor || "Usuario"}`);
  const fecha = crearElemento("time", "fecha-publicacion", new Date(publicacion.fecha).toLocaleDateString("es"));
  const acciones = crearElemento("div", "acciones-moderacion");
  acciones.append(
    crearBotonModeracion("editar", "Editar", "edit"),
    crearBotonModeracion("eliminar", "Eliminar", "delete")
  );
  tarjeta.append(categoria, titulo, ubicacion, descripcion, autor, fecha);
  if (publicacion.duracion) tarjeta.append(crearElemento("p", "detalle-guia", `Duración: ${publicacion.duracion}`));
  if (publicacion.precio) tarjeta.append(crearElemento("p", "detalle-guia", `Precio: ${publicacion.precio}`));
  tarjeta.append(acciones);
  return tarjeta;
}

function renderizarAdministracion() {
  const publicaciones = obtenerPublicaciones();
  const totales = {
    lugar: "[data-total-lugares]",
    alerta: "[data-total-alertas]",
    servicio: "[data-total-servicios-admin]",
    ruta: "[data-total-rutas-admin]",
  };
  Object.entries(totales).forEach(([tipo, selector]) => {
    document.querySelectorAll(selector).forEach((elemento) => {
      elemento.textContent = publicaciones.filter((publicacion) => publicacion.tipo === tipo).length;
    });
  });
  const contenedor = document.getElementById("admin-publicaciones");
  if (!contenedor) return;
  if (publicaciones.length === 0) {
    crearEstadoVacio(
      contenedor,
      "fact_check",
      "No hay publicaciones para moderar",
      "Las recomendaciones, alertas, servicios y rutas de la comunidad aparecerán aquí.",
      "index.html",
      "Volver a explorar"
    );
    return;
  }
  contenedor.replaceChildren(...publicaciones.map(crearTarjetaModeracion));
}

function iniciarModeracion(sesion) {
  if (!sesion || sesion.rol !== "administrador") {
    const principal = document.querySelector("main");
    crearEstadoVacio(
      principal,
      "lock",
      "Acceso exclusivo para administradores",
      "Inicia sesión con una cuenta de administrador para moderar las publicaciones.",
      "InicioSesion.html",
      "Iniciar sesión"
    );
    return;
  }

  const contenedor = document.getElementById("admin-publicaciones");
  const mensaje = document.getElementById("mensaje-moderacion");
  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-accion-publicacion]");
    if (!boton || !contenedor.contains(boton)) return;
    const tarjeta = boton.closest("[data-publicacion-id]");
    if (!tarjeta) return;

    if (boton.dataset.accionPublicacion === "editar") {
      const publicacion = obtenerPublicaciones().find((elemento) =>
        elemento.tipo === tarjeta.dataset.publicacionTipo
        && String(elemento.id) === tarjeta.dataset.publicacionId
      );
      if (!publicacion) {
        mensaje.textContent = "No se encontró la publicación. Actualiza la lista e inténtalo de nuevo.";
        return;
      }
      tarjeta.replaceChildren(
        crearElemento(
          "span",
          "etiqueta-publicacion",
          `Editando: ${publicacion.etiqueta}`
        ),
        crearEditorPublicacion(publicacion)
      );
    } else if (boton.dataset.accionPublicacion === "cancelar") {
      renderizarAdministracion();
    } else if (boton.dataset.accionPublicacion === "eliminar") {
      if (!window.confirm("¿Quieres eliminar esta publicación? Esta acción no se puede deshacer.")) return;
      if (!eliminarPublicacion(tarjeta.dataset.publicacionTipo, tarjeta.dataset.publicacionId)) {
        mensaje.textContent = "No se encontró la publicación. Actualiza la lista e inténtalo de nuevo.";
        return;
      }
      mensaje.textContent = "La publicación se eliminó correctamente.";
      renderizarAdministracion();
      renderizarLugares(obtenerSesion());
      renderizarDiscusiones();
      renderizarServiciosYRutas();
    }
  });

  contenedor.addEventListener("submit", (evento) => {
    const formulario = evento.target.closest("form[data-editar-publicacion]");
    if (!formulario || !contenedor.contains(formulario)) return;
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const tarjeta = formulario.closest("[data-publicacion-id]");
    const configuracion = obtenerConfiguracion(tarjeta.dataset.publicacionTipo);
    const datos = new FormData(formulario);
    const cambios = {
      [configuracion.campoTitulo]: datos.get("nombre").trim(),
      ubicacion: datos.get("ubicacion").trim(),
      descripcion: datos.get("descripcion").trim(),
      ...(configuracion.tipo === "servicio" || configuracion.tipo === "ruta"
        ? { precio: datos.get("precio").trim() }
        : {}),
      ...(configuracion.tipo === "ruta" ? { duracion: datos.get("duracion").trim() } : {}),
    };
    if (!actualizarPublicacion(tarjeta.dataset.publicacionTipo, tarjeta.dataset.publicacionId, cambios)) {
      mensaje.textContent = "No se encontró la publicación. Actualiza la lista e inténtalo de nuevo.";
      return;
    }
    mensaje.textContent = "Los cambios se guardaron correctamente.";
    renderizarAdministracion();
    renderizarLugares(obtenerSesion());
    renderizarDiscusiones();
    renderizarServiciosYRutas();
  });
  renderizarAdministracion();
}

function iniciarAplicacion() {
  const sesion = obtenerSesion();
  actualizarNavegacion(sesion);
  if (pagina === "administracion") {
    iniciarModeracion(sesion);
    return;
  }
  inicializarFormularios(sesion);
  renderizarLugares(sesion);
  renderizarDiscusiones();
  renderizarServiciosYRutas();
  mostrarPerfil(sesion);
}

iniciarAplicacion();
