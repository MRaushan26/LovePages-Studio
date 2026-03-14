import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order.js';
import { GeneratedWebsite } from '../models/GeneratedWebsite.js';
import { User } from '../models/User.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lovepages_super_secret';
const TOKEN_EXPIRES_IN = '7d';

function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN
  });
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash || '');
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = signToken(admin);
    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', adminMiddleware, async (req, res) => {
  const admin = req.user;
  res.json({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  });
});

router.use(adminMiddleware);

router.get('/overview', async (req, res, next) => {
  try {
    const [orders, activeWebsites, totalUsers, totalWebsites] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalOrders: { $sum: 1 }
          }
        }
      ]),
      GeneratedWebsite.countDocuments({ isActive: true }),
      User.countDocuments(),
      GeneratedWebsite.countDocuments()
    ]);

    const summary = orders[0] || { totalRevenue: 0, totalOrders: 0 };
    res.json({
      totalRevenue: summary.totalRevenue || 0,
      totalOrders: summary.totalOrders || 0,
      activeWebsites,
      totalWebsites,
      totalUsers
    });
  } catch (err) {
    next(err);
  }
});

router.get('/websites', async (req, res, next) => {
  try {
    const websites = await GeneratedWebsite.find().sort({ createdAt: -1 }).limit(100);
    res.json(websites);
  } catch (err) {
    next(err);
  }
});

router.delete('/websites/:id', async (req, res, next) => {
  try {
    await GeneratedWebsite.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('website', 'recipientName slug');
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200).select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/users/:id/ban', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban an admin.' });
    }
    user.banned = !user.banned;
    await user.save();
    res.json({ user: { id: user._id, banned: user.banned } });
  } catch (err) {
    next(err);
  }
});

export default router;

