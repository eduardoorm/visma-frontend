# Docker Setup - Visma Frontend

Este proyecto incluye una configuración completa de Docker Compose para ejecutar la aplicación Angular junto con todos los servicios necesarios.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker (versión 20.10+)
- Docker Compose (versión 2.0+)

### Levantar la aplicación

1. **Construir y ejecutar todos los servicios:**
```bash
docker-compose up --build
```

2. **Ejecutar en segundo plano:**
```bash
docker-compose up -d --build
```

3. **Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

### Acceder a la aplicación

- **Frontend Angular**: http://localhost:4200
- **Health Check**: http://localhost:4200/health
- **Backend**: Tu servidor NestJS externo (configurado en environment.ts)

## 📋 Servicios Incluidos

### Frontend (visma-frontend)
- **Puerto**: 4200
- **Tecnología**: Angular 19 + NgZorro
- **Servidor**: Nginx
- **Health Check**: Incluido
- **Backend**: Se conecta a tu backend NestJS externo

### Backend (opcional)
Si quieres ejecutar también el backend localmente:
- Descomenta la sección `visma-backend` en `docker-compose.yml`
- Ajusta la ruta al repositorio del backend
- Configura la `DATABASE_URL` para tu base de datos

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Solo el frontend (recomendado)
docker-compose up --build

# Incluir backend local (opcional)
# Primero descomenta la sección visma-backend en docker-compose.yml
docker-compose up --build

# Reconstruir solo el frontend
docker-compose up --build visma-frontend

# Ver logs del frontend
docker-compose logs -f visma-frontend
```

### Gestión de contenedores
```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Eliminar imágenes también
docker-compose down --rmi all

# Reiniciar un servicio
docker-compose restart visma-frontend
```

### Base de datos
```bash
# Conectar a MySQL
docker-compose exec mysql mysql -u visma_user -p visma_db

# Backup de la base de datos
docker-compose exec mysql mysqldump -u visma_user -p visma_db > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u visma_user -p visma_db < backup.sql
```

## 🔧 Configuración

### Variables de entorno
Puedes personalizar las variables en el archivo `docker-compose.yml`:

```yaml
environment:
  MYSQL_ROOT_PASSWORD: rootpassword
  MYSQL_DATABASE: visma_db
  MYSQL_USER: visma_user
  MYSQL_PASSWORD: visma_password
```

### Volúmenes persistentes
- **mysql_data**: Datos de la base de datos MySQL
- **nginx logs**: Logs del servidor web

### Redes
- **visma-network**: Red privada para comunicación entre servicios

## 🏗️ Estructura de archivos Docker

```
├── Dockerfile              # Imagen del frontend Angular
├── docker-compose.yml      # Configuración principal
├── nginx.conf              # Configuración Nginx para frontend
├── .dockerignore           # Archivos ignorados en build
└── DOCKER.md               # Esta documentación
```

## 🚀 Despliegue en Producción

### Con proxy reverso
```bash
# Levantar con proxy nginx
docker-compose --profile proxy up -d

# La aplicación estará disponible en puerto 80
```

### Variables de producción
Crea un archivo `.env` para variables sensibles:
```env
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
NODE_ENV=production
```

## 🔍 Solución de problemas

### Puerto ya en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "4201:80"  # Cambiar 4200 por 4201
```

### Problemas de permisos
```bash
# Ejecutar con sudo si es necesario
sudo docker-compose up --build
```

### Limpiar todo
```bash
# Eliminar contenedores, redes, volúmenes e imágenes
docker-compose down -v --rmi all
docker system prune -a
```

### Ver estado de servicios
```bash
# Estado de todos los contenedores
docker-compose ps

# Información detallada
docker-compose top
```

## 📊 Monitoreo

### Health Checks
Todos los servicios incluyen health checks automáticos:
```bash
# Ver estado de health checks
docker-compose ps
```

### Logs estructurados
```bash
# Logs con timestamps
docker-compose logs -f -t

# Logs de las últimas 100 líneas
docker-compose logs --tail=100
```

## 🔗 Integración con Backend

Para conectar con el backend NestJS, descomenta la sección en `docker-compose.yml`:

```yaml
visma-backend:
  build:
    context: ../visma-backend
    dockerfile: Dockerfile
  # ... resto de configuración
```

¡Listo! Tu aplicación Angular ahora está completamente dockerizada y lista para desarrollo o producción.
