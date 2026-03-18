# Docker Command README

This file replaces the older scattered Docker command notes in the project root.

The current Docker setup uses these services:

- `mongodb`
- `backend`
- `frontend`
- `admin-panel`

## Quick Start With Docker Compose

Run everything from the project root:

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS
docker compose up --build -d
```

Useful compose commands:

```powershell
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose down
```

## Build Images Individually

### Backend

```powershell
docker build -t food-ordering-backend:latest .\backend
```

### Frontend

```powershell
docker build `
  --build-arg VITE_API_URL=/api `
  --build-arg VITE_ADMIN_URL=http://localhost:8080 `
  -t food-ordering-frontend:latest `
  .\frontend
```

### Admin Panel

```powershell
docker build `
  --build-arg VITE_API_URL=/api `
  -t food-ordering-admin:latest `
  .\admin-panel
```

### MongoDB

MongoDB uses the official image directly:

```powershell
docker pull mongo:7
```

## Run Containers Individually

If you want to run each service manually, create the shared network and MongoDB volume first:

```powershell
docker network create food-ordering-network
docker volume create food-ordering-mongodb-data
```

### 1. Run MongoDB

```powershell
docker run -d `
  --name mongodb `
  --network food-ordering-network `
  --network-alias mongodb `
  -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=secure_mongo_password `
  -v food-ordering-mongodb-data:/data/db `
  --restart unless-stopped `
  mongo:7
```

### 2. Run Backend

```powershell
docker run -d `
  --name backend `
  --network food-ordering-network `
  --network-alias backend `
  -p 5000:5000 `
  -e MONGO_URI=mongodb://admin:secure_mongo_password@mongodb:27017/jerrys_chaska?authSource=admin `
  -e JWT_SECRET=your-super-secret-jwt-key-change-this `
  -e PORT=5000 `
  -e NODE_ENV=production `
  -e FRONTEND_URL=http://localhost:5173 `
  -e ADMIN_EMAIL=jenishchauhan.08@gmail.com `
  -e ADMIN_PASSWORD=jerry@612 `
  -e ADMIN_NAME="Jenish Chauhan" `
  --restart unless-stopped `
  food-ordering-backend:latest
```

### 3. Run Frontend

The frontend Nginx config proxies `/api` to the `backend` container on the shared Docker network.

```powershell
docker run -d `
  --name frontend `
  --network food-ordering-network `
  -p 5173:80 `
  --restart unless-stopped `
  food-ordering-frontend:latest
```

### 4. Run Admin Panel

The admin panel also proxies `/api` to the `backend` container on the same network.

```powershell
docker run -d `
  --name admin-panel `
  --network food-ordering-network `
  -p 8080:80 `
  --restart unless-stopped `
  food-ordering-admin:latest
```

## Container Management Commands

### Logs

```powershell
docker logs -f mongodb
docker logs -f backend
docker logs -f frontend
docker logs -f admin-panel
```

### Stop and Remove

```powershell
docker stop admin-panel frontend backend mongodb
docker rm admin-panel frontend backend mongodb
```

### Rebuild One Service

```powershell
docker build -t food-ordering-backend:latest .\backend
docker stop backend
docker rm backend
docker run -d `
  --name backend `
  --network food-ordering-network `
  --network-alias backend `
  -p 5000:5000 `
  -e MONGO_URI=mongodb://admin:secure_mongo_password@mongodb:27017/jerrys_chaska?authSource=admin `
  -e JWT_SECRET=your-super-secret-jwt-key-change-this `
  -e PORT=5000 `
  -e NODE_ENV=production `
  -e FRONTEND_URL=http://localhost:5173 `
  food-ordering-backend:latest
```

## Health Checks

```powershell
curl http://localhost:5000/health
curl http://localhost:5000/api/health
curl http://localhost:5000/api/menu
```

Application URLs:

- Frontend: `http://localhost:5173`
- Admin Panel: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`
- MongoDB: `mongodb://admin:secure_mongo_password@localhost:27017/jerrys_chaska?authSource=admin`

## Reset Everything

```powershell
docker compose down -v
docker system prune -f
```

## Note

The manual Docker commands above match the current `docker-compose.yml`, which uses MongoDB. The older MySQL-based Docker notes were removed because they no longer match the active application stack.
