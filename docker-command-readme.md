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
docker build -t food-ordering-frontend:latest .\frontend
```

### Admin Panel

```powershell
docker build -t food-ordering-admin:latest .\admin-panel
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

## Container-Only Quick Run

Use this section when you want to run the full app with plain Docker
containers only, without Kubernetes.

### 1. Build Images

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

docker build -t food-ordering-backend:latest .\backend
docker build -t food-ordering-frontend:latest .\frontend
docker build -t food-ordering-admin:latest .\admin-panel
docker pull mongo:7
```

### 2. Create Network And Volume

```powershell
docker network create food-ordering-network
docker volume create food-ordering-mongodb-data
```

### 3. Run Everything On Localhost

This option is best when you are running everything on your own machine.

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

docker run -d `
  --name backend `
  --network food-ordering-network `
  --network-alias backend `
  -p 5000:5000 `
  -e MONGO_URI=mongodb://admin:secure_mongo_password@mongodb:27017/jerrys_chaska?authSource=admin `
  -e JWT_SECRET=your-super-secret-jwt-key-change-this `
  -e PORT=5000 `
  -e NODE_ENV=production `
  -e FRONTEND_URL=http://localhost:5173,http://localhost:8080 `
  -e ADMIN_EMAIL=jenishchauhan.08@gmail.com `
  -e ADMIN_PASSWORD=jerry@612 `
  -e ADMIN_NAME="Jenish Chauhan" `
  --restart unless-stopped `
  food-ordering-backend:latest

docker run -d `
  --name admin-panel `
  --network food-ordering-network `
  -p 8080:80 `
  -e APP_API_URL=/api `
  --restart unless-stopped `
  food-ordering-admin:latest

docker run -d `
  --name frontend `
  --network food-ordering-network `
  -p 5173:80 `
  -e APP_API_URL=/api `
  -e APP_ADMIN_URL=http://localhost:8080 `
  --restart unless-stopped `
  food-ordering-frontend:latest
```

Open:

- Frontend: `http://localhost:5173`
- Admin Panel: `http://localhost:8080`
- Backend API: `http://localhost:5000/api`

### 4. Run Everything With A Public EC2 IP Or Domain

Use this when you are running only Docker containers on an EC2 machine and want
the app to be reachable from outside the server.

Replace `<EC2_PUBLIC_IP_OR_DOMAIN>` with your real public IP or domain.

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

docker run -d `
  --name backend `
  --network food-ordering-network `
  --network-alias backend `
  -p 5000:5000 `
  -e MONGO_URI=mongodb://admin:secure_mongo_password@mongodb:27017/jerrys_chaska?authSource=admin `
  -e JWT_SECRET=your-super-secret-jwt-key-change-this `
  -e PORT=5000 `
  -e NODE_ENV=production `
  -e FRONTEND_URL=http://<EC2_PUBLIC_IP_OR_DOMAIN>:5173,http://<EC2_PUBLIC_IP_OR_DOMAIN>:8080 `
  -e ADMIN_EMAIL=jenishchauhan.08@gmail.com `
  -e ADMIN_PASSWORD=jerry@612 `
  -e ADMIN_NAME="Jenish Chauhan" `
  --restart unless-stopped `
  food-ordering-backend:latest

docker run -d `
  --name admin-panel `
  --network food-ordering-network `
  -p 8080:80 `
  -e APP_API_URL=/api `
  --restart unless-stopped `
  food-ordering-admin:latest

docker run -d `
  --name frontend `
  --network food-ordering-network `
  -p 5173:80 `
  -e APP_API_URL=/api `
  -e APP_ADMIN_URL=http://<EC2_PUBLIC_IP_OR_DOMAIN>:8080 `
  --restart unless-stopped `
  food-ordering-frontend:latest
```

Open:

- Frontend: `http://<EC2_PUBLIC_IP_OR_DOMAIN>:5173`
- Admin Panel: `http://<EC2_PUBLIC_IP_OR_DOMAIN>:8080`

Important:

- Open ports `5173`, `8080`, and `5000` in your EC2 security group only if you really want direct access to them.
- If you do not want the backend exposed publicly, remove `-p 5000:5000` from the backend container and keep only frontend/admin public.
- `APP_ADMIN_URL` controls where the customer app sends admin users.
- `FRONTEND_URL` must include every public frontend/admin origin that should be allowed by backend CORS.

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
  -e FRONTEND_URL=http://localhost:5173,http://localhost:8080 `
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
  -e APP_API_URL=/api `
  -e APP_ADMIN_URL=http://localhost:8080 `
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
  -e APP_API_URL=/api `
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
  -e FRONTEND_URL=http://localhost:5173,http://localhost:8080 `
  food-ordering-backend:latest
```

`FRONTEND_URL` is a comma-separated list. You can pass exact origins such as
`http://app.example.com:5173,http://admin.example.com:8080`, or a host without
an explicit port such as `http://localhost` to allow that host on multiple
ports.

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

The frontend and admin images now read browser config from runtime container
environment variables such as `APP_API_URL` and `APP_ADMIN_URL`. That means you
can reuse the same image across environments without rebuilding it.
