import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { ensureDemoUsers } from './controllers/authController.js';

dotenv.config();

const app = express();
let dbConnectionPromise;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await ensureDemoUsers();
    console.log('Connected to MongoDB Atlas');
    console.log('Demo users ready: admin@example.com, user@example.com, sam@example.com');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/' || req.path === '/favicon.ico') {
    return next();
  }

  try {
    dbConnectionPromise ||= connectDB();
    await dbConnectionPromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' });
});

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'TaskFlow API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  });
}

export default app;
