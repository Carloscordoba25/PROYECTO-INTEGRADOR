# PRODUCT BACKLOG
## Plataforma de Turismo Inclusivo
 
---
 
# 1. Gestión de Personas y Usuarios
 
## Descripción
 
Implementar la estructura base para administrar todas las personas registradas dentro de la plataforma.
 
## Features
 
### 1.1 Modelo Persona
 
- Crear clase abstracta Persona.
- Registrar identificador único.
- Registrar nombre y apellido.
- Registrar documento de identidad.
- Registrar teléfono.
- Registrar correo electrónico.
- Registrar fecha de nacimiento.
- Registrar estado activo/inactivo.
- Calcular edad automáticamente.
 
### 1.2 Registro de Turistas
 
- Crear entidad Turista.
- Asociar Turista con Persona.
- Registrar nacionalidad.
- Registrar idioma preferido.
- Editar información personal.
- Validar documento único.
 
### 1.3 Registro de Guías y Conductores
 
- Crear entidad GuíaConductor.
- Asociar GuíaConductor con Persona.
- Registrar tarifa base.
- Registrar certificaciones.
- Gestionar calificaciones.
- Mostrar información pública del perfil.
 
---
 
# 2. Gestión de Comercios Locales
 
## Descripción
 
Permitir el registro y administración de comercios locales dentro del ecosistema turístico.
 
## Features
 
### 2.1 Registro de Comercios
 
- Registrar nombre comercial.
- Registrar tipo de comercio.
- Registrar dirección.
- Registrar horario de atención.
- Registrar tarifa base.
 
### 2.2 Gestión de Accesibilidad
 
- Asociar etiquetas inclusivas.
- Editar etiquetas inclusivas.
- Visualizar condiciones de accesibilidad.
 
### 2.3 Integración con Prestadores Locales
 
- Implementar contrato PrestadorLocal.
- Permitir recepción de reservas.
- Permitir obtención de insignias.
 
---
 
# 3. Gestión de Vehículos
 
## Descripción
 
Administrar los vehículos utilizados por los conductores registrados.
 
## Features
 
### 3.1 Registro de Vehículos
 
- Registrar placa.
- Registrar capacidad de pasajeros.
- Registrar disponibilidad.
 
### 3.2 Accesibilidad del Vehículo
 
- Registrar capacidad para silla de ruedas.
- Registrar rutas accesibles.
- Asociar etiquetas inclusivas.
 
### 3.3 Validaciones
 
- Evitar placas duplicadas.
- Validar capacidad de pasajeros.
- Mantener integridad de la información.
 
---
 
# 4. Gestión de Accesibilidad
 
## Descripción
 
Permitir experiencias turísticas inclusivas mediante filtros inteligentes.
 
## Features
 
### 4.1 Catálogo de Etiquetas Inclusivas
 
- Crear etiquetas de accesibilidad física.
- Crear etiquetas sensoriales y cognitivas.
- Crear etiquetas de comunicación.
 
### 4.2 Configuración de Preferencias
 
- Seleccionar etiquetas requeridas.
- Actualizar preferencias.
- Almacenar preferencias del turista.
 
### 4.3 Motor de Filtrado
 
- Filtrar prestadores compatibles.
- Filtrar vehículos compatibles.
- Filtrar comercios compatibles.
- Mostrar coincidencias encontradas.
 
---
 
# 5. Gestión de Prestadores Especializados
 
## Descripción
 
Reconocer y destacar prestadores que ofrecen servicios inclusivos.
 
## Features
 
### 5.1 Gestión de Certificaciones
 
- Registrar certificados.
- Validar certificados.
- Asociar certificados a perfiles.
 
### 5.2 Sistema de Insignias
 
- Calcular elegibilidad.
- Asignar insignia automáticamente.
- Retirar insignia cuando corresponda.
 
### 5.3 Priorización de Resultados
 
- Priorizar perfiles especializados.
- Mostrar insignias en resultados.
- Resaltar perfiles especializados.
 
---
 
# 6. Búsqueda de Servicios Turísticos
 
## Descripción
 
Permitir que los turistas encuentren prestadores compatibles con sus necesidades.
 
## Features
 
### 6.1 Búsqueda de Prestadores
 
- Buscar guías.
- Buscar conductores.
- Buscar comercios.
 
### 6.2 Aplicación de Filtros
 
- Filtrar por accesibilidad.
- Filtrar por categoría.
- Filtrar por idioma.
- Filtrar por ubicación.
 
### 6.3 Visualización de Resultados
 
- Mostrar perfiles.
- Mostrar calificaciones.
- Mostrar insignias.
- Mostrar etiquetas inclusivas.
 
---
 
# 7. Gestión de Reservas
 
## Descripción
 
Administrar el proceso completo de contratación de servicios turísticos.
 
## Features
 
### 7.1 Creación de Reservas
 
- Crear reserva.
- Asociar turista.
- Asociar prestador.
- Asociar itinerario.
 
### 7.2 Estados de Reserva
 
- Pendiente.
- Confirmada.
- Completada.
- Cancelada.
 
### 7.3 Historial
 
- Registrar cambios de estado.
- Consultar historial.
- Auditar reservas.
 
---
 
# 8. Gestión de Pagos
 
## Descripción
 
Permitir pagos directos entre turistas y prestadores locales.
 
## Features
 
### 8.1 Procesamiento de Pagos
 
- Registrar pago.
- Validar transacción.
- Confirmar pago.
 
### 8.2 Gestión Financiera
 
- Registrar ingresos.
- Asociar pagos a reservas.
- Consultar historial de pagos.
 
### 8.3 Trazabilidad
 
- Registrar fecha de pago.
- Registrar monto pagado.
- Mantener historial de transacciones.
 
---
 
# 9. Gestión de Perfiles
 
## Descripción
 
Permitir la administración y consulta de información pública y privada.
 
## Features
 
### 9.1 Perfil de Turista
 
- Consultar información.
- Editar información.
- Actualizar preferencias.
 
### 9.2 Perfil de Prestador
 
- Consultar información.
- Editar servicios.
- Actualizar vehículos.
- Actualizar certificaciones.
 
### 9.3 Perfil Público
 
- Mostrar datos relevantes.
- Mostrar calificaciones.
- Mostrar insignias.
- Mostrar accesibilidad.
 
---
 
# 10. Reportes y Administración
 
## Descripción
 
Proporcionar herramientas de supervisión para la plataforma.
 
## Features
 
### 10.1 Administración de Usuarios
 
- Consultar usuarios.
- Activar usuarios.
- Desactivar usuarios.
 
### 10.2 Reportes Operativos
 
- Consultar reservas.
- Consultar pagos.
- Consultar prestadores activos.
 
### 10.3 Métricas de Inclusión
 
- Prestadores especializados registrados.
- Vehículos accesibles registrados.
- Comercios accesibles registrados.
- Reservas inclusivas realizadas.