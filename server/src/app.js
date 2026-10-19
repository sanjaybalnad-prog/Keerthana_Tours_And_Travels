import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
app.disable('x-powered-by');

// Needed when deployed behind a reverse proxy / hosting platform (Render, Railway, etc.)
// so that Express knows the original request was HTTPS.
if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow the configured React origin(s) and non-browser tools (Postman, curl) that send no Origin header.
      if (!origin || env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true, // lets the browser send/receive the auth cookie
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? 'OK' : 'Database not connected',
  });
});

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/leads', leadRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
