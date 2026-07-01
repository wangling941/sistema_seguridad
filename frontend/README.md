<p align="center">
  <img src="frontend/src/assets/logo.svg" alt="Logo Seguridad Paraíso Verde" width="120">
</p>

<h1 align="center">🛡️ Seguridad Paraíso Verde</h1>
<p align="center">
  <strong>Sistema Integral de Control de Accesos y Gestión de Seguridad Residencial</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Producción%20(Activo)-blue" alt="Estado: Producción">
  <img src="https://img.shields.io/badge/versión-2.0.0-blue" alt="Versión 2.0.0">
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
