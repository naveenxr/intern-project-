import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, ArrowRight, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BoardCard = ({ board, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const colors = [
    '#2e1065', /* Deep Violet */
    '#1e3a8a', /* Deep Royal Blue */
    '#312e81', /* Indigo */
    '#4c1d95', /* Bright Violet */
    '#172554', /* Midnight Blue */
  ];
  // Pick a consistent colour based on board name length
  const bgColor = colors[(board.name.length) % colors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card flex column justify-between"
      style={{ padding: 0, overflow: 'hidden', position: 'relative', borderLeft: `8px solid ${bgColor}` }}
    >
      {/* Colour header strip - Book Spine Effect */}
      <div style={{ background: bgColor, padding: '1.25rem 1.5rem', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Book size={28} color="rgba(255,255,255,0.8)" />

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
      <div style={{ padding: '1.25rem 1.5rem', flex: 1, borderTop: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.4rem', fontStyle: 'italic' }}>{board.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
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
