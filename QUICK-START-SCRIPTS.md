# 🚀 One-Command Quick Start Scripts

Copy and paste these commands to set up everything instantly!

---

## ⚡ Windows PowerShell Quick Start

### All-in-One Setup (First Time Only)

```powershell
# 1. Navigate to project
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

# 2. Start MongoDB
net start MongoDB

# 3. Install backend dependencies
cd backend
npm install
cd ..

# 4. Install frontend dependencies
cd frontend
npm install
cd ..

# 5. Install admin-panel dependencies
cd admin-panel
npm install
cd ..

Write-Host "✅ All dependencies installed!"
Write-Host ""
Write-Host "Now open 3 separate PowerShell terminals and run:"
Write-Host "Terminal 1: cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend && npm run dev"
Write-Host "Terminal 2: cd c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend && npm run dev"
Write-Host "Terminal 3: cd c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel && npm run dev"
```

### Run Each Service (Use 3 Separate Terminals)

**Terminal 1: Backend**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\backend
npm run dev
```

**Terminal 2: Frontend**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend
npm run dev
```

**Terminal 3: Admin Panel**

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel
npm run dev
```

### Verify Everything Works

```powershell
# Test Backend Health
curl http://localhost:5000/health

# Test Menu API
curl http://localhost:5000/api/menu

# Open in browser
Start-Process http://localhost:5173     # Frontend
Start-Process http://localhost:5174     # Admin
```

### Stop All Services

```powershell
# Kill all Node processes
taskkill /IM node.exe /F

# Stop MongoDB
net stop MongoDB
```

### Restart Everything

```powershell
# Clean restart
taskkill /IM node.exe /F
net stop MongoDB
Start-Sleep -Seconds 2
net start MongoDB
Start-Sleep -Seconds 3

Write-Host "✅ Ready to restart services in 3 terminals"
Write-Host "Terminal 1: cd backend && npm run dev"
Write-Host "Terminal 2: cd frontend && npm run dev"
Write-Host "Terminal 3: cd admin-panel && npm run dev"
```

---

## 🍎 macOS/Linux Bash Quick Start

### All-in-One Setup (First Time Only)

```bash
#!/bin/bash

# 1. Navigate to project
cd /path/to/FOOD-ORDERING-SYS

# 2. Start MongoDB
brew services start mongodb-community  # macOS
# sudo systemctl start mongod          # Linux

# 3. Install all dependencies
for dir in backend frontend admin-panel; do
  echo "Installing $dir dependencies..."
  cd $dir
  npm install
  cd ..
done

echo "✅ All dependencies installed!"
echo ""
echo "Now open 3 separate terminals and run:"
echo "Terminal 1: cd backend && npm run dev"
echo "Terminal 2: cd frontend && npm run dev"
echo "Terminal 3: cd admin-panel && npm run dev"
```

### Run Each Service (Use 3 Separate Terminals)

**Terminal 1: Backend**

```bash
cd /path/to/FOOD-ORDERING-SYS/backend
npm run dev
```

**Terminal 2: Frontend**

```bash
cd /path/to/FOOD-ORDERING-SYS/frontend
npm run dev
```

**Terminal 3: Admin Panel**

```bash
cd /path/to/FOOD-ORDERING-SYS/admin-panel
npm run dev
```

### Verify Everything Works

```bash
# Test Backend Health
curl http://localhost:5000/health

# Test Menu API
curl http://localhost:5000/api/menu

# Open in browser
open http://localhost:5173      # Frontend (macOS)
open http://localhost:5174      # Admin (macOS)
# xdg-open on Linux
```

### Stop All Services

```bash
# Kill all Node processes
pkill -f node

# Stop MongoDB (macOS)
brew services stop mongodb-community

# Stop MongoDB (Linux)
sudo systemctl stop mongod
```

### Restart Everything

```bash
#!/bin/bash

# Clean restart
pkill -f node
sleep 2

# Start MongoDB
brew services start mongodb-community  # macOS
# sudo systemctl start mongod          # Linux
sleep 3

echo "✅ Ready to restart services in 3 terminals"
echo "Terminal 1: cd backend && npm run dev"
echo "Terminal 2: cd frontend && npm run dev"
echo "Terminal 3: cd admin-panel && npm run dev"
```

---

## 🐳 Docker Quick Start (Easiest!)

### One Command to Rule Them All

```bash
# Navigate to project
cd c:\xampp\htdocs\FOOD-ORDERING-SYS

# Build and start everything
docker-compose up --build -d

# Wait 30 seconds, then access:
# Frontend: http://localhost:5173
# Admin: http://localhost:8080
# API: http://localhost:5000/api

# View logs
docker-compose logs -f
```

### Stop Docker Services

```bash
docker-compose down
```

### Restart Docker Services

```bash
docker-compose restart
```

---

## 🎯 Quick Database Setup

### Create `.env` File (Backend)

```powershell
# Windows - Create and edit backend/.env
$envContent = @"
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/jerrys_chaska
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
DEBUG=true
"@

Set-Content -Path "c:\xampp\htdocs\FOOD-ORDERING-SYS\backend\.env" -Value $envContent
```

```bash
# macOS/Linux - Create and edit backend/.env
cat > /path/to/backend/.env << 'EOF'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/jerrys_chaska
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
DEBUG=true
EOF
```

### Create Frontend `.env`

```powershell
# Windows
Set-Content -Path "c:\xampp\htdocs\FOOD-ORDERING-SYS\frontend\.env" -Value "VITE_API_URL=http://localhost:5000/api"
```

```bash
# macOS/Linux
echo "VITE_API_URL=http://localhost:5000/api" > /path/to/frontend/.env
```

### Create Admin Panel `.env`

```powershell
# Windows
Set-Content -Path "c:\xampp\htdocs\FOOD-ORDERING-SYS\admin-panel\.env" -Value "VITE_API_URL=http://localhost:5000/api"
```

```bash
# macOS/Linux
echo "VITE_API_URL=http://localhost:5000/api" > /path/to/admin-panel/.env
```

---

## 📊 Quick Status Check

### All Services Status

```powershell
# Windows
$services = @(
    @{Name="Backend"; Port=5000; URL="http://localhost:5000/health"},
    @{Name="Frontend"; Port=5173; URL="http://localhost:5173"},
    @{Name="Admin"; Port=5174; URL="http://localhost:5174"},
    @{Name="MongoDB"; Port=27017; URL="mongodb://localhost:27017"}
)

foreach ($service in $services) {
    Write-Host "Checking $($service.Name)..."
    try {
        $response = Invoke-WebRequest $service.URL -TimeoutSec 2 -ErrorAction SilentlyContinue
        Write-Host "✅ $($service.Name) is UP"
    } catch {
        Write-Host "❌ $($service.Name) is DOWN"
    }
}
```

```bash
# macOS/Linux
echo "Checking Backend..."
curl -s http://localhost:5000/health && echo "✅ Backend UP" || echo "❌ Backend DOWN"

echo "Checking Frontend..."
curl -s http://localhost:5173 > /dev/null && echo "✅ Frontend UP" || echo "❌ Frontend DOWN"

echo "Checking Admin..."
curl -s http://localhost:5174 > /dev/null && echo "✅ Admin UP" || echo "❌ Admin DOWN"
```

---

## 🔧 Common Quick Fixes

### Clear Node Cache and Reinstall

```powershell
# Windows
cd backend
rm -r node_modules package-lock.json
npm install
npm run dev
```

```bash
# macOS/Linux
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Reset Everything (Nuclear Option)

```powershell
# Windows
taskkill /IM node.exe /F
docker-compose down -v
docker system prune -a -f
docker-compose up --build -d
```

```bash
# macOS/Linux
pkill -f node
docker-compose down -v
docker system prune -a -f
docker-compose up --build -d
```

### Check if Ports are in Use

```powershell
# Windows
netstat -ano | findstr :5000      # Backend
netstat -ano | findstr :5173      # Frontend
netstat -ano | findstr :5174      # Admin
netstat -ano | findstr :27017     # MongoDB
```

```bash
# macOS
lsof -i :5000                     # Backend
lsof -i :5173                     # Frontend
lsof -i :5174                     # Admin
lsof -i :27017                    # MongoDB

# Linux
sudo netstat -tulpn | grep :5000  # Backend
sudo netstat -tulpn | grep :5173  # Frontend
sudo netstat -tulpn | grep :5174  # Admin
sudo netstat -tulpn | grep :27017 # MongoDB
```

---

## ✨ Pro Tips

### Tip 1: Use Multiple Tabs in Terminal

Instead of 3 windows, use tabs (Ctrl+` in VS Code integrated terminal)

### Tip 2: Keep Logs Open

Always run `docker-compose logs -f` or `npm run dev` with logs visible

### Tip 3: Test After Each Service Starts

Don't start all 3 at once - start one, test it, then start the next

### Tip 4: Monitor CPU/Memory

For large applications, monitor resource usage:

```powershell
# Windows - Task Manager (Ctrl+Shift+Esc)
Get-Process node | Select-Object ProcessName, ID, @{Name="Memory(MB)"; Expression={[math]::Round($_.WorkingSet / 1MB)}}
```

### Tip 5: Use Environment Variables

```powershell
# Windows
$env:NODE_ENV = "development"

# macOS/Linux
export NODE_ENV=development
```

---

## 🎯 Success Indicators

### ✅ Everything is Working When You See:

1. **Backend Terminal**

   ```
   🚀 Backend running on http://localhost:5000
   ✅ MongoDB connected successfully
   ```

2. **Frontend Terminal**

   ```
   ➜  Local:   http://localhost:5173/
   ```

3. **Admin Terminal**

   ```
   ➜  Local:   http://localhost:5174/
   ```

4. **Browser**
   - Frontend loads without errors
   - Admin loads without errors
   - Menu data displays
   - No console errors in DevTools

---

## 📞 Quick Help

| Problem                   | Quick Fix                                |
| ------------------------- | ---------------------------------------- |
| Backend won't start       | `npm install` then `npm run dev`         |
| MongoDB connection error  | Start MongoDB: `net start MongoDB`       |
| Port in use               | Kill process: `taskkill /IM node.exe /F` |
| Module not found          | `npm install` in that folder             |
| Env variables not loading | Restart backend service                  |
| Frontend can't reach API  | Check backend is running on 5000         |

---

**Version**: 1.0  
**Last Updated**: March 18, 2026  
**Status**: Ready to Use ✅
