# Visma Frontend - División Management System

Sistema de gestión de divisiones organizacionales con visualización jerárquica y CRUD completo.

## 🚀 Tecnologías

- **Angular 18+** - Framework principal con arquitectura standalone
- **NgZorro (Ant Design)** - Biblioteca de componentes UI
- **SCSS** - Estilos con arquitectura modular
- **TypeScript** - Tipado estático

## 📋 Funcionalidades

- ✅ Listado de divisiones con paginación y filtros
- ✅ CRUD completo de divisiones
- ✅ Modal para crear/editar divisiones
- ✅ Modal para visualizar subdivisiones
- ✅ Integración con backend NestJS

## 🏗️ Arquitectura

```
src/app/features/divisions/
├── components/          # Componentes UI (tabla, modals, footer)
├── services/           # Servicios de datos y lógica
├── models/             # Interfaces y tipos TypeScript
└── divisions.routes.ts # Configuración de rutas lazy-loaded
```

## 🛠️ Instalación y Ejecución

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
# Aplicación disponible en http://localhost:4200
```

### Docker

```bash
# Construir y levantar contenedor
docker-compose up --build

# Aplicación disponible en http://localhost
```

## 🌐 Backend

Backend NestJS desplegado en Google Cloud Run:
- **API URL**: `https://visma-backend-lzqunom2jq-uc.a.run.app/api`
- **Base de datos**: MySQL
- **Endpoints**: CRUD divisiones + subdivisiones

## 🚢 Despliegue

### Firebase Hosting

```bash
# Build de producción
npm run build

# Deploy a Firebase
firebase deploy
```

**URL Producción**: [visma-frontend.web.app](https://visma-frontend.web.app)

### CI/CD

GitHub Actions configurado para deploy automático:
- Merge a `main` → Deploy a producción
- Merge a `develop` → Deploy a staging

## 📦 Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test          # Tests unitarios
npm run lint      # Linter
```

## 👤 Autor

Eduardo Ormeño - [eduardoorm](https://github.com/eduardoorm)

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para Visma.
