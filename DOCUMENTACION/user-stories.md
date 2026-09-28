# USER-STORIES
## Plataforma de Turismo Inclusivo
 
---
 
# HU-01 · Persona (Clase Abstracta)
 
## Prioridad
Alta
 
## Story Points
3 SP
 
## Historia de Usuario
 
**Como** coordinador de la plataforma
 
**Quiero** registrar los datos básicos de identidad de cualquier persona vinculada al sistema
 
**Para** mantener una base centralizada y confiable de todos los actores de la plataforma.
 
## Requerimientos Funcionales
 
- Registrar identificador único.
- Registrar nombre.
- Registrar apellido.
- Registrar fecha de nacimiento.
- Registrar documento de identidad.
- Registrar teléfono.
- Registrar correo electrónico.
- Registrar estado activo/inactivo.
 
## Requerimientos No Funcionales
 
- El cálculo de la edad debe realizarse automáticamente.
- La información debe mantenerse íntegra y consistente.
- El identificador debe ser único dentro del sistema.
 
## Criterios de Aceptación
 
1. El sistema debe exigir un identificador único y obligatorio para cada persona registrada.
2. El sistema debe calcular automáticamente la edad a partir de la fecha de nacimiento registrada.
3. El sistema debe mostrar un resumen legible de la información registrada.
4. Los datos de Persona deben poder reutilizarse en Turista y Guía/Conductor mediante herencia.
 
## Definición de Terminado (DoD)
 
- Clase abstracta implementada.
- Validaciones completadas.
- Pruebas unitarias ejecutadas.
- Relación de herencia documentada en el diagrama UML.
 
---
 
# HU-02 · Registro de Turista
 
## Prioridad
Alta
 
## Story Points
5 SP
 
## Historia de Usuario
 
**Como** turista
 
**Quiero** registrarme indicando mis datos personales, nacionalidad e idioma preferido
 
**Para** planificar itinerarios y realizar reservas dentro de la plataforma.
 
## Requerimientos Funcionales
 
- Registrar nacionalidad.
- Registrar idioma preferido.
- Asociar automáticamente el turista a la entidad Persona.
- Permitir la actualización de nacionalidad e idioma.
 
## Requerimientos No Funcionales
 
- El documento de identidad debe ser único.
- La información debe almacenarse de forma persistente.
- El sistema debe garantizar la integridad de los datos.
 
## Criterios de Aceptación
 
1. El sistema debe validar que el documento de identidad no exista previamente.
2. El turista debe quedar asociado a la entidad Persona durante el registro.
3. El sistema debe permitir modificar la nacionalidad y el idioma preferido después del registro.
4. La información del turista debe mantenerse disponible para futuras reservas.
 
## Definición de Terminado (DoD)
 
- Formulario de registro implementado.
- Validaciones completadas.
- Persistencia de datos verificada.
- Casos de prueba exitosos.
 
---
 
# HU-03 · Registro de Guía o Conductor
 
## Prioridad
Alta
 
## Story Points
8 SP
 
## Historia de Usuario
 
**Como** guía o conductor local independiente
 
**Quiero** registrar mi tarifa base, vehículos y certificaciones
 
**Para** ofrecer mis servicios turísticos y recibir pagos directamente.
 
## Requerimientos Funcionales
 
- Registrar tarifa base.
- Asociar vehículos al perfil.
- Asociar certificados al perfil.
- Mostrar información pública del prestador.
 
## Requerimientos No Funcionales
 
- La tarifa base debe ser mayor a cero.
- La información debe mantenerse actualizada.
- El sistema debe soportar múltiples asociaciones de vehículos y certificados.
 
## Criterios de Aceptación
 
1. El sistema debe exigir una tarifa base obligatoria.
2. El sistema debe permitir asociar cero o varios vehículos.
3. El sistema debe permitir asociar cero o varios certificados.
4. El sistema debe mostrar la calificación promedio del guía/conductor.
5. El sistema debe indicar si posee la insignia de Servicio Especializado.
 
## Definición de Terminado (DoD)
 
- Registro funcional implementado.
- Relaciones correctamente configuradas.
- Perfil público visualizable.
- Pruebas aprobadas.
 
---
 
# HU-04 · Registro de Comercio Local
 
## Prioridad
Alta
 
## Story Points
5 SP
 
## Historia de Usuario
 
**Como** comerciante local
 
**Quiero** registrar mi establecimiento
 
**Para** ofrecer productos y servicios turísticos dentro de la plataforma.
 
## Requerimientos Funcionales
 
- Registrar nombre comercial.
- Registrar tipo de comercio.
- Registrar dirección.
- Registrar horario de atención.
- Registrar tarifa base.
- Gestionar etiquetas inclusivas.
 
## Requerimientos No Funcionales
 
- Todos los campos obligatorios deben validarse.
- La información debe almacenarse de forma persistente.
- Debe existir compatibilidad con el modelo PrestadorLocal.
 
## Criterios de Aceptación
 
1. El sistema debe exigir nombre, tipo de comercio y tarifa base.
2. El sistema debe permitir asociar una o varias etiquetas inclusivas.
3. El comercio debe implementar las mismas capacidades que cualquier PrestadorLocal.
4. El comercio debe poder recibir reservas y optar a la insignia de Servicio Especializado.
 
## Definición de Terminado (DoD)
 
- Registro funcional implementado.
- Integración con PrestadorLocal finalizada.
- Validaciones verificadas.
- Casos de prueba aprobados.
 
---
 
# HU-05 · Registro de Vehículo
 
## Prioridad
Media
 
## Story Points
5 SP
 
## Historia de Usuario
 
**Como** conductor local
 
**Quiero** registrar las características técnicas y de accesibilidad de mi vehículo
 
**Para** ser considerado en búsquedas compatibles con turistas que tengan necesidades específicas.
 
## Requerimientos Funcionales
 
- Registrar placa.
- Registrar capacidad de pasajeros.
- Registrar características de accesibilidad.
- Asociar etiquetas inclusivas.
 
## Requerimientos No Funcionales
 
- La placa debe ser única.
- La información debe almacenarse de forma persistente.
- El tiempo de consulta debe ser eficiente.
 
## Criterios de Aceptación
 
1. El sistema debe registrar la placa del vehículo.
2. El sistema debe registrar la capacidad máxima de pasajeros.
3. El sistema debe registrar los indicadores de accesibilidad física.
4. El sistema debe permitir asociar una o varias etiquetas inclusivas.
5. El sistema debe impedir registrar vehículos con placas duplicadas.
 
## Definición de Terminado (DoD)
 
- Registro implementado.
- Validación de unicidad funcionando.
- Persistencia verificada.
- Casos de prueba aprobados.
 
---
 
# HU-06 · Configuración de Filtros de Accesibilidad
 
## Prioridad
Alta
 
## Story Points
8 SP
 
## Historia de Usuario
 
**Como** turista con requerimientos específicos de accesibilidad
 
**Quiero** configurar mis preferencias inclusivas
 
**Para** visualizar únicamente opciones compatibles con mis necesidades.
 
## Requerimientos Funcionales
 
- Seleccionar etiquetas inclusivas.
- Configurar filtros obligatorios.
- Filtrar resultados automáticamente.
- Mostrar coincidencias encontradas.
 
## Requerimientos No Funcionales
 
- Las búsquedas deben responder en menos de 3 segundos.
- El filtrado debe ser preciso y consistente.
- Los resultados deben mostrarse de manera clara.
 
## Criterios de Aceptación
 
1. El turista debe poder seleccionar una o varias etiquetas inclusivas.
2. Las etiquetas deben clasificarse en categorías físicas, sensoriales/cognitivas y de comunicación.
3. El sistema debe excluir opciones incompatibles con los criterios obligatorios seleccionados.
4. El sistema debe mostrar las etiquetas que cumple cada resultado.
 
## Definición de Terminado (DoD)
 
- Filtros desarrollados.
- Motor de búsqueda validado.
- Pruebas funcionales aprobadas.
- Documentación actualizada.
 
---
 
# HU-07 · Insignia de Servicio Especializado
 
## Prioridad
Media
 
## Story Points
5 SP
 
## Historia de Usuario
 
**Como** guía o conductor especializado
 
**Quiero** obtener una insignia visible dentro de mi perfil
 
**Para** diferenciar mis servicios y mejorar mi posicionamiento en búsquedas inclusivas.
 
## Requerimientos Funcionales
 
- Evaluar certificados registrados.
- Evaluar vehículos accesibles asociados.
- Asignar insignias automáticamente.
- Priorizar resultados de búsqueda.
 
## Requerimientos No Funcionales
 
- El cálculo debe ejecutarse automáticamente.
- La insignia debe actualizarse en tiempo real.
- La visualización debe ser clara para el usuario.
 
## Criterios de Aceptación
 
1. El sistema debe otorgar automáticamente la insignia cuando se cumplan las condiciones establecidas.
2. El sistema debe otorgar la insignia cuando exista al menos un certificado válido o un vehículo con dos o más etiquetas de accesibilidad física.
3. Los perfiles con insignia deben priorizarse en las búsquedas inclusivas.
4. La insignia debe mostrarse en el perfil público del prestador.
 
## Definición de Terminado (DoD)
 
- Reglas de negocio implementadas.
- Visualización completada.
- Casos de prueba exitosos.
- Documentación actualizada.
 
---
 
# HU-08 · Reserva y Pago Directo
 
## Prioridad
Muy Alta
 
## Story Points
13 SP
 
## Historia de Usuario
 
**Como** turista
 
**Quiero** reservar servicios y realizar pagos desde la plataforma
 
**Para** contratar prestadores locales de forma segura y transparente.
 
## Requerimientos Funcionales
 
- Crear reservas.
- Asociar turista a la reserva.
- Asociar prestador local.
- Asociar itinerario.
- Registrar pagos.
- Gestionar estados de reserva.
 
## Requerimientos No Funcionales
 
- Las transacciones deben ser seguras.
- El sistema debe garantizar integridad transaccional.
- Debe existir trazabilidad sobre cada cambio realizado.
 
## Criterios de Aceptación
 
1. Toda reserva debe asociarse a un turista, un prestador local y un itinerario.
2. El sistema debe gestionar los estados pendiente, confirmada, completada y cancelada.
3. El sistema debe almacenar el historial de cambios de estado.
4. El sistema debe registrar correctamente el monto pagado.
5. El sistema no debe aplicar comisiones de intermediación sobre los pagos registrados.
 
## Definición de Terminado (DoD)
 
- Flujo de reserva implementado.
- Flujo de pago implementado.
- Persistencia de datos validada.
- Pruebas integrales aprobadas.
- Documentación actualizada.
 
---
 
# Planificación Inicial de Sprints
 
| ID | Historia de Usuario | Prioridad | Story Points | Sprint |
|----|---------------------|------------|---------------|---------|
| HU-01 | Persona (Clase Abstracta) | Alta | 3 | Sprint 1 |
| HU-02 | Registro de Turista | Alta | 5 | Sprint 1 |
| HU-03 | Registro de Guía o Conductor | Alta | 8 | Sprint 1 |
| HU-04 | Registro de Comercio Local | Alta | 5 | Sprint 2 |
| HU-05 | Registro de Vehículo | Media | 5 | Sprint 2 |
| HU-06 | Configuración de Filtros de Accesibilidad | Alta | 8 | Sprint 2 |
| HU-07 | Insignia de Servicio Especializado | Media | 5 | Sprint 3 |
| HU-08 | Reserva y Pago Directo | Muy Alta | 13 | Sprint 3 |
 
## Velocity Inicial Estimada
 
| Sprint | Story Points |
|----------|----------|
| Sprint 1 | 16 SP |
| Sprint 2 | 18 SP |
| Sprint 3 | 18 SP |
 
**Velocity promedio estimada:** 17 SP por Sprint.
 
---