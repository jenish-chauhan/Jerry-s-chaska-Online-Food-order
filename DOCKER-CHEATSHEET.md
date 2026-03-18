# 🚀 Quick Docker Commands Cheat Sheet

Fast reference for the most common Docker commands.

## One-Liners

### Start Everything

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS && docker-compose up --build -d
```

### Stop Everything

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS && docker-compose down
```

### View All Logs

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS && docker-compose logs -f
```

### Check Container Status

```bash
cd c:\xampp\htdocs\FOOD-ORDERING-SYS && docker-compose ps
```

## Service Access URLs

| Service                 | URL                   | Port  | Status          |
| ----------------------- | --------------------- | ----- | --------------- |
| Frontend (Customer App) | http://localhost:5173 | 5173  | HTTP/Nginx      |
| Admin Panel             | http://localhost:8080 | 8080  | HTTP/Nginx      |
| Backend API             | http://localhost:5000 | 5000  | Node.js/Express |
| MongoDB                 | localhost:27017       | 27017 | Database        |

## Health Checks

```bash
# Backend Health
curl http://localhost:5000/health

# API Menu Endpoint
curl http://localhost:5000/api/menu

# Admin Login (POST)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin-panel
docker-compose logs -f mongodb
```

## Individual Service Commands

### Build Backend Only

```bash
docker build -t food-ordering-backend:latest ./backend
```

### Build Frontend Only

```bash
docker build -t food-ordering-frontend:latest ./frontend
```

### Build Admin Panel Only

```bash
docker build -t food-ordering-admin:latest ./admin-panel
```

## Troubleshooting

### Port Already in Use

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Container Crashed

```bash
docker-compose logs -f backend
```

### Full Reset

```bash
docker-compose down
docker system prune -a -f
docker-compose up --build -d
```

## Container Access

### Run Command in Backend

```bash
docker exec -it jerrys_chaska_backend sh
```

### Run Command in Frontend

```bash
docker exec -it jerrys_chaska_frontend sh
```

### Access MongoDB

```bash
docker exec -it jerrys_chaska_mongodb mongosh -u admin -p jerrys_chaska_2024 --authenticationDatabase admin
```

## Expected Service Status

After running `docker-compose up --build -d`, you should see:

```
✅ Backend    - Running on port 5000
✅ Frontend   - Running on port 5173
✅ Admin      - Running on port 8080
✅ MongoDB    - Running on port 27017
```

## Test Registration Flow

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"Test@123",
    "phone":"9876543210"
  }'

# 2. Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@123"
  }'

# 3. Get menu
curl http://localhost:5000/api/menu
```

---

For detailed commands, see `README-DOCKER-COMMANDS.md`
