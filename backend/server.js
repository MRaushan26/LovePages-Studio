import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import templatesRouter from './routes/templates.js';
import authRouter from './routes/auth.js';
import websitesRouter from './routes/websites.js';
import adminRouter from './routes/admin.js';
import uploadsRouter from './routes/uploads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
  })
);
app.use(express.json({ limit: '10mb' }));
app.get("/", (req, res) => {
  res.send("LovePages Studio API is running 🚀");
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LovePages Studio API' });
});

app.use('/api/auth', authRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/websites', websitesRouter);


app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

// Serve local uploads (images, music) if present
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lovepages_studio';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Ensure there is an admin account for the dashboard
    const { User } = await import('./models/User.js');
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const bcrypt = await import('bcrypt');
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: 'Admin',
          email: adminEmail.toLowerCase(),
          passwordHash,
          role: 'admin'
        });
        console.log('Created default admin user');
      } else {
        console.warn(
          'No admin user found and ADMIN_EMAIL/ADMIN_PASSWORD not set. Set env vars to create an admin account.'
        );
      }
    }

    app.listen(PORT, () => {
      console.log(`LovePages Studio API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

