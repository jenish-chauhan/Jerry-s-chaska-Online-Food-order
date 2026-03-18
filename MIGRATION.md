# Migration Guide - Database & Security Updates

## What Changed?

### 1. Database Migration: MySQL → MongoDB Only

**Before**: Mixed MySQL + MongoDB (confusing and error-prone)
**After**: Pure MongoDB (clean, consistent)

**Impact**:

- All user data now in MongoDB
- All menu items now in MongoDB
- Simplified connection management
- Better performance with document storage

### 2. Removed Unnecessary Dependencies

**Removed**:

- `socket.io` & `socket.io-client` (not fully used)
- `mysql2` (replaced with MongoDB)

**Kept**:

- `axios` - Simple HTTP client
- `express-validator` - Input validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - Authentication
- `mongoose` - MongoDB ODM

### 3. Security Improvements

#### Password Requirements

- **Old**: 6+ characters
- **New**: 8+ characters minimum

#### JWT Token Expiry

- **Users**: 7 days (was 24 hours)
- **Admins**: 1 hour (was 15 minutes)
- Both tokens auto-validate via MongoDB session store

#### Admin Sessions

- Automatically invalidate previous sessions when logging in again
- Server-side validation of active sessions
- 24-hour auto-expiration

#### CORS Policy

- **Old**: Accepts origin from open list
- **New**: Validates origin callback function, rejects invalid sources

### 4. Configuration Files

#### New `.env` (Docker)

```env
MONGO_URI=mongodb://admin:password@mongodb:27017/jerrys_chaska?authSource=admin
MONGO_PASSWORD=your-password
JWT_SECRET=your-super-secret-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

#### docker-compose.yml Changes

- Replaced `mongo` service with `mongodb` with authentication
- Added health checks
- Simplified environment variable passing
- Proper service dependencies

### 5. API Consistency

All endpoints now return:

```json
{
  "data": {...},
  "message": "Success",
  "error": null
}
```

Status codes:

- 201 - Resource created
- 200 - Success
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

### 6. Admin Panel Fixes

#### API Integration

- **Old**: Native fetch API (inconsistent error handling)
- **New**: Axios with interceptors
  - Auto token injection
  - Auto 401 redirect to login
  - Consistent error handling

#### Login Form

- Removed hardcoded email placeholder
- Better error messages
- Proper session storage

### 7. Backend Simplification

#### Removed Code

- Socket.io event emitters (not used)
- MySQL connection pool in analytics
- In-memory session store (unreliable)

#### New Code

- MongoDB-based session validation
- Proper async/await error handling
- Consistent response formats

---

## Migration Steps

### Step 1: Backup Existing Data (If Any)

If you have data in MySQL:

```bash
# Export MySQL data
mysqldump -u root -p jerrys_chaska > backup.sql
```

### Step 2: Update Docker Configuration

```bash
# Remove old containers
docker-compose down

# Pull new image
docker-compose pull

# Start fresh
docker-compose up -d
```

### Step 3: Verify Setup

```bash
# Check services running
docker-compose ps

# Check MongoDB is healthy
docker exec jerrys_chaska_mongodb mongosh -u admin -p <password> --eval "db.adminCommand('ping')"

# Test API health
curl http://localhost:5000/health
```

### Step 4: Create Admin User

1. Register via http://localhost:5173
2. Update role via MongoDB:

```javascript
db.users.updateOne({ email: "your-email" }, { $set: { role: "admin" } });
```

### Step 5: Test Admin Panel

- Login at http://localhost:8080
- Dashboard should load without errors

---

## Rollback Instructions

If needed to rollback to previous version:

```bash
# Stop current services
docker-compose down

# Restore from git
git checkout main -- .

# Restart old version
docker-compose up -d
```

---

## Breaking Changes

❌ **Old Data**: If you had MySQL data, it's now in MongoDB. You'll need to:

1. Export from MySQL
2. Transform to MongoDB format
3. Import into MongoDB

❌ **Socket.io events**: No longer emitted. Use polling or WebSockets if needed.

✅ **All API endpoints**: Still work the same, just cleaner responses

---

## Performance Improvements

| Metric            | Before       | After        |
| ----------------- | ------------ | ------------ |
| Dependencies      | Many         | Minimal      |
| Docker image size | Larger       | Smaller      |
| API response time | Mixed        | Consistent   |
| Error handling    | Inconsistent | Standardized |
| CORS validation   | Loose        | Strict       |

---

## Testing Checklist

- [ ] Can register new user
- [ ] Can login with registered account
- [ ] Can view menu items
- [ ] Can create order (frontend)
- [ ] Can login to admin panel
- [ ] Can view analytics dashboard
- [ ] Can create/edit menu items (admin)
- [ ] Can update order status (admin)
- [ ] Session invalidates after token expires
- [ ] CORS blocks invalid origins

---

## Questions?

Check SETUP.md for detailed setup instructions.
