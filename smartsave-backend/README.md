# SmartSave Backend API

Secure backend for SmartSave Personal Finance App - your code is protected on the server!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string and JWT secret.

### 3. Start MongoDB
Make sure MongoDB is running locally, or use MongoDB Atlas (cloud).

### 4. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
smartsave-backend/
├── server.js              # Main server file
├── routes/                # API endpoints
│   ├── auth.js           # Login/signup
│   ├── transactions.js    # Transaction CRUD
│   ├── budget.js         # Budget management
│   ├── insights.js       # AI insights
│   └── recurring.js      # Recurring expenses
├── models/               # Database schemas
│   ├── User.js
│   ├── Transaction.js
│   └── RecurringExpense.js
├── middleware/           # Auth middleware
│   └── auth.js
├── utils/               # Helper functions
│   ├── calculations.js  # Budget calculations
│   └── ai.js           # AI insights logic
└── package.json

```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Transactions (Protected)
- `POST /api/transactions` - Add transaction
- `GET /api/transactions` - Get all transactions
- `DELETE /api/transactions/:id` - Delete transaction

### Budget (Protected)
- `POST /api/budget` - Set monthly budget
- `GET /api/budget` - Get budget info
- `POST /api/budget/category` - Set category budget

### Insights (Protected)
- `GET /api/insights` - Get AI-generated insights

### Recurring Expenses (Protected)
- `POST /api/recurring` - Add recurring expense
- `GET /api/recurring` - Get all recurring expenses
- `DELETE /api/recurring/:id` - Delete recurring expense

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation
- MongoDB injection prevention

## 🌐 Deployment

### Option 1: Railway
1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Add environment variables
4. Deploy!

### Option 2: Render
1. Create account at render.com
2. New Web Service → Connect GitHub
3. Add environment variables
4. Deploy!

### Option 3: Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel`
3. Follow prompts

## 📝 Environment Variables

Required in production:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (use a random string)
- `PORT` - Server port (optional, defaults to 5000)
- `FRONTEND_URL` - Your frontend URL for CORS

## 🎯 Next Steps

1. Deploy this backend to Railway/Render
2. Update your frontend to call these API endpoints
3. Your code is now protected on the server!

## 💡 Tips

- Use MongoDB Atlas for free cloud database
- Change JWT_SECRET to a random string in production
- Enable HTTPS in production
- Add rate limiting for API routes
- Set up monitoring (e.g., Sentry)
