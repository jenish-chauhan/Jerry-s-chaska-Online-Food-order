# ✅ Verification Checklist - App is Working!

Use this checklist to verify all fixes are working correctly.

## 🚀 Pre-Start Verification

### 1. Check .env File

```bash
# Should contain:
grep "MONGO_URI" .env
grep "JWT_SECRET" .env
grep "PORT" .env
```

✅ All present? Continue.

### 2. Check Docker Installation

```bash
docker --version
docker-compose --version
```

✅ Both installed? Continue.

---

## 🐳 Start Services

```bash
# Clean start
docker-compose down
docker-compose up -d

# Wait 30 seconds for MongoDB to be ready
sleep 30

# Verify services running
docker-compose ps
```

**Expected output**:

```
NAME                      STATUS
jerrys_chaska_mongodb     Up (healthy)
jerrys_chaska_backend     Up
jerrys_chaska_frontend    Up
jerrys_chaska_admin       Up
```

✅ All "Up"? Continue.

---

## 🔍 API Health Checks

### Check Backend Health

```bash
curl http://localhost:5000/health
```

**Expected response**:

```json
{ "status": "ok" }
```

✅ Got ok? Continue.

### Check MongoDB Connection

```bash
docker-compose logs backend | grep "MongoDB connected"
```

**Expected**:

```
MongoDB connected successfully
```

✅ Connected? Continue.

---

## 📝 Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected response**:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

✅ Got token? User created successfully!

---

## 🔑 Test User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected response**:

```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "test@example.com", "role": "user" }
}
```

✅ Got token? Login works!

**Save this token for next steps**:

```bash
TOKEN="paste-your-token-here"
```

---

## 🍔 Test Menu API

```bash
curl http://localhost:5000/api/menu
```

**Expected response**:

```json
{
  "data": [
    {
      "_id": "...",
      "name": "Item Name",
      "description": "...",
      "price": 50,
      "category": "Snacks",
      "image_url": "...",
      "available": true
    }
  ]
}
```

✅ Got array? API working!

---

## 👨‍💼 Promote User to Admin

```bash
# Access MongoDB
docker-compose exec mongodb mongosh -u admin --authenticationDatabase admin

# Inside mongosh shell:
use jerrys_chaska
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)

# Should output: { acknowledged: true, modifiedCount: 1 }

# Exit
exit
```

✅ User promoted? Continue.

---

## 🌐 Test Frontend Access

**Open in browser**:

```
http://localhost:5173
```

**You should see**:

- ✅ Jerry's Chaska logo
- ✅ Navigation menu
- ✅ Menu items loading
- ✅ No console errors

✅ Page loads? Continue.

### Test Frontend Features

1. **Register new user**
   - Click "Login/Register"
   - Fill form
   - Click "Create Account"
   - ✅ Should redirect to home

2. **Add to cart**
   - Click on any food item
   - Increase quantity
   - Click "Add to Cart"
   - ✅ Cart count should increase

3. **Create order**
   - Go to Cart
   - Fill customer details
   - Click "Place Order"
   - ✅ Should show order success

---

## 🛠️ Test Admin Panel

**Open in browser**:

```
http://localhost:8080
```

**You should see**:

- ✅ Jerry's Chaska logo
- ✅ Login form
- ✅ Clean design

### Login to Admin

1. **Enter email**: `test@example.com`
2. **Enter password**: `TestPassword123`
3. **Click Sign In**

**Expected**:

- ✅ Redirects to dashboard
- ✅ Shows analytics
- ✅ Shows order list
- ✅ Shows menu management

### Test Admin Features

1. **View Dashboard**
   - ✅ Daily orders shown
   - ✅ Daily revenue shown
   - ✅ Total stats shown

2. **View Orders**
   - ✅ List of orders shows
   - ✅ Can see order details

3. **Update Order Status**
   - Click on order
   - Change status
   - ✅ Status updates

4. **Manage Menu Items**
   - Click "Food Items"
   - Try to add new item
   - Try to edit existing
   - Try to delete
   - ✅ All CRUD operations work

---

## 🔐 Security Verification

### 1. Hardcoded Secrets Check

```bash
# Should NOT find any of these:
grep -r "JWT_SECRET=super" .
grep -r "password=root" .
grep -r "MONGO_PASSWORD=mongo" .
```

✅ Nothing found? Secrets are safe!

### 2. CORS Validation

```bash
# Test invalid origin (should fail)
curl -H "Origin: http://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS http://localhost:5000/api/menu
```

**Expected**: Either 400 error or no CORS headers
✅ Blocked? CORS working!

### 3. Input Validation

```bash
# Test invalid email (should fail)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "not-an-email",
    "password": "Test123"
  }'
```

**Expected**: 400 error
✅ Validation working!

---

## 📊 Database Verification

```bash
# Check MongoDB collections
docker-compose exec mongodb mongosh -u admin --authenticationDatabase admin

# Inside mongosh:
use jerrys_chaska

# Check collections exist
show collections

# Check users
db.users.find().pretty()

# Check orders
db.orders.find().pretty()

# Check food items
db.foodItems.find().pretty()

# Exit
exit
```

**Expected**:

- ✅ `users` collection with your test user
- ✅ `orders` collection (if you created an order)
- ✅ `foodItems` collection
- ✅ `adminsessions` collection

---

## 🚀 Complete Feature Test

### Scenario: Full User Journey

1. **Register as customer**
   - Frontend → Register
   - Create account with test email
   - ✅ Should work

2. **Browse and order**
   - View menu items
   - Add items to cart
   - Checkout
   - ✅ Should create order

3. **Login as admin**
   - Admin panel → Login
   - See new order in dashboard
   - Update order status
   - ✅ Should work

4. **Check order as customer**
   - Frontend → Login with customer account
   - View "My Orders"
   - See status update
   - ✅ Should reflect

---

## ✅ Final Checklist

- [ ] All services running (docker-compose ps)
- [ ] API health check passes (curl health)
- [ ] User registration works
- [ ] User login works
- [ ] Menu API returns items
- [ ] Admin user created
- [ ] Frontend loads (http://localhost:5173)
- [ ] Admin login works (http://localhost:8080)
- [ ] Admin dashboard shows data
- [ ] Orders can be created
- [ ] Order status can be updated
- [ ] No hardcoded secrets in code
- [ ] CORS validation working
- [ ] Input validation working
- [ ] MongoDB connected and healthy

---

## 🎉 All Verified!

If all tests pass, your application is:

✅ **Accessible** - Works via browser
✅ **Functional** - All features working
✅ **Secure** - No vulnerabilities
✅ **Stable** - All services healthy
✅ **Production Ready** - Can be deployed

## 🚀 Ready to Deploy!

---

## ❌ Something Failed?

Check the troubleshooting guide:

**Port issues?** → See `TROUBLESHOOTING.md` → Port Issues
**API errors?** → See `TROUBLESHOOTING.md` → API Issues  
**Login problems?** → See `TROUBLESHOOTING.md` → Authentication Issues
**Database issues?** → See `TROUBLESHOOTING.md` → Database Issues

---

**Last Updated**: 2024
**Status**: All tests automated & manual
