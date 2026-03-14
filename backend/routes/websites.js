import express from 'express';
import { nanoid } from 'nanoid';
import { GeneratedWebsite } from '../models/GeneratedWebsite.js';
import { Template } from '../models/Template.js';
import { Order } from '../models/Order.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      templateId,
      recipientName,
      message,
      photos = [],
      music,
      themeColor,
      countdownTo,
      endingMessage,
      amount = 149
    } = req.body;

    if (!recipientName || !message) {
      return res.status(400).json({ message: 'Recipient name and message are required.' });
    }

    const template =
      (templateId &&
        (await Template.findOne({ $or: [{ _id: templateId }, { slug: templateId }] }))) ||
      null;

    const baseName = `${recipientName}`.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    const baseEvent = template?.category?.toLowerCase() || 'surprise';
    const randomSuffix = nanoid(4).toLowerCase();
    let slug = `${baseName}-${baseEvent}-${randomSuffix}`;

    let suffix = 1;
    while (await GeneratedWebsite.exists({ slug })) {
      slug = `${baseName}-${baseEvent}-${randomSuffix}-${suffix++}`;
    }

    const now = new Date();
    const expiryDate = new Date(now);
    if (amount === 99) {
      expiryDate.setDate(expiryDate.getDate() + 30);
    } else if (amount === 149) {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    } else if (amount === 199) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    const website = await GeneratedWebsite.create({
      slug,
      recipientName,
      message,
      photos,
      music,
      themeColor,
      user: req.user?._id,
      template: template?._id,
      countdownTo: countdownTo || null,
      endingMessage,
      priceTier: amount,
      expiryDate
    });

    await Order.create({
      website: website._id,
      user: req.user?._id,
      amount,
      status: 'paid',
      paymentReference: `sim_${nanoid(10)}`
    });

    res.status(201).json({ slug: website.slug, id: website._id });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const website = await GeneratedWebsite.findOne({ slug: req.params.slug, isActive: true }).populate(
      'template'
    );
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    if (website.expiryDate && website.expiryDate < new Date()) {
      website.isActive = false;
      await website.save();
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json(website);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    // only owner or admin can delete
    if (website.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this website.' });
    }
    website.isActive = false;
    await website.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/mine/list', authMiddleware, async (req, res, next) => {
  try {
    const websites = await GeneratedWebsite.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(websites);
  } catch (err) {
    next(err);
  }
});

export default router;

