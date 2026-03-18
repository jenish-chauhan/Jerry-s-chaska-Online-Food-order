# Quick Troubleshooting Guide

## 🚀 Getting Started Issues

### Problem: "Port already in use"

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:

```bash
# Find and kill process on port 5000
# Windows (PowerShell)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

---

## 🐳 Docker Issues

### Problem: Services won't start

```bash
docker-compose logs
```

**Common causes**:

1. MongoDB not healthy yet (wait 30 seconds)
2. Port already in use
3. Insufficient disk space

**Solution**:

```bash
# Start with verbose output
docker-compose up -d --verbose

# Check specific service
docker-compose logs backend
```

### Problem: "MongoDB connection refused"

```
MongooseError: connection error
```

**Solution**:

```bash
# Restart MongoDB
docker-compose restart mongodb

# Wait for health check
docker-compose ps  # Look for "healthy" status
```

---

## 🔐 Authentication Issues

### Problem: Admin login crashes

**Check 1**: User has admin role

```javascript
db.users.findOne({ email: "your-email@example.com" });
// Should show: "role": "admin"
```

**Check 2**: JWT_SECRET matches in .env

```bash
# Backend .env
cat .env | grep JWT_SECRET
```

**Check 3**: Clear browser storage

```javascript
// Open browser console
sessionStorage.clear();
localStorage.clear();
// Reload page
```

### Problem: "Invalid credentials" when login works elsewhere

**Cause**: Token mismatch

**Solution**:

1. Clear browser cache: Ctrl+Shift+Delete
2. Try incognito/private mode
3. Verify JWT_SECRET hasn't changed

### Problem: "Admin already logged in from another session"

**Expected behavior**: Admin can only have one active session

**Fix**:

- Logout from other browser/tab
- Clear sessionStorage and login again

---

## 🌐 API Issues

### Problem: API returns 404

```
{ "error": "Route not found" }
```

**Check**:

1. Correct endpoint: `http://localhost:5000/api/auth/login` (not `/login`)
2. Correct method: POST/GET/PUT/DELETE
3. Backend is running: `curl http://localhost:5000/health`

### Problem: API returns 401

```
{ "error": "Invalid or expired token" }
```

**Solutions**:

- Login again to get new token
- Check Authorization header: `Authorization: Bearer TOKEN`
- Token must be Bearer token, not Basic

### Problem: CORS error in browser

```
Access to XMLHttpRequest blocked by CORS policy
```

**Check**:

1. Frontend origin is in CORS list (.env)
2. Correct API URL (not localhost if remote)
3. Use `http://` not `https://` (unless both are https)

**Quick fix**:

```bash
# Backend logs
docker-compose logs backend | grep CORS
```

---

## 📊 Database Issues

### Problem: "Cannot connect to MongoDB"

**Verify connection string**:

```javascript
// Should work
mongodb://admin:password@localhost:27017/jerrys_chaska?authSource=admin
```

**Test with mongosh**:

```bash
mongosh "mongodb://admin:password@localhost:27017/jerrys_chaska?authSource=admin"
```

### Problem: Collections are empty

**Expected**: New collections created on first use

**Manually create data**:

```javascript
db.foodItems.insertOne({
  name: "Samosa",
  description: "Crispy samosa",
  price: 50,
  category: "Snacks",
  image_url: "https://example.com/samosa.jpg",
  available: true,
});
```

### Problem: Duplicate indexes error

**Solution**:

```javascript
// Drop and recreate
db.dropDatabase()
# Restart app to recreate collections
```

---

## 🎯 Frontend Issues

### Problem: Page shows "API Error" on load

**Check**:

1. API URL correct in .env.local: `VITE_API_URL=http://localhost:5000/api`
2. Backend is running: `curl http://localhost:5000/api/health`
3. CORS enabled for frontend origin

**Debug in browser console**:

```javascript
console.log(import.meta.env.VITE_API_URL);
```

### Problem: "Cannot find api.js"

**Rebuild frontend**:

```bash
cd frontend
npm install
npm run dev
```

### Problem: Changes not reflecting

**Clear cache**:

```bash
# Hard refresh
Ctrl + Shift + R  # Windows/Linux
Cmd + Shift + R   # macOS

# Or clear completely
npm run build  # Production build
```

---

## 📝 Admin Panel Issues

### Problem: Charts/Dashboard not loading

**Check dashboard API**:

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/analytics/dashboard
```

**If empty data**:

1. Make sure orders exist in MongoDB
2. Check analytics controller logs: `docker-compose logs backend`

### Problem: Can't upload/create menu items

**Verify**:

1. User has admin role
2. All required fields filled
3. Check upload size: < 10MB

---

## 🔄 Network/Connectivity

### Problem: Docker containers can't reach each other

**Check network**:

```bash
docker network ls
docker network inspect food-ordering-sys_default
```

**Verify hostnames**:

- Backend → MongoDB: `mongodb:27017`
- Frontend → Backend: `http://backend:5000/api`

### Problem: "Connection refused" from frontend to backend

**In Docker**: Use service name

```javascript
// Instead of localhost:5000
const API_URL = "http://backend:5000/api";
```

**Locally**: Use localhost

```javascript
const API_URL = "http://localhost:5000/api";
```

---

## 🆘 Emergency Debug

### Enable verbose logging

```bash
# Backend
docker-compose exec backend npm run dev

# View all logs
docker-compose logs -f --tail=100
```

### Check all ports

```bash
# Windows
netstat -ano | findstr LISTENING

# macOS/Linux
lsof -i -n -P | grep LISTEN
```

### Restart everything fresh

```bash
docker-compose down -v  # Remove volumes too
docker-compose up -d
# Wait 30 seconds for MongoDB to be ready
```

---

## ✅ Health Checks

Run these to verify everything works:

```bash
# 1. Services running
docker-compose ps

# 2. API health
curl http://localhost:5000/health

# 3. MongoDB connection
docker-compose exec mongodb mongosh -u admin --eval "db.adminCommand('ping')"

# 4. Test auth endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Expected: Returns error about invalid credentials (DB working!)
```

---

## 📞 Still Stuck?

1. Check logs: `docker-compose logs -f`
2. Verify `.env` file is correct
3. Ensure ports 5173, 5000, 8080, 27017 are free
4. Try: `docker-compose down -v && docker-compose up -d`
5. Clear browser cache completely
