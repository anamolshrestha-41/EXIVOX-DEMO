import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use('/uploads', express.static('uploads'));

// File upload middleware
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Database connection
import connectDB from './config/db.js';

// Routes
import postRoutes from './routes/postRoutes.js';

app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'EXIVOX API is running...',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📊 Database: MongoDB connected`);
  });
};

startServer();