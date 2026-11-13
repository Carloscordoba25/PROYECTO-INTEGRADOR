import { storage } from './storage.js';

// Constantes y Utilidades
const KEYS = {
    users: 'mappal_users',
    session: 'mappal_session',
    places: 'mappal_places',
    favorites: 'mappal_favorites',
};

// Genera identificadores únicos
function nuevoId() {
    return crypto.randomUUID();
}

// Guarda la fecha de creación (ISO string para tener fecha y hora)
function fechaActual() {
    return new Date().toISOString();
}

// Autenticación (registro - login)
export const servicios = {
    // Registrar un usuario nuevo
    async registrarUsuario({
        nombre, correo, contrasena, rol = 'turista'
    }) {
        const usuarios = storage.leer(KEYS.users) || [];

        // Validar que el correo no exista
        if (usuarios.find(u => u.correo === correo)) {
            return { ok: false, error: 'Email ya existe' };
        }

        // Validar mínimo de la contraseña
        if (!contrasena || contrasena.length < 8) {
            return { ok: false, error: 'Contraseña muy corta' };
        }

        const usuario = {
            id: nuevoId(),
            nombre,
            correo,
            contrasena,
            rol,
            creadoEn: fechaActual(),
        };

        usuarios.push(usuario);
        const guardado = storage.guardar(KEYS.users, usuarios);
        if (!guardado.ok) return { ok: false, error: guardado.error };

        return {
            ok: true,
            data: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
        };
    },

    // Iniciar sesión
    async autenticarUsuario(correo, contrasena) {
        const usuarios = storage.leer(KEYS.users) || [];
        const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

        if (!usuario) {
            return { ok: false, error: 'Correo o Contraseña invalidas' };
        }

        const sesion = {
            usuarioId: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol,
            nombre: usuario.nombre,
            inicio: fechaActual(),
            token: nuevoId(),
        };

        const guardado = storage.guardar(KEYS.session, sesion);
        if (!guardado.ok) return { ok: false, error: guardado.error };

        return {
            ok: true,
            data: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, token: sesion.token },
        };
    },

    // Verificar si hay sesión activa
    obtenerSesionActiva() {
        const sesion = storage.leer(KEYS.session);
        return { ok: true, data: sesion ? { id: sesion.usuarioId, nombre: sesion.nombre, correo: sesion.correo, rol: sesion.rol } : null };
    },

    // Cerrar sesión
    cerrarSesion() {
        storage.borrar(KEYS.session);
        return { ok: true };
    },

    // CRUD Lugares

    // Listar todos los lugares
    listarLugares() {
        const lugares = storage.leer(KEYS.places) || [];
        return { ok: true, data: lugares };
    },

    // Obtener un lugar por id
    obtenerLugarPorId(id) {
        const lugares = storage.leer(KEYS.places) || [];

        const lugar = lugares.find(l => l.id === id);
        if (!lugar) return { ok: false, error: 'Lugar no encontrado' };
        return { ok: true, data: lugar };
    },

    // Crear un lugar
    crearLugar({ nombre, direccion, lat, lng, categoria, usuarioId }) {
        const lugares = storage.leer(KEYS.places) || [];
        const lugar = {
            id: nuevoId(),
            nombre,
            direccion,
            lat: Number(lat),
            lng: Number(lng),
            categoria,
            usuarioId,
            creadoEn: fechaActual(),
        };
        lugares.push(lugar);

        const guardado = storage.guardar(KEYS.places, lugares);
        if (!guardado.ok) return { ok: false, error: guardado.error };
        return { ok: true, data: lugar };
    },

    // Actualizar un lugar que ya existe
    actualizarLugar(id, cambios) {
        const lugares = storage.leer(KEYS.places) || [];

        const index = lugares.findIndex(l => l.id === id);
        if (index === -1) return { ok: false, error: 'Lugar no fue encontrado.' };
        lugares[index] = { ...lugares[index], ...cambios };

        const guardado = storage.guardar(KEYS.places, lugares);
        if (!guardado.ok) return { ok: false, error: guardado.error };
        return { ok: true, data: lugares[index] };
    },

    // Eliminar un lugar
    eliminarLugar(id) {
        const lugares = storage.leer(KEYS.places) || [];

        const filtrados = lugares.filter(l => l.id !== id);
        if (filtrados.length === lugares.length) return { ok: false, error: 'Lugar no fue encontrado' };

        const guardado = storage.guardar(KEYS.places, filtrados);
        if (!guardado.ok) return { ok: false, error: guardado.error };

        return { ok: true };
    },

    // Favoritos

    // Agregar un lugar a favoritos de un usuario
    agregarFavorito(usuarioId, lugarId) {
        const favoritos = storage.leer(KEYS.favorites) || {};

        if (!favoritos[usuarioId]) favoritos[usuarioId] = [];
        if (favoritos[usuarioId].includes(lugarId)) {
            return { ok: false, error: 'El lugar ya es favorito' };
        }

        favoritos[usuarioId].push(lugarId);

        const guardado = storage.guardar(KEYS.favorites, favoritos);
        if (!guardado.ok) return { ok: false, error: guardado.error };
        return { ok: true };
    },

    // Quitar un lugar de favoritos
    quitarFavorito(usuarioId, lugarId) {
        const favoritos = storage.leer(KEYS.favorites) || {};

        if (!favoritos[usuarioId]) return { ok: true };
        favoritos[usuarioId] = favoritos[usuarioId].filter(id => id !== lugarId);

        const guardado = storage.guardar(KEYS.favorites, favoritos);
        if (!guardado.ok) return { ok: false, error: guardado.error };
        return { ok: true };
    },

    // Listar lugares favoritos de un usuario
    listarFavoritos(usuarioId) {
        const favoritos = storage.leer(KEYS.favorites) || {};
        const ids = favoritos[usuarioId] || [];
        const lugares = storage.leer(KEYS.places) || [];
        return { ok: true, data: lugares.filter(l => ids.includes(l.id)) };
    },
};
