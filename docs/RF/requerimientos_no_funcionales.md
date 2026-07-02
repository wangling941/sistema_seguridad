# Requerimientos No Funcionales – Sistema Seguridad Paraíso Verde

1. **Seguridad**: Las contraseñas deben almacenarse hasheadas con bcrypt. La autenticación debe basarse en JWT con expiración de 8 horas. Todas las rutas API (excepto login y register) deben validar el token JWT.

2. **Rendimiento**: La carga inicial de la aplicación debe ser menor a 3 segundos en conexiones estándar. Las operaciones de listado deben usar paginación (máximo 20 elementos por página en el backend, 10 en el frontend para notificaciones y clientes). La búsqueda debe tener debounce de 400 ms para reducir peticiones innecesarias.

3. **Escalabilidad**: La arquitectura del backend está basada en Clean Architecture, separando capas de dominio, aplicación e infraestructura, lo que permite escalar horizontalmente. El uso de SSE para notificaciones permite múltiples clientes conectados sin sobrecargar el servidor.

4. **Mantenibilidad**: El código sigue principios SOLID. El frontend utiliza componentes standalone de Angular y módulos funcionales. El backend utiliza inyección de dependencias y casos de uso claros. El proyecto incluye logs para depuración.

5. **Usabilidad**: La interfaz debe ser intuitiva, con feedback visual en todas las acciones (spinners, toasts, transiciones). Los mensajes de error deben ser claros y orientados al usuario final. Diseño responsive que se adapte a cualquier tamaño de pantalla.

6. **Compatibilidad**: La aplicación debe funcionar en los navegadores modernos (Chrome, Firefox, Edge, Safari) en sus dos últimas versiones. Debe ser funcional tanto en web como en dispositivos móviles (Android e iOS) gracias a Ionic.

7. **Disponibilidad**: El backend debe manejar errores de forma elegante, devolviendo respuestas estructuradas con códigos HTTP adecuados (400, 401, 404, 409, 500). El frontend debe manejar errores de red y mostrar mensajes genéricos sin exponer detalles técnicos.

8. **Integridad de datos**: El sistema debe usar transacciones (Prisma) para operaciones que afecten múltiples tablas. Las eliminaciones deben ser confirmadas por el usuario. El DNI y la placa deben ser únicos en sus respectivas entidades (validación en backend y frontend).

9. **Documentación**: El código debe estar comentado en inglés (backend) y español (frontend) cuando sea necesario. El repositorio incluye un README completo con instrucciones de instalación, uso y arquitectura.

10. **Pruebas**: Aunque no se especifican pruebas automatizadas, la aplicación ha sido probada manualmente en todas las funcionalidades, incluyendo casos borde (campos vacíos, datos duplicados, paginación, reconexión SSE).

11. **Tecnologías**: El frontend utiliza Angular 19, Ionic 8, Chart.js y jspdf. El backend usa Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt y SSE nativo. El código está escrito en TypeScript en ambos lados.

12. **Control de versiones**: El proyecto está versionado con Git y alojado en GitHub, con commits semánticos y ramas principales.

13. **Variables de entorno**: Todas las configuraciones sensibles (URL de base de datos, secret JWT, puertos) deben estar en un archivo `.env` ignorado por Git.

14. **Manejo de sesiones**: El token JWT se almacena en localStorage del navegador. El logout elimina el token y los datos del usuario. No se almacenan contraseñas en texto plano ni en localStorage.

15. **Interfaz de usuario consistente**: Todos los módulos comparten el mismo sistema de diseño: paleta de colores (verde, azul, naranja, rojo), tipografía, espaciados y componentes reutilizables (botones, tablas, tarjetas, modales).
