import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function TemplateCard({ template }) {
  return (
    <motion.article
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-black/40"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={template.previewImageUrl}
          alt={template.name}
          className="h-40 w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur">
          {template.category}
        </span>
      </div>
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-50">{template.name}</h3>
          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-slate-200">
            ₹{template.priceTier || template.price || 149}
          </span>
        </div>
        <p className="text-xs text-slate-300">{template.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-2 text-slate-200">
          {template.features?.slice(0, 3).map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-full bg-slate-900/50 px-2 py-1 text-[10px]"
            >
              {f}
            </span>
          ))}
        </div>
        <Link
          to={`/customize/${template._id || template.slug}`}
          state={{ template }}
          className="btn-primary px-4 py-1.5 text-xs"
        >
          Customize
        </Link>
      </div>
    </motion.article>
  );
}

