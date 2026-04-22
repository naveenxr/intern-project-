import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, ArrowRight, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BoardCard = ({ board, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const colors = [
    'linear-gradient(135deg,#6366f1,#818cf8)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#ef4444,#f87171)',
    'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    'linear-gradient(135deg,#0ea5e9,#38bdf8)',
  ];
  // Pick a consistent colour based on board name length
  const gradient = colors[(board.name.length) % colors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card flex column justify-between"
      style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
    >
      {/* Colour header strip */}
      <div style={{ background: gradient, padding: '1.25rem 1.5rem', position: 'relative' }}>
        <Layout size={28} color="rgba(255,255,255,0.9)" />

        {/* Kebab menu */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          <button
            className="btn-ghost"
            style={{ padding: '0.3rem', color: 'white', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}
            onClick={(e) => { e.preventDefault(); setMenuOpen(o => !o); }}
            title="Board options"
          >
            <MoreVertical size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '140px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  className="btn-ghost"
                  style={{ width: '100%', borderRadius: 0, padding: '0.65rem 1rem', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); onEdit && onEdit(board); }}
                >
                  <Edit2 size={14} /> Rename
                </button>
                <div className="divider" style={{ margin: 0 }} />
                <button
                  className="btn-ghost text-danger"
                  style={{ width: '100%', borderRadius: 0, padding: '0.65rem 1rem', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--danger)' }}
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); onDelete && onDelete(board._id); }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{board.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {board.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer link */}
      <div style={{ padding: '0 1.5rem 1.25rem' }}>
        <Link
          to={`/board/${board._id}`}
          className="btn-primary"
          style={{ textDecoration: 'none', fontSize: '0.85rem', width: '100%' }}
        >
          Open Board <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
};

export default BoardCard;
