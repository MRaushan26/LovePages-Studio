import express from 'express';
import { Template } from '../models/Template.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const count = await Template.countDocuments();
    if (count === 0) {
      const seeded = await Template.insertMany([
        {
          name: 'Birthday Bright',
          slug: 'birthday-bright',
          category: 'Birthday',
          description: 'Playful confetti, polaroid-style photos, and a countdown to cake time.',
          previewImageUrl:
            'https://images.pexels.com/photos/2072170/pexels-photo-2072170.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Photo grid', 'Countdown timer', 'Confetti animation'],
          baseConfig: {
            themeColor: '#f97316',
            supportsVideo: false,
            supportsPassword: false,
            supportsCustomAnimations: true,
            sections: ['intro', 'gallery', 'message', 'countdown']
          },
          priceTier: 99
        },
        {
          name: 'Proposal Cinema',
          slug: 'proposal-cinema',
          category: 'Proposal',
          description: 'Dramatic intro, slow reveal of memories, and a final, bold question.',
          previewImageUrl:
            'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Cinematic intro', 'Reveal sections', 'Animated confetti'],
          baseConfig: {
            themeColor: '#ec4899',
            supportsVideo: true,
            supportsPassword: true,
            supportsCustomAnimations: true,
            sections: ['intro', 'story', 'gallery', 'proposal']
          },
          priceTier: 199
        },
        {
          name: 'Anniversary Timeline',
          slug: 'anniversary-timeline',
          category: 'Anniversary',
          description: 'A scrolling timeline from first hello to today.',
          previewImageUrl:
            'https://images.pexels.com/photos/3693901/pexels-photo-3693901.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Timeline layout', 'Milestone markers', 'Soft gradients'],
          baseConfig: {
            themeColor: '#facc15',
            supportsVideo: false,
            supportsPassword: true,
            supportsCustomAnimations: false,
            sections: ['timeline', 'gallery', 'message']
          },
          priceTier: 149
        },
        {
          name: 'Friendship Collage',
          slug: 'friendship-collage',
          category: 'Friendship',
          description: 'Sticker-style collage, reactions, and shared memories.',
          previewImageUrl:
            'https://images.pexels.com/photos/935835/pexels-photo-935835.jpeg?auto=compress&cs=tinysrgb&w=800',
          features: ['Collage grid', 'Reaction stickers', 'Bright palette'],
          baseConfig: {
            themeColor: '#22c55e',
            supportsVideo: false,
            supportsPassword: false,
            supportsCustomAnimations: true,
            sections: ['collage', 'messages']
          },
          priceTier: 99
        }
      ]);
      return res.json(seeded);
    }

    const templates = await Template.find().sort({ priceTier: 1 });
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

export default router;

