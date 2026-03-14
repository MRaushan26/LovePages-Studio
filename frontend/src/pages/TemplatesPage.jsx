import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { TemplateCard } from '../components/TemplateCard.jsx';
import api from '../services/api.js';

const FALLBACK_TEMPLATES = [
  {
    _id: 'birthday-bright',
    name: 'Birthday Bright',
    slug: 'birthday-bright',
    category: 'Birthday',
    description: 'Playful confetti, polaroid-style photos, and a countdown to cake time.',
    previewImageUrl:
      'https://images.pexels.com/photos/2072170/pexels-photo-2072170.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Photo grid', 'Countdown', 'Soft animations']
  },
  {
    _id: 'proposal-cinema',
    name: 'Proposal Cinema',
    slug: 'proposal-cinema',
    category: 'Proposal',
    description: 'Dramatic intro, slow reveal of memories, and a final, bold question.',
    previewImageUrl:
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Animated intro', 'Music highlight', 'Reveal section']
  },
  {
    _id: 'anniversary-timeline',
    name: 'Anniversary Timeline',
    slug: 'anniversary-timeline',
    category: 'Anniversary',
    description: 'A scrolling timeline from first hello to today, with captions on every stop.',
    previewImageUrl:
      'https://images.pexels.com/photos/3693901/pexels-photo-3693901.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Timeline view', 'Story sections', 'Soft gradients']
  },
  {
    _id: 'friendship-collage',
    name: 'Friendship Collage',
    slug: 'friendship-collage',
    category: 'Friendship',
    description: 'Sticker-style collage, reaction bubbles, and shared memories.',
    previewImageUrl:
      'https://images.pexels.com/photos/935835/pexels-photo-935835.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Collage layout', 'Emoji accents', 'Bright palette']
  }
];

export function TemplatesPage() {
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const selectedCategoryKey = location.state?.category;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/templates');
        if (Array.isArray(res.data) && res.data.length) {
          setTemplates(res.data);
        }
      } catch (e) {
        setError(e.response?.data?.message || 'Unable to load templates. Showing defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates =
    selectedCategoryKey && !loading
      ? templates.filter((t) =>
          t.category?.toLowerCase().includes(selectedCategoryKey.toString().toLowerCase())
        )
      : templates;

  return (
    <section className="section mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="pill">Step 1 · Choose a template</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
            Start from a hand-crafted layout
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Pick a base design that matches the mood of your surprise. You can customize photos,
            colors, messages, and music on the next step.
          </p>
        </div>
        {selectedCategoryKey && (
          <p className="text-xs text-slate-400">
            Showing templates for{' '}
            <span className="font-medium text-love-pink">{selectedCategoryKey}</span>
          </p>
        )}
      </div>

      <motion.div
        className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } }
        }}
      >
        {loading ? (
          <p className="text-sm text-slate-400">Loading templates…</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : filteredTemplates.length ? (
          filteredTemplates.map((t) => (
            <motion.div key={t._id || t.slug} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <TemplateCard template={t} />
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No templates found for this category yet. Try choosing a different one.
          </p>
        )}
      </motion.div>
    </section>
  );
}

