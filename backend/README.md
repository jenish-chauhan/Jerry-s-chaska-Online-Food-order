# Jerry's Chaska Backend API

Production-ready Node.js/Express backend for the Jerry's Chaska food ordering system with MySQL database integration.

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MySQL 8.0 (XAMPP or standalone)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update with your MySQL credentials.

4. **Setup MySQL database**
   - Start XAMPP and ensure MySQL is running
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import `schema.sql` to create database and tables
   
   **OR** run via command line:
   ```bash
   mysql -u root -p < schema.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `POST /api/menu` - Create menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Orders
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/user/:userId` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get specific order (authenticated)
- `GET /api/orders` - Get all orders (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Health
- `GET /health` - Health check endpoint

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Example
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jerryschaska.com","password":"admin123"}'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@jerryschaska.com",
    "role": "admin"
  }
}
```

### Using the Token
Include the token in the Authorization header:
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Schema

### Tables
- **users**: User accounts (customers and admins)
- **food_items**: Menu items with pricing and availability
- **orders**: Order records with status tracking
- **order_items**: Individual items within each order

See `schema.sql` for complete schema definition.

## 🐳 Docker Deployment

Build the Docker image:
```bash
docker build -t jerrys-chaska-backend .
```

Run the container:
```bash
docker run -p 3000:3000 --env-file .env jerrys-chaska-backend
```

## 🔗 Frontend Integration

The frontend should be configured to use this API:

1. Update frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

2. The backend CORS is configured to accept requests from `http://localhost:5173` by default.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | jerrys_chaska |
| `DB_PORT` | MySQL port | 3306 |
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🛠️ Development

### Project Structure
```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── app.js          # Main application
├── schema.sql          # Database schema
├── .env.example        # Environment template
├── Dockerfile          # Docker configuration
└── package.json        # Dependencies
```

### Testing with Postman/Thunder Client

Import these example requests:

**Register User:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Order:**
```
POST http://localhost:3000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {"id": 1, "quantity": 2, "price": 8.99},
    {"id": 3, "quantity": 1, "price": 12.99}
  ],
  "total_price": 30.97
}
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- CORS protection
- Input validation with express-validator
- SQL injection prevention via parameterized queries
- Role-based access control (user/admin)

## 📊 Default Admin Account

Email: `admin@jerryschaska.com`  
Password: `admin123`

**⚠️ Change this password in production!**

## 🐛 Troubleshooting

### Database Connection Failed
- Ensure XAMPP MySQL is running
- Check database credentials in `.env`
- Verify database `jerrys_chaska` exists

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Ensure frontend is running on the specified URL

## 📄 License

ISC
