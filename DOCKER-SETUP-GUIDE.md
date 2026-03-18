# 🐳 Complete Docker Setup Guide

Step-by-step instructions to build and run the entire Food Ordering System using Docker.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ **Docker Desktop** installed
  - Windows: https://www.docker.com/products/docker-desktop
  - Mac: https://www.docker.com/products/docker-desktop
  - Linux: `sudo apt-get install docker docker-compose`

- ✅ **Docker Running**
  - Windows/Mac: Open Docker Desktop
  - Linux: `sudo systemctl start docker`

- ✅ **Ports Available**
  - Port 5000 (Backend API)
  - Port 5173 (Frontend)
  - Port 8080 (Admin Panel)
  - Port 27017 (MongoDB)

- ✅ **Disk Space**
  - At least 4GB free space
  - 2GB RAM available

- ✅ **Terminal/PowerShell Access**
  - Windows: PowerShell or Command Prompt
  - Mac/Linux: Terminal

---

## 🚀 Step 1: Verify Docker Installation

### Windows PowerShell

```powershell
# Check Docker version
docker --version

# Output should be:
# Docker version 24.x.x or higher

# Check Docker Compose version
docker-compose --version

# Output should be:
# Docker Compose version 2.x.x or higher

# Verify Docker is running
docker ps
```

### Mac/Linux

```bash
# Same commands as above
docker --version
docker-compose --version
docker ps
```

**Expected Output**:

```
CONTAINER ID   IMAGE      COMMAND   CREATED   STATUS    PORTS     NAMES
```

✅ **If you see the above output, Docker is ready!**

---

## 📂 Step 2: Navigate to Project Directory

### Windows PowerShell

```powershell
# Navigate to project
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

# Verify you're in the right place
ls
# Should show: admin-panel, backend, frontend, docker-compose.yml, etc.
```

### Mac/Linux

```bash
cd /path/to/FOOD-ORDERING-SYS
ls
```

---

## 🏗️ Step 3: Build Docker Images

### Option A: Build Everything at Once (Recommended)

```bash
# Navigate to project directory
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

# Build all images
docker-compose build

# This will:
# ✓ Build backend image
# ✓ Build frontend image
# ✓ Build admin-panel image
# ✓ Pull MongoDB image

# Expected output:
# => [backend internal] load build context
# => [frontend internal] load build context
# => [admin-panel internal] load build context
# ...
# => Build complete
```

**⏱️ Time**: 5-10 minutes (first time)

---

### Option B: Build Individual Services

If you only want to build specific services:

#### Build Backend Only

```bash
docker build -t food-ordering-backend:latest ./backend
```

#### Build Frontend Only

```bash
docker build -t food-ordering-frontend:latest ./frontend
```

#### Build Admin Panel Only

```bash
docker build -t food-ordering-admin:latest ./admin-panel
```

---

## ▶️ Step 4: Start All Services

### Start with Docker Compose (Easiest)

```bash
# Start all services in background
docker-compose up -d

# Or start with live logs
docker-compose up
# (Press Ctrl+C to stop)
```

### What This Command Does:

1. Creates Docker network
2. Starts MongoDB container
3. Starts Backend container
4. Starts Frontend container
5. Starts Admin Panel container
6. Connects them all together

---

## ✅ Step 5: Verify All Containers Are Running

### Check Container Status

```bash
docker-compose ps
```

### Expected Output:

```
NAME                    STATUS              PORTS
jerrys_chaska_backend   Up (healthy)        0.0.0.0:5000->5000/tcp
jerrys_chaska_frontend  Up (healthy)        0.0.0.0:5173->80/tcp
jerrys_chaska_admin     Up (healthy)        0.0.0.0:8080->80/tcp
jerrys_chaska_mongodb   Up (healthy)        0.0.0.0:27017->27017/tcp
```

✅ **All showing "Up"? Success!**

---

## 🧪 Step 6: Test Backend Health

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

### Expected Response:

```json
{ "status": "ok" }
```

### Test 2: Get Menu

```bash
curl http://localhost:5000/api/menu
```

### Expected Response:

```json
{"status":"success","data":[...]}
```

---

## 🌐 Step 7: Access the Applications

Open your browser and visit:

### Customer Frontend

- **URL**: http://localhost:5173
- **Purpose**: Customer app for ordering food
- **Expected**: Loading page → Login/Register page

### Admin Panel

- **URL**: http://localhost:8080
- **Purpose**: Admin dashboard for managing orders
- **Expected**: Loading page → Admin login

### Backend API

- **URL**: http://localhost:5000/api
- **Purpose**: REST API endpoints
- **Expected**: API responses to requests

---

## 👤 Step 8: Test User Registration

### Via Browser (Recommended)

1. Open http://localhost:5173
2. Click "Register"
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
   - Phone: 9876543210
4. Click Register
5. Should redirect to login page

### Via cURL Command

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "phone": "9876543210"
  }'
```

### Expected Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 🔐 Step 9: Test User Login

### Via Browser

1. Open http://localhost:5173
2. Login with:
   - Email: test@example.com
   - Password: Test@123
3. Should see menu and orders page

### Via cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Expected Response:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 👨‍💼 Step 10: Test Admin Login

### Via Browser

1. Open http://localhost:8080
2. Login with:
   - Email: admin@example.com
   - Password: Admin@123
3. Should see admin dashboard

### Via cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

---

## 📊 Step 11: View Application Logs

### View All Logs

```bash
docker-compose logs -f
```

### View Backend Logs Only

```bash
docker-compose logs -f backend
```

### View Frontend Logs Only

```bash
docker-compose logs -f frontend
```

### View Admin Logs Only

```bash
docker-compose logs -f admin-panel
```

### View MongoDB Logs Only

```bash
docker-compose logs -f mongodb
```

---

## 🛑 Step 12: Stop Services (When Done)

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove All Data

```bash
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart
```

---

## 🔧 Troubleshooting During Setup

### Issue: "Connection refused" errors

```bash
# Check logs
docker-compose logs -f backend

# May take 10-15 seconds to fully start
# Wait and try again
```

### Issue: Port already in use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F
```

### Issue: "Docker daemon is not running"

- **Windows/Mac**: Open Docker Desktop
- **Linux**: `sudo systemctl start docker`

### Issue: Permission denied error (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

### Issue: Container exits immediately

```bash
# View error logs
docker logs jerrys_chaska_backend

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📋 Complete Setup Checklist

- ✅ Docker installed and running
- ✅ In correct project directory
- ✅ Images built successfully
- ✅ Containers started (`docker-compose ps` shows all Up)
- ✅ Backend responds to health check
- ✅ Frontend accessible at http://localhost:5173
- ✅ Admin panel accessible at http://localhost:8080
- ✅ User registration works
- ✅ User login works
- ✅ Admin login works
- ✅ Menu items load
- ✅ No errors in logs

---

## 🎯 What's Next?

### For Users

1. Register a new account
2. Browse menu items
3. Place an order
4. Track order status

### For Admins

1. Login to http://localhost:8080
2. View dashboard
3. Manage orders
4. View analytics

### For Developers

1. Check `DOCKER-CHEATSHEET.md` for quick commands
2. Read `README-DOCKER-COMMANDS.md` for detailed reference
3. Review `TROUBLESHOOTING.md` for common issues
4. Check logs regularly: `docker-compose logs -f`

---

## 📞 Quick Reference

| Task        | Command                                                  |
| ----------- | -------------------------------------------------------- |
| Start all   | `docker-compose up -d`                                   |
| Stop all    | `docker-compose down`                                    |
| View status | `docker-compose ps`                                      |
| View logs   | `docker-compose logs -f`                                 |
| Rebuild     | `docker-compose build`                                   |
| Full reset  | `docker-compose down -v && docker-compose up --build -d` |

---

## 🎉 You're All Set!

Your Food Ordering System is now running with:

- ✅ Backend API on port 5000
- ✅ Frontend on port 5173
- ✅ Admin Panel on port 8080
- ✅ MongoDB on port 27017

**Ready to order some food!** 🍕🍔🍜

---

**Document Version**: 1.0  
**Last Updated**: March 18, 2026  
**Status**: Production Ready ✅
