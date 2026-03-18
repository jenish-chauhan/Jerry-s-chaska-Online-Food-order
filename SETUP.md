# Jerry's Chaska - Full Setup & Running Guide

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites

- Docker & Docker Compose installed
- Port 5173, 5000, 8080, 27017 available

### Step 1: Configure Environment Variables

The `.env` file is pre-configured for Docker. For production, update:

```bash
# In .env file
MONGO_PASSWORD=change-this-to-a-strong-password
JWT_SECRET=change-this-to-a-strong-secret-key
```

### Step 2: Start All Services

```bash
docker-compose up -d
```

### Step 3: Access the Applications

- **Main Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:8080
- **API Server**: http://localhost:5000/api

### Default Admin Account (Create One First)

1. Start the app
2. Go to frontend and register a normal user
3. In MongoDB Compass or mongosh, update the user role to 'admin':
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } },
   );
   ```
4. Use that account to login to admin panel at http://localhost:8080

---

## 📋 Manual Setup (Development)

### Prerequisites

- Node.js v16+
- MongoDB v5+ running locally or remote
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=mongodb://localhost:27017/jerrys_chaska
JWT_SECRET=your-dev-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Access: http://localhost:5173

### Admin Panel Setup

```bash
cd admin-panel
npm install
```

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

Start admin:

```bash
npm run dev
```

Access: http://localhost:5174

---

## 🔐 Security Features Implemented

✅ **Strong Password Hashing** - bcrypt with 12 salt rounds
✅ **JWT Authentication** - Secure token-based auth
✅ **Admin Session Management** - Single session per admin (auto logout on new login)
✅ **CORS Protection** - Whitelist configured origins only
✅ **Input Validation** - All inputs validated with express-validator
✅ **SQL Injection Protection** - Using MongoDB (no SQL), prepared queries where needed
✅ **Environment Variables** - Sensitive data in .env (never hardcoded)
✅ **HTTP Headers** - Proper status codes and error messages

---

## 🛠 Database

### MongoDB Collections

- `users` - User accounts (role: user/admin)
- `food_items` - Menu items
- `orders` - Customer orders
- `adminsessions` - Active admin sessions (auto-expire after 24h)

### Default Admin Creation

After registering a user via frontend, promote to admin:

**Using MongoDB Compass:**

1. Connect to your MongoDB
2. Navigate to database `jerrys_chaska`
3. Collection `users`
4. Find your user document
5. Edit and change `role` from "user" to "admin"

**Using mongosh:**

```javascript
use jerrys_chaska
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🧪 Testing the API

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Get Menu Items

```bash
curl http://localhost:5000/api/menu
```

### Create Menu Item (Admin Only)

```bash
curl -X POST http://localhost:5000/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Samosa",
    "description": "Crispy potato samosa",
    "price": 50,
    "category": "Snacks",
    "image_url": "https://example.com/samosa.jpg"
  }'
```

---

## 🐛 Troubleshooting

### App Not Accessible

- Check if services are running: `docker-compose ps`
- Check logs: `docker-compose logs backend`
- Ensure ports 5173, 5000, 8080, 27017 are not in use

### Admin Login Crashes

- Ensure user has `role: "admin"` in MongoDB
- Check JWT_SECRET matches in .env
- Check browser console for errors
- Clear sessionStorage and try again

### Can't Connect to MongoDB

- If using Docker: MongoDB might not be healthy yet, wait 30 seconds
- Check MONGO_URI in .env
- Verify MongoDB credentials in docker-compose.yml

### API Returns 401

- Token expired or invalid
- Check JWT_SECRET
- Re-login to get new token

---

## 📦 API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin
- `POST /api/auth/logout` - Logout (admin)

### Menu (Public)

- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category

### Menu (Admin Only)

- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user's orders

### Admin

- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

### Analytics (Admin Only)

- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/orders-over-time` - Orders last 30 days
- `GET /api/analytics/top-items` - Top selling items
- `GET /api/analytics/orders-by-status` - Orders breakdown

---

## 🔄 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change `MONGO_PASSWORD` to a strong password
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` for your domain
- [ ] Enable MongoDB authentication
- [ ] Setup HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Setup backups for MongoDB

### Docker Production

```bash
# Build images
docker-compose build

# Start with production settings
docker-compose -f docker-compose.yml up -d
```

---

## 📝 Fixed Issues

- ✅ Database inconsistency (MySQL + MongoDB) - Now using MongoDB only
- ✅ Missing axios in admin panel - Added
- ✅ Hardcoded credentials - Removed
- ✅ Weak JWT secret - Updated
- ✅ Insufficient CORS validation - Improved
- ✅ Unnecessary socket.io code - Removed
- ✅ Admin login crashes - Fixed authentication flow
- ✅ App not accessible - Fixed port and service configurations

---

## 📞 Support

For issues, check:

1. Docker logs: `docker-compose logs -f`
2. MongoDB health: `docker-compose logs mongodb`
3. Backend errors: `docker-compose logs backend`
4. API health: http://localhost:5000/health
