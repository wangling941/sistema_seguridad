<p align="center">
  <img src="frontend/src/assets/logo.svg" alt="Logo Seguridad Paraíso Verde" width="120">
</p>

<h1 align="center">🛡️ Seguridad Paraíso Verde</h1>
<p align="center">
  <strong>Sistema Integral de Control de Accesos y Gestión de Seguridad Residencial</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Producción%20(Activo)-blue" alt="Estado: Producción">
  <img src="https://img.shields.io/badge/versión-1.0.0-blue" alt="Versión 1.0.0">
  <img src="https://img.shields.io/badge/Licencia-MIT-green" alt="Licencia MIT">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-Angular%20%7C%20Ionic%20%7C%20Node.js%20%7C%20Express%20%7C%20Prisma%20%7C%20PostgreSQL-333333" alt="Tech Stack">
  <img src="https://img.shields.io/badge/Tipo-Sistema%20de%20Seguridad-5C2D91" alt="Tipo: Sistema de Seguridad">
</p>

---

## 📖 **Descripción General**

**Seguridad Paraíso Verde** es un sistema de gestión de seguridad residencial desarrollado para optimizar el control de accesos, la administración de residentes, vehículos y visitantes, y la generación de reportes en tiempo real. Este proyecto nace como una solución integral para urbanizaciones y conjuntos residenciales que requieren un control eficiente, moderno y digitalizado de su seguridad perimetral.

El sistema ofrece una experiencia unificada: desde un **dashboard ejecutivo** con métricas en tiempo real, hasta un **módulo de notificaciones** con eventos SSE, pasando por un potente **panel de reportes** con gráficos interactivos y exportación a PDF. Todo construido sobre una arquitectura limpia y escalable.

---

## ✨ **Funcionalidades Principales**

- **📊 Dashboard Ejecutivo**: Visualiza en tiempo real las métricas clave: total de residentes, visitantes, vehículos, accesos abiertos y completados. Gráficos de barras de accesos en los últimos 7 días y gráfico de distribución de accesos por tipo (residente/vehículo/visitante).

- **👥 Gestión de Residentes**: CRUD completo de residentes con validaciones estrictas (DNI, nombre, estado activo/inactivo). Búsqueda en tiempo real por nombre o DNI, paginación y diseño responsive (tabla en escritorio, tarjetas en móvil).

- **🚗 Gestión de Vehículos**: Administra vehículos asociados a residentes, con validación de placa (formato alfanumérico con guiones), búsqueda y paginación. Asociación automática con residentes mediante selector en el formulario.

- **👤 Gestión de Visitantes**: Registro de visitantes con datos personales, vehículo (toggle + placa), número de acompañantes, estado (activo/inactivo) y fechas de entrada/salida. Validaciones dinámicas (si tiene vehículo, la placa es obligatoria).

- **🚪 Control de Accesos**: Registro de entradas y salidas de residentes, vehículos y visitantes. Creación rápida desde el módulo de accesos, con selección de tipo (residente/vehículo/visitante). Registro de salida con un solo clic.

- **📈 Reportes y Análisis**: Filtros por rango de fechas, residente y placa. Visualización de accesos en tabla o tarjetas, gráficos de accesos por día, por residente, por hora del día y top 5 de visitantes más frecuentes. Exportación a PDF (página actual o todos los registros) con logo, filtros aplicados y resumen ejecutivo.

- **🔔 Notificaciones en Tiempo Real (SSE)**: Sistema de notificaciones push mediante Server-Sent Events (SSE). Cuando se crea un acceso, vehículo o residente, todos los clientes conectados reciben una notificación en tiempo real. Incluye filtros por tipo de evento, marcado como leído/no leído y paginación.

- **🔐 Autenticación y Registro Seguro**: Login y registro con validaciones estrictas (usuario alfanumérico de mínimo 3 caracteres, contraseña con al menos una letra y un número, mínimo 6 caracteres, confirmación de contraseña). Manejo de sesiones con JWT y protección de rutas mediante guards.

- **📱 Diseño Responsive**: Adaptado a todos los dispositivos: escritorio, tablet y móvil. Las tablas se convierten en tarjetas en pantallas pequeñas, los gráficos se redimensionan y los elementos de navegación se reorganizan para una experiencia óptima en cualquier tamaño de pantalla.

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**

- **Angular 19** con **Ionic 8**: Aplicación web/móvil híbrida de alto rendimiento.
- **Chart.js**: Visualización de datos y gráficos interactivos (barras, torta, líneas).
- **SCSS**: Estilos avanzados con diseño responsivo, temas y animaciones.
- **jspdf + jspdf-autotable**: Generación de reportes en PDF profesionales.
- **EventSource (SSE)**: Comunicación en tiempo real con el backend.

### **Backend**

- **Node.js** con **Express**: API REST robusta y bien estructurada.
- **Prisma ORM**: Interacción segura y tipada con la base de datos (PostgreSQL).
- **JWT**: Autenticación y manejo de sesiones seguro.
- **Zod**: Validación de datos y esquemas en el backend.
- **Bcryptjs**: Hash de contraseñas para seguridad.
- **Server-Sent Events (SSE)**: Notificaciones en tiempo real.

### **Infraestructura y Herramientas**

- **PostgreSQL**: Base de datos relacional.
- **Nodemon**: Recarga automática en desarrollo.
- **TypeScript**: Tipado estático en todo el proyecto.
- **Git & GitHub**: Control de versiones.

---

## 🚀 **Instalación y Configuración**

Sigue estos pasos para levantar el proyecto en tu entorno local.

### **Prerrequisitos**

- Node.js (versión 18+)
- npm o yarn
- PostgreSQL (versión 14+)

### **1. Clonar el repositorio**

```bash
git clone https://github.com/wangling941/sistema_seguridad.git
cd sistema_seguridad
```

### **2. Instalar dependencias e inicializar la base de datos**

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Frontend
cd ../frontend
npm install
```

### **3. Configurar variables de entorno**

Crea un archivo .env en la carpeta backend/ con el siguiente contenido (ajusta los valores según tu configuración):

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/seguridad_paraiso_verde?schema=public"

# JWT
JWT_SECRET="tu_clave_secreta"
JWT_EXPIRES_IN="8h"

# Servidor
PORT=3000
NODE_ENV="development"

# URL del frontend (para el enlace de notificaciones SSE)
FRONTEND_URL=http://localhost:8100
```

### **4. Iniciar la aplicación**

```bash
# Iniciar el backend (desde /backend)
npm run dev

# Iniciar el frontend (desde /frontend)
ionic serve
# o con Angular CLI:
ng serve
```

-Frontend: http://localhost:8100 (por defecto con Ionic) o http://localhost:4200 (con ng serve)
-Backend: http://localhost:3000

### **🏗️ Arquitectura del Proyecto**

El sistema está construido sobre una Clean Architecture con Screaming Architecture, separando el código en capas bien definidas para garantizar mantenibilidad y escalabilidad.

### **Estructura del Backend**

```bash
backend/
├── src/
│   ├── application/                 # Casos de uso y lógica de negocio
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── ports/                   # Interfaces (repositorios, servicios)
│   │   └── use-cases/               # Casos de uso (Resident, Vehicle, Visitor, Access, Report)
│   ├── domain/                      # Entidades y excepciones del dominio
│   │   ├── entities/                # Entidades de negocio (Resident, Vehicle, Visitor, AccessLog, User)
│   │   └── exceptions/              # Excepciones personalizadas (DomainError, ValidationError, etc.)
│   ├── infrastructure/              # Implementaciones concretas
│   │   ├── auth/                    # Servicios de autenticación (JWT, Encryption)
│   │   ├── persistence/             # Prisma client y repositorios
│   │   ├── streaming/               # SSE Manager y EventEmitter
│   │   └── config/                  # Configuraciones (env, Prisma)
│   └── interfaces/                  # Adaptadores HTTP (controllers, middlewares, routes)
│       ├── http/                    # Controllers, middlewares, rutas
│       └── subscribers/             # Suscriptores de eventos (notificaciones)
└── prisma/                          # Esquema de base de datos, migraciones y seed
```

### **Estructura del frontend**

```bash
frontend/src/app/
├── core/                            # Servicios, guards, interceptores
│   ├── guards/                      # auth.guard, role.guard
│   ├── interceptors/                # auth.interceptor, error.interceptor
│   ├── models/                      # Interfaces y tipos (RealtimeNotification, AccessLog, etc.)
│   └── services/                    # Api, Auth, Notification, PageTitle
├── modules/                         # Módulos funcionales
│   ├── access/                      # Control de accesos (listado, creación, registro de salida)
│   ├── auth/                        # Login y Register (con validaciones)
│   ├── dashboard/                   # Panel de control con métricas y gráficos
│   ├── notifications/               # Notificaciones en tiempo real (SSE)
│   ├── reports/                     # Reportes y análisis (filtros, gráficos, exportación PDF)
│   ├── residents/                   # Gestión de residentes (CRUD)
│   ├── vehicles/                    # Gestión de vehículos (CRUD)
│   └── visitors/                    # Gestión de visitantes (CRUD)
└── shell/                           # Layout principal (header + sidebar)
    ├── header/                      # Header con título dinámico y usuario
    └── sidebar/                     # Sidebar con navegación según rol
```

### **📸 Capturas de Pantalla**

<div align="center"> <table> <tr> <td align="center"><strong>Dashboard</strong><br><img src="./frontend/src/assets/screenshots/panel.webp" width="400" alt="Dashboard"/></td> <td align="center"><strong>Gestión de Residentes</strong><br><img src="./frontend/src/assets/screenshots/residentes.webp" width="400" alt="Residentes"/></td> </tr> <tr> <td align="center"><strong>Control de Accesos</strong><br><img src="./frontend/src/assets/screenshots/control-accesos.webp" width="400" alt="Accesos"/></td> <td align="center"><strong>Notificaciones en Tiempo Real</strong><br><img src="./frontend/src/assets/screenshots/notificaciones.webp" width="400" alt="Notificaciones"/></td> </tr> <tr> <td align="center" colspan="2"><strong>Reportes</strong><br><img src="./frontend/src/assets/screenshots/reportes.webp" width="400" alt="Reportes"/></td> </tr> </table> </div>

### **🤝 Contribuciones**

¡Gracias por tu interés en mejorar el proyecto!

Si encuentras un error, tienes una sugerencia o deseas proponer una mejora, puedes:

- Abrir un Issue describiendo el problema o la idea.

- Hacer un Fork del repositorio y enviar un Pull Request con tus cambios.

Todas las contribuciones serán revisadas antes de ser integradas al proyecto.

Si este proyecto te resultó útil o te sirvió como referencia, considera darle una ⭐ al repositorio. ¡Gracias por tu apoyo!

### **👨‍💻 Desarrollador**

<p align="center"> <br> <img src="frontend/src/assets/icon/developer.jpg" alt="Foto de perfil" width="120" style="border-radius: 50%;"> <br> <strong>WangLing</strong> <br> <em>Desarrollador Full-Stack | Apasionado por la tecnología y las soluciones empresariales</em> </p><p align="center"> <a href="https://github.com/wangling941"> <img src="https://img.shields.io/badge/GitHub-wangling941-181717?style=for-the-badge&logo=github" alt="GitHub"> </a> &nbsp; <a href="mailto:kevinvillegas.dev@gmail.com"> <img src="https://img.shields.io/badge/Email-Contacto-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"> </a> &nbsp; <a href="https://www.linkedin.com/in/kevin-villegas-solis-7b0038366/"> <img src="https://img.shields.io/badge/LinkedIn-Kevin%20Villegas%20Solis-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"> </a> </p><p align="center"> Hecho con ❤️ para la seguridad de tu comunidad. </p> ```
