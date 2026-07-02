# Requerimientos Funcionales – Sistema Seguridad Paraíso Verde

## Autenticación y Gestión de Usuarios

1. El sistema debe permitir el registro de nuevos usuarios con validación de nombre de usuario (alfanumérico, mínimo 3 caracteres) y contraseña (mínimo 6 caracteres, al menos una letra y un número).
2. El sistema debe permitir el inicio de sesión de usuarios registrados mediante usuario y contraseña.
3. El sistema debe validar las credenciales en el backend y devolver un token JWT para autenticar peticiones posteriores.
4. El sistema debe proteger las rutas privadas mediante guards de Angular, redirigiendo al login si el usuario no está autenticado.
5. El sistema debe permitir el cierre de sesión, eliminando el token y redirigiendo al login.

## Dashboard (Panel de Control)

6. El dashboard debe mostrar métricas en tiempo real: número total de residentes, visitantes, vehículos, accesos totales, accesos abiertos y accesos completados.
7. El dashboard debe mostrar un gráfico de barras con la cantidad de accesos de los últimos 7 días.
8. El dashboard debe mostrar un gráfico de torta con la distribución de accesos por tipo (residente, vehículo, visitante) basado en los últimos accesos.
9. El dashboard debe listar las últimas 6 actividades registradas, mostrando el ID del acceso, el nombre del residente/vehículo/visitante, el estado (completado/pendiente) y la fecha.
10. El dashboard debe permitir refrescar los datos manualmente mediante un botón.

## Gestión de Residentes

11. El sistema debe permitir crear, editar, listar y eliminar residentes.
12. Cada residente debe tener: nombre (obligatorio, solo letras y espacios), DNI (obligatorio, 8 dígitos), teléfono (opcional, 9 dígitos) y dirección (opcional).
13. La búsqueda de residentes debe realizarse en tiempo real por nombre o DNI con debounce de 400 ms.
14. La lista de residentes debe ser paginada (10 elementos por página) y adaptarse a dispositivos móviles (tarjetas) y de escritorio (tabla).
15. Al eliminar un residente, debe mostrarse un diálogo de confirmación.

## Gestión de Vehículos

16. El sistema debe permitir crear, editar, listar y eliminar vehículos.
17. Cada vehículo debe tener: placa (obligatoria, alfanumérica con guiones, convertida a mayúsculas automáticamente) y un residente asociado (opcional, seleccionable de una lista).
18. La búsqueda de vehículos debe realizarse en tiempo real por placa o nombre del residente asociado.
19. La lista de vehículos debe ser paginada y responsive (tabla en escritorio, tarjetas en móvil).
20. Al eliminar un vehículo, debe mostrarse un diálogo de confirmación.

## Gestión de Visitantes

21. El sistema debe permitir crear, editar, listar y eliminar visitantes.
22. Cada visitante debe tener: nombre (obligatorio, solo letras), DNI (obligatorio, 8 dígitos), indicador de vehículo (toggle), placa (obligatoria si tiene vehículo, formateada a mayúsculas), número de acompañantes (mayor o igual a 0) y estado (activo/inactivo).
23. La validación de la placa debe activarse/desactivarse dinámicamente según el estado del toggle "Tiene vehículo".
24. La búsqueda de visitantes debe realizarse en tiempo real por nombre o DNI.
25. La lista de visitantes debe ser paginada y responsive.

## Control de Accesos

26. El sistema debe permitir registrar un nuevo acceso, seleccionando el tipo (residente, vehículo o visitante) y el elemento correspondiente (residente, vehículo o visitante existentes).
27. Al registrar un acceso, se debe registrar la fecha y hora de entrada automáticamente.
28. El sistema debe permitir registrar la salida de un acceso activo, actualizando la fecha y hora de salida.
29. La lista de accesos debe mostrar: ID, residente/vehículo/visitante asociado, fecha de entrada, fecha de salida (o pendiente), y estado (completado/pendiente).
30. Los accesos deben ser paginados y permitir búsqueda por ID, nombre de residente o placa de vehículo.
31. El sistema debe emitir un evento SSE cuando se cree un nuevo acceso, para notificar en tiempo real.

## Reportes

32. El sistema debe permitir filtrar accesos por rango de fechas (desde/hasta), residente específico (selector) y placa de vehículo (input con debounce).
33. El sistema debe mostrar tarjetas resumen: total de accesos, accesos de hoy, accesos pendientes y vehículos utilizados.
34. El sistema debe mostrar cuatro gráficos: accesos por día (barras), accesos por residente (torta), accesos por hora del día (barras) y top 5 de visitantes (barras horizontales).
35. El sistema debe mostrar una tabla con los accesos filtrados, con paginación.
36. El sistema debe permitir exportar el reporte actual (página visible) a PDF, incluyendo el logo, filtros aplicados, resumen y tabla.
37. El sistema debe permitir exportar **todos** los registros (sin paginación) a PDF mediante un botón separado, sin perder la visualización de los gráficos.

## Notificaciones en Tiempo Real (SSE)

38. El sistema debe establecer una conexión SSE (EventSource) con el backend al cargar la página de notificaciones.
39. Debe recibir notificaciones en tiempo real cuando se creen accesos, vehículos o residentes.
40. Cada notificación debe mostrar: tipo de evento (acceso, vehículo, residente), mensaje legible (ej. "Nuevo acceso a las 12:00"), fecha/hora de recepción y estado (leído/no leído).
41. El sistema debe permitir filtrar notificaciones por tipo de evento (todos, accesos, vehículos, residentes) y por estado (leído/no leído).
42. El sistema debe permitir marcar una notificación como leída individualmente o marcar todas como leídas.
43. El sistema debe permitir limpiar todas las notificaciones.
44. La lista de notificaciones debe ser paginada (10 elementos por página) y mostrar un contador de no leídas en el título.
45. El sistema debe mostrar el estado de conexión SSE (conectado/desconectado) en la interfaz.

## Validaciones y Experiencia de Usuario

46. Todos los formularios deben tener validaciones en tiempo real (reactive forms) con mensajes de error específicos y claros.
47. Los botones de submit deben desactivarse mientras el formulario sea inválido o esté en proceso de envío.
48. Todas las operaciones de creación, actualización y eliminación deben mostrar un toast de éxito o error.
49. Las tablas deben ser responsive (tarjetas en móvil, tabla en escritorio) en todos los módulos.
50. El sistema debe mantener la conexión SSE activa incluso al navegar entre páginas (no se desconecta al destruir el componente).

## Generales

51. El sistema debe tener un menú lateral (sidebar) con navegación entre todos los módulos, visible solo para usuarios autenticados.
52. El encabezado (header) debe mostrar el título de la página actual y el nombre del usuario autenticado.
53. El sistema debe estar completamente traducido al español (mensajes, etiquetas, errores).
54. La aplicación debe ser responsive y funcional en dispositivos móviles, tabletas y escritorios.
