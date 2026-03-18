# 🐳 Docker Commands Guide

Complete reference for building and running all services in the Food Ordering System application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (All Services)](#quick-start-all-services)
3. [Individual Service Commands](#individual-service-commands)
4. [Useful Docker Commands](#useful-docker-commands)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before running any Docker commands, ensure you have:

- ✅ Docker installed and running
- ✅ Docker Compose installed
- ✅ Terminal/PowerShell access
- ✅ At least 4GB free disk space
- ✅ Ports 5000, 5173, 8080, 27017 available

### Install Docker

- **Windows**: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- **Mac**: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- **Linux**: `sudo apt-get install docker.io docker-compose`

---

## Quick Start (All Services)

### 🚀 Build and Start Everything

Navigate to the project root directory:

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS
```

**Option 1: Build & Start (Recommended)**

```bash
docker-compose up --build
```

**Option 2: Build & Start in Background**

```bash
docker-compose up --build -d
```

**Option 3: Start Without Rebuilding**

```bash
docker-compose up -d
```

### ⏹️ Stop All Services

```bash
docker-compose down
```

### 🔄 Restart All Services

```bash
docker-compose restart
```

### 📊 View Running Containers

```bash
docker-compose ps
```

### 📋 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin-panel
docker-compose logs -f mongodb
```

---

## Individual Service Commands

### 1️⃣ Backend Service (Node.js + Express + MongoDB)

**Build Image**

```bash
docker build -t food-ordering-backend:latest ./backend
```

**Run Container**

```bash
docker run -d \
  --name food-backend \
  -p 5000:5000 \
  -e MONGO_URI="mongodb://admin:jerrys_chaska_2024@mongodb:27017/jerrys_chaska?authSource=admin" \
  -e JWT_SECRET="your-super-secret-jwt-key" \
  -e NODE_ENV="production" \
  --network food-ordering-network \
  food-ordering-backend:latest
```

**Build & Run (One Command)**

```bash
docker build -t food-ordering-backend:latest ./backend && \
docker run -d \
  --name food-backend \
  -p 5000:5000 \
  -e MONGO_URI="mongodb://admin:jerrys_chaska_2024@mongodb:27017/jerrys_chaska?authSource=admin" \
  -e JWT_SECRET="your-super-secret-jwt-key" \
  --network food-ordering-network \
  food-ordering-backend:latest
```

**View Backend Logs**

```bash
docker logs -f food-backend
```

**Stop Backend**

```bash
docker stop food-backend
docker rm food-backend
```

---

### 2️⃣ Frontend Service (React + Vite + Nginx)

**Build Image**

```bash
docker build -t food-ordering-frontend:latest ./frontend
```

**Run Container**

```bash
docker run -d \
  --name food-frontend \
  -p 5173:80 \
  -e VITE_API_URL="http://localhost:5000/api" \
  --network food-ordering-network \
  food-ordering-frontend:latest
```

**Build & Run (One Command)**

```bash
docker build -t food-ordering-frontend:latest ./frontend && \
docker run -d \
  --name food-frontend \
  -p 5173:80 \
  -e VITE_API_URL="http://localhost:5000/api" \
  --network food-ordering-network \
  food-ordering-frontend:latest
```

**View Frontend Logs**

```bash
docker logs -f food-frontend
```

**Stop Frontend**

```bash
docker stop food-frontend
docker rm food-frontend
```

---

### 3️⃣ Admin Panel Service (React + Vite + Nginx)

**Build Image**

```bash
docker build -t food-ordering-admin:latest ./admin-panel
```

**Run Container**

```bash
docker run -d \
  --name food-admin \
  -p 8080:80 \
  -e VITE_API_URL="http://localhost:5000/api" \
  --network food-ordering-network \
  food-ordering-admin:latest
```

**Build & Run (One Command)**

```bash
docker build -t food-ordering-admin:latest ./admin-panel && \
docker run -d \
  --name food-admin \
  -p 8080:80 \
  -e VITE_API_URL="http://localhost:5000/api" \
  --network food-ordering-network \
  food-ordering-admin:latest
```

**View Admin Panel Logs**

```bash
docker logs -f food-admin
```

**Stop Admin Panel**

```bash
docker stop food-admin
docker rm food-admin
```

---

### 4️⃣ MongoDB Database Service

**Build Image**

```bash
docker build -t food-ordering-mongodb:latest ./mysql
```

**Run Container**

```bash
docker run -d \
  --name food-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=jerrys_chaska_2024 \
  -e MONGO_INITDB_DATABASE=jerrys_chaska \
  --network food-ordering-network \
  mongo:7
```

**View MongoDB Logs**

```bash
docker logs -f food-mongodb
```

**Connect to MongoDB Shell**

```bash
docker exec -it food-mongodb mongosh -u admin -p jerrys_chaska_2024 --authenticationDatabase admin
```

**Stop MongoDB**

```bash
docker stop food-mongodb
docker rm food-mongodb
```

---

## Useful Docker Commands

### 🔧 General Commands

**List All Images**

```bash
docker images
```

**List All Containers**

```bash
docker ps -a
```

**Remove Unused Images**

```bash
docker image prune -a
```

**Remove Unused Containers**

```bash
docker container prune
```

**Full System Cleanup**

```bash
docker system prune -a --volumes
```

### 📝 Working with Containers

**Execute Command in Running Container**

```bash
docker exec -it <container_name> <command>
```

**Example: Check Backend Logs**

```bash
docker exec food-backend npm list
```

**Copy File from Container**

```bash
docker cp <container_name>:/app/file.txt ./local-file.txt
```

**Inspect Container**

```bash
docker inspect <container_name>
```

### 🌐 Network Commands

**Create Custom Network**

```bash
docker network create food-ordering-network
```

**List Networks**

```bash
docker network ls
```

**Inspect Network**

```bash
docker network inspect food-ordering-network
```

---

## Troubleshooting

### ❌ Port Already in Use

**Find Process Using Port**

```powershell
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :8080
netstat -ano | findstr :5173
netstat -ano | findstr :27017
```

**Kill Process Using Port**

```powershell
# Windows (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### 🐳 Container Not Starting

**View Detailed Logs**

```bash
docker logs --tail 50 food-backend
docker logs --tail 50 food-frontend
docker logs --tail 50 food-admin
```

**Inspect Container**

```bash
docker inspect food-backend
```

### 🔗 Cannot Connect to Backend

**Test Backend Health**

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/health
```

**Test API Endpoint**

```bash
curl http://localhost:5000/api/menu
```

### 💾 Reset Everything

**Complete Fresh Start**

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

# Stop all containers
docker-compose down

# Remove images
docker image rm food-ordering-sys-backend:latest food-ordering-sys-frontend:latest food-ordering-sys-admin-panel:latest

# Clean up
docker system prune -f

# Rebuild and start
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 📊 Check Container Health

**View Container Status**

```bash
docker-compose ps
```

**Expected Output:**

```
NAME                COMMAND                  SERVICE             STATUS              PORTS
jerrys_chaska_backend      "docker-entrypoint.s..."   backend             Up (healthy)        0.0.0.0:5000->5000/tcp
jerrys_chaska_frontend     "/docker-entrypoint.…"     frontend            Up (healthy)        0.0.0.0:5173->80/tcp
jerrys_chaska_admin        "/docker-entrypoint.…"     admin-panel         Up (healthy)        0.0.0.0:8080->80/tcp
jerrys_chaska_mongodb      "docker-entrypoint.s…"     mongodb             Up (healthy)        0.0.0.0:27017->27017/tcp
```

---

## 🚀 Access Your Application

Once all containers are running:

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:8080
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **MongoDB**: localhost:27017

### Test API Endpoints

**Check Backend Health**

```bash
curl http://localhost:5000/health
```

**Get Menu Items**

```bash
curl http://localhost:5000/api/menu
```

**User Registration**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

---

## 📝 Docker Compose File Reference

The `docker-compose.yml` file defines all services:

```yaml
services:
  mongodb:
    image: mongo:7
    container_name: jerrys_chaska_mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: jerrys_chaska_2024
      MONGO_INITDB_DATABASE: jerrys_chaska
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: jerrys_chaska_backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://admin:jerrys_chaska_2024@mongodb:27017/jerrys_chaska?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: jerrys_chaska_frontend
    ports:
      - "5173:80"
    environment:
      VITE_API_URL: http://localhost:5000/api

  admin-panel:
    build: ./admin-panel
    container_name: jerrys_chaska_admin
    ports:
      - "8080:80"
    environment:
      VITE_API_URL: http://localhost:5000/api
```

---

## ⚡ Performance Tips

1. **Use -d flag** for background execution
2. **Check logs regularly** to identify issues early
3. **Use named volumes** for persistent data
4. **Set resource limits** to prevent memory issues
5. **Clean up regularly** with `docker system prune`

---

## 📞 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify ports: `netstat -ano | findstr :5000`
3. Test health: `curl http://localhost:5000/health`
4. Restart services: `docker-compose restart`
5. Full reset: `docker-compose down && docker-compose up --build -d`

---

**Last Updated**: March 18, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
