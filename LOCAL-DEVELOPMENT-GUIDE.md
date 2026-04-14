# 🚀 Complete Local Development Setup Guide

**Step-by-step guide to run the entire Food Ordering System locally with all services**

---

## 📁 Project Structure Overview

```
FOOD-ORDERING-SYS/                          (Root Directory)
│
├── 📂 backend/                             (Node.js/Express API Server)
│   ├── package.json                        (Dependencies)
│   ├── package-lock.json                   (Lock file)
│   ├── Dockerfile                          (Docker config)
│   ├── .env                                (Environment variables)
│   │
│   └── src/
│       ├── app.js                          (Main Express app - FIXED: socket.io removed)
│       ├── config/
│       │   └── database.js                 (MongoDB connection)
│       │
│       ├── controllers/
│       │   ├── authController.js           (Login/Register)
│       │   ├── menuController.js           (Menu items)
│       │   ├── orderController.js          (Order management)
│       │   └── analyticsController.js      (Analytics)
│       │
│       ├── models/
│       │   ├── User.js                     (MIGRATED: MongoDB)
│       │   ├── FoodItem.js                 (MIGRATED: MongoDB)
│       │   ├── Order.js                    (MIGRATED: MongoDB)
│       │   └── AdminSession.js
│       │
│       ├── middleware/
│       │   └── auth.js                     (JWT authentication)
│       │
│       └── routes/
│           ├── auth.js                     (/api/auth)
│           ├── menu.js                     (/api/menu)
│           ├── orders.js                   (/api/orders)
│           ├── analytics.js                (/api/analytics)
│           └── admin.js                    (/api/admin)
│
├── 📂 frontend/                            (React Customer App)
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js                      (Vite config - FIXED: build warnings)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── components/
│       │   ├── RatingModal.jsx
│       │   └── ui/
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       └── Input.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx             (User authentication)
│       │   └── CartContext.jsx             (Shopping cart)
│       │
│       ├── layout/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── MainLayout.jsx
│       │
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Menu.jsx
│       │   ├── Cart.jsx
│       │   ├── Orders.jsx                  (REMOVED: socket.io)
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Ratings.jsx
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   └── Privacy.jsx
│       │
│       ├── services/
│       │   ├── api.js                      (Axios HTTP client)
│       │   ├── mockData.js
│       │   ├── mockRatings.js
│       │   └── ratingsService.js
│       │
│       └── utils/
│           └── cn.js
│
├── 📂 admin-panel/                         (React Admin Dashboard)
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js                      (FIXED: build warnings)
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── components/
│       │   ├── AdminLayout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Sidebar.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx                (REMOVED: socket.io)
│       │   ├── Analytics.jsx
│       │   ├── FoodItems.jsx
│       │   ├── Login.jsx
│       │   └── Orders.jsx                   (REMOVED: socket.io)
│       │
│       └── services/
│           ├── api.js                      (Axios with interceptors)
│           └── socket.js                   (REMOVED - no longer needed)
│
├── 📂 mysql/                               (Database initialization)
│   ├── Dockerfile
│   └── init.sql                            (Initialization script)
│
├── 📂 k8s/                                 (Kubernetes deployments)
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   ├── mysql-deployment.yml
│   ├── mysql-service.yml
│   └── README.md
│
├── 📂 .dist/                               (Build output directory)
│   └── (generated on build)
│
├── 🐳 docker-compose.yml                   (Docker orchestration)
├── Jenkinsfile                             (CI/CD pipeline)
│
└── 📄 Documentation Files (ALL READABLE)
    ├── 🟢 DOCKER-SETUP-COMPLETE.md         (Quick overview)
    ├── 🟢 DOCKER-SETUP-GUIDE.md            (12-step guide)
    ├── 🟢 DOCKER-CHEATSHEET.md             (Quick commands)
    ├── 🟢 README-DOCKER-COMMANDS.md        (Complete reference)
    ├── 🟢 DOCUMENTATION-INDEX.md           (Navigation hub)
    ├── 🟢 DOCKER-FILES-SUMMARY.md          (File overview)
    ├── 🟢 DOCKER-FILES-MAP.md              (Visual guide)
    ├── 🟡 START_HERE.md                    (Project intro)
    ├── 🟡 README.md                        (Main docs)
    ├── 🟡 SETUP.md                         (Dev setup)
    ├── 🟡 MIGRATION.md                     (Database migration)
    ├── 🟡 STATUS.md                        (Project status)
    ├── 🟡 TROUBLESHOOTING.md               (Problem solving)
    ├── 🟡 VERIFY.md                        (Verification)
    ├── 🟡 CHANGES.md                       (What changed)
    ├── 🟡 COMPLETE.md                      (Final report)
    └── 🟡 MASTER-DOCUMENTATION-INDEX.md    (All files index)
```

---

## 🗂️ Key Directories Explained

### `backend/` - Node.js Express API

- **Purpose**: REST API server for the application
- **Port**: 5000
- **Database**: MongoDB
- **Main File**: `src/app.js`
- **Routes**: `/api/auth`, `/api/menu`, `/api/orders`, `/api/analytics`, `/api/admin`
- **Status**: ✅ Socket.io removed, ready for production

### `frontend/` - React Customer Application

- **Purpose**: Customer-facing web application
- **Port**: 5173 (dev) / 5173 (docker)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Main File**: `src/App.jsx`
- **Status**: ✅ Socket.io removed, production ready

### `admin-panel/` - React Admin Dashboard

- **Purpose**: Admin management interface
- **Port**: 5174 (dev) / 8080 (docker)
- **Framework**: React 18 + Vite
- **Main File**: `src/App.jsx`
- **Status**: ✅ Socket.io removed, production ready

### `mysql/` - Database (MongoDB)

- **Purpose**: NoSQL database for data storage
- **Port**: 27017
- **Auth**: Enabled (admin user)
- **Initial Data**: Loaded from `init.sql`
- **Status**: ✅ MongoDB configured, fully operational

---

## 📋 Prerequisites

Before running anything, ensure you have:

### Required Software

```bash
✅ Node.js v16+ (https://nodejs.org/)
   Check: node --version

✅ npm v7+ (comes with Node.js)
   Check: npm --version

✅ MongoDB Server v5+ (https://www.mongodb.com/try/download/community)
   OR Use MongoDB Atlas (Cloud)
   Check: mongosh --version

✅ Git (https://git-scm.com/)
   Check: git --version
```

### Recommended Tools

```bash
✅ Postman (for API testing)
✅ VS Code (for editing)
✅ MongoDB Compass (for database visualization)
✅ Docker Desktop (for containerized running)
```

### System Requirements

```bash
✅ Windows 10+, macOS 10.14+, or Ubuntu 18.04+
✅ At least 4GB RAM
✅ At least 2GB free disk space
✅ Ports available: 5000, 5173, 5174, 27017
```

---

## 🔧 Part 1: Verify Prerequisites

### Step 1.1: Check Node.js Installation

**Windows (PowerShell)**

```powershell
node --version
npm --version
```

**macOS/Linux (Terminal)**

```bash
node --version
npm --version
```

**Expected Output**:

```
v18.x.x or higher
9.x.x or higher
```

### Step 1.2: Check MongoDB Installation

**If MongoDB is installed locally**

```bash
mongosh --version
# or
mongo --version
```

**If using MongoDB Atlas (Cloud)**

- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string (example below)

---

## ⚙️ Part 2: Environment Configuration

### Step 2.1: Create `.env` File in Backend

Navigate to `backend/` folder and create `.env`:

**Windows (PowerShell)**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend
New-Item -Name ".env" -ItemType File
```

**macOS/Linux (Terminal)**

```bash
cd /path/to/FOOD-ORDERING-SYS/backend
touch .env
```

### Step 2.2: Add Backend Configuration

Edit `backend/.env` and add:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (LOCAL)
MONGO_URI=mongodb://localhost:27017/jerrys_chaska

# OR MongoDB Configuration (ATLAS/CLOUD) - Replace with your connection string
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jerrys_chaska?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
DEBUG=true
```

### Step 2.3: Create `.env` Files for Frontend & Admin

**Frontend `.env`** (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000
```

**Admin Panel `.env`** (`admin-panel/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📦 Part 3: Install Dependencies

### Step 3.1: Install Backend Dependencies

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend
npm install

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS/backend
npm install
```

**Expected Output**:

```
added 163 packages in 15s
```

### Step 3.2: Install Frontend Dependencies

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend
npm install

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS/frontend
npm install
```

### Step 3.3: Install Admin Panel Dependencies

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel
npm install

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS/admin-panel
npm install
```

---

## 🗄️ Part 4: Database Setup

### Option A: MongoDB Local Installation

#### Windows

```powershell
# Start MongoDB Service
net start MongoDB

# Verify it's running
mongosh
# Should connect successfully
# Exit with: exit
```

#### macOS

```bash
# Start MongoDB Service
brew services start mongodb-community

# Verify it's running
mongosh
```

#### Linux (Ubuntu)

```bash
# Start MongoDB Service
sudo systemctl start mongod

# Verify it's running
mongosh
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and login
3. Create new cluster
4. Get connection string
5. Update `MONGO_URI` in `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jerrys_chaska?retryWrites=true&w=majority
   ```

### Step 4.1: Verify Database Connection

```bash
# Test connection with mongosh
mongosh "mongodb://localhost:27017/jerrys_chaska"

# Should show:
# jerrys_chaska>
# Type: exit to quit
```

### Step 4.2: Create Database Collections (Automatic)

Collections are created automatically when the backend starts. First run will create:

- `users` (registered users)
- `fooditems` (menu items)
- `orders` (customer orders)
- `adminsessions` (admin login sessions)

---

## 🚀 Part 5: Run All Services Locally

You need **3 terminal windows** to run everything simultaneously!

### Terminal 1: Start Backend API

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend
npm run dev

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS/backend
npm run dev
```

**Expected Output**:

```
🚀 Backend running on http://localhost:5000
📊 Health check: http://localhost:5000/health
🍔 API ready at http://localhost:5000/api

Connected to MongoDB: jerrys_chaska
```

✅ **Backend is running!**

---

### Terminal 2: Start Frontend

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend
npm run dev

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS/frontend
npm run dev
```

**Expected Output**:

```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is running!**

---

### Terminal 3: Start Admin Panel

```powershell
# Windows
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel
npm run dev

# macOS/Linux
cd /path/to/FOOD-ORDERING-SYS\admin-panel
npm run dev
```

**Expected Output**:

```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5174/
  ➜  press h to show help
```

✅ **Admin Panel is running!**

---

## 🌐 Part 6: Access the Application

After all 3 services are running, open your browser:

### Customer App

- **URL**: http://localhost:5173
- **Purpose**: Customer ordering interface
- **Status**: Should load without errors

### Admin Dashboard

- **URL**: http://localhost:5174
- **Purpose**: Admin management panel
- **Status**: Should load without errors

### Backend API

- **URL**: http://localhost:5000/api
- **Purpose**: REST API endpoints
- **Status**: Should respond to requests

---

## ✅ Part 7: Verify Everything Works

### Test 1: Backend Health Check

```powershell
curl http://localhost:5000/health
```

**Expected Response**:

```json
{ "status": "ok" }
```

### Test 2: Get Menu Items

```powershell
curl http://localhost:5000/api/menu
```

**Expected Response**:

```json
{
  "status": "success",
  "data": [...]
}
```

### Test 3: User Registration (via Postman or curl)

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test@123"
    phone = "9876543210"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/register `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response**:

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

### Test 4: User Login

```powershell
$body = @{
    email = "test@example.com"
    password = "Test@123"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/login `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response**:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

## 🎯 Complete Command Summary

### Quick Setup (Copy & Paste)

**Terminal 1: Backend**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend
npm install
npm run dev
```

**Terminal 2: Frontend**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend
npm install
npm run dev
```

**Terminal 3: Admin Panel**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel
npm install
npm run dev
```

### Database Commands

**Start MongoDB (Windows)**

```powershell
net start MongoDB
```

**Start MongoDB (macOS)**

```bash
brew services start mongodb-community
```

**Start MongoDB (Linux)**

```bash
sudo systemctl start mongod
```

**Connect to MongoDB**

```bash
mongosh
# or
mongo
```

**Check Database**

```bash
mongosh
> use jerrys_chaska
> db.users.find()
> db.fooditems.find()
> db.orders.find()
> exit
```

---

## 🛑 Stopping Services

### Stop Frontend

Press `Ctrl+C` in Terminal 2

### Stop Admin Panel

Press `Ctrl+C` in Terminal 3

### Stop Backend

Press `Ctrl+C` in Terminal 1

### Stop MongoDB

**Windows**

```powershell
net stop MongoDB
```

**macOS**

```bash
brew services stop mongodb-community
```

**Linux**

```bash
sudo systemctl stop mongod
```

---

## 🔄 Restart Everything

```powershell
# Kill all processes (Windows)
taskkill /IM node.exe /F

# Or manually press Ctrl+C in each terminal
```

Then run the commands from "Complete Command Summary" again.

---

## 🆘 Troubleshooting

### MongoDB Won't Connect

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:

```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it
net start MongoDB

# Or if using MongoDB Atlas, verify connection string in .env
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution (Windows)**:

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Then restart backend
```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:

```powershell
# Ensure you're in correct directory
cd backend
npm install
npm run dev
```

### Frontend Can't Reach API

**Error**: `AxiosError: Network Error`

**Solution**:

1. Ensure backend is running on port 5000
2. Check `.env` in frontend: `VITE_API_URL=http://localhost:5000/api`
3. Check backend CORS is enabled
4. Check network connectivity

### Environment Variables Not Loading

**Error**: `undefined` values in logs

**Solution**:

1. Restart backend after creating `.env`
2. Ensure `.env` is in backend folder
3. Check file has correct variables
4. No spaces around `=` in `.env`

---

## 📊 Service Overview

| Service     | Port  | URL                   | Status     |
| ----------- | ----- | --------------------- | ---------- |
| Backend API | 5000  | http://localhost:5000 | ✅ Running |
| Frontend    | 5173  | http://localhost:5173 | ✅ Running |
| Admin Panel | 5174  | http://localhost:5174 | ✅ Running |
| MongoDB     | 27017 | localhost:27017       | ✅ Running |

---

## 🎓 Next Steps

1. ✅ Run all services (use 3 terminals)
2. ✅ Test API endpoints
3. ✅ Register and login users
4. ✅ Browse menu items
5. ✅ Place orders
6. ✅ Check admin dashboard

---

## 📚 For More Information

- **Docker Setup**: See `DOCKER-SETUP-GUIDE.md`
- **API Reference**: See `README.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Database Migration**: See `MIGRATION.md`
- **Project Status**: See `STATUS.md`

---

**Version**: 1.0  
**Last Updated**: March 18, 2026  
**Status**: Production Ready ✅
