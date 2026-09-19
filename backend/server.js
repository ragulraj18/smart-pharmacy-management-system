require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
require('./models/Category');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Warn loudly if critical secrets are missing or unsafe
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 20) {
  console.warn(
    '⚠️ WARNING: JWT_SECRET is missing or too short. Set a long random value in backend/.env.'
  );
}

connectDB();

const app = express();
const server = http.createServer(app);

// ======================================================
// ALLOWED FRONTEND ORIGINS
// ======================================================

const allowedOrigins = [
  'http://localhost:5173',
  'https://smart-pharmacy-management-system.vercel.app',
];

// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('order:subscribe', (orderId) => {
    socket.join(`order:${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ======================================================
// SECURITY HEADERS
// ======================================================

app.use(helmet());

// ======================================================
// EXPRESS CORS
// ======================================================

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ======================================================
// BODY PARSERS
// ======================================================

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ======================================================
// STATIC FILES
// ======================================================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================================================
// BASIC ROUTES
// ======================================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Pharmacy API is running',
    database: 'smart_pharmacy_ai',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/pharmacist', require('./routes/pharmacistRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// ======================================================
// ERROR HANDLING
// ======================================================

app.use(notFound);
app.use(errorHandler);

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('=========================================');
  console.log('Smart Pharmacy Management System');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Database: smart_pharmacy_ai');
  console.log('Socket.IO enabled for real-time updates');
  console.log('=========================================');
});