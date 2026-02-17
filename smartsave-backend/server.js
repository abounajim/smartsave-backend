require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartsave')
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartSave API is running!',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/transactions',
      '/api/budget',
      '/api/insights',
      '/api/recurring'
    ]
  });
});
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/recurring', require('./routes/recurring'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartSave API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});