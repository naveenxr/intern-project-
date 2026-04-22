import React from 'react';
import { Calendar, Edit2, Trash2, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIORITY_COLORS = {
  Low:    { dot: 'low',    badge: 'badge-low' },
  Medium: { dot: 'medium', badge: 'badge-medium' },
  High:   { dot: 'high',   badge: 'badge-high' },
};

const STATUS_ORDER = ['To Do', 'In Progress', 'Completed'];

const TaskCard = ({ task, onEdit, onDelete, onMove }) => {
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    const today = new Date();
    const isOverdue = date < today && task.status !== 'Completed';
    return { text: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), overdue: isOverdue };
  };

  const deadline = formatDate(task.deadline);
  const currentIdx = STATUS_ORDER.indexOf(task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card"
      style={{ padding: '1rem', marginBottom: '0.75rem', cursor: 'default' }}
    >
      {/* Top row */}
      <div className="flex justify-between align-center" style={{ marginBottom: '0.6rem' }}>
        <span className={`badge ${pc.badge}`}>
          <span className={`priority-dot ${pc.dot}`} />
          {task.priority}
        </span>
        <div className="flex gap-1">
          {onMove && currentIdx > 0 && (
            <button
              className="btn-ghost"
              style={{ padding: '0.2rem', borderRadius: '6px' }}
              title="Move left"
              onClick={() => onMove(task._id, STATUS_ORDER[currentIdx - 1])}
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {onMove && currentIdx < STATUS_ORDER.length - 1 && (
            <button
              className="btn-ghost"
              style={{ padding: '0.2rem', borderRadius: '6px' }}
              title="Move right"
              onClick={() => onMove(task._id, STATUS_ORDER[currentIdx + 1])}
            >
              <ChevronRight size={14} />
            </button>
          )}
          <button
            className="btn-ghost"
            style={{ padding: '0.2rem', borderRadius: '6px' }}
            title="Edit task"
            onClick={() => onEdit(task)}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="btn-ghost text-danger"
            style={{ padding: '0.2rem', borderRadius: '6px', color: 'var(--danger)' }}
            title="Delete task"
            onClick={() => onDelete(task._id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        marginBottom: '0.35rem',
        lineHeight: 1.4,
        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
        opacity: task.status === 'Completed' ? 0.6 : 1,
      }}>
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          lineHeight: 1.5,
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      {deadline && (
        <div
          className="flex align-center gap-1"
          style={{
            fontSize: '0.78rem',
            color: deadline.overdue ? 'var(--danger)' : 'var(--text-muted)',
            fontWeight: deadline.overdue ? 600 : 400,
            marginTop: task.description ? 0 : '0.5rem',
          }}
        >
          <Calendar size={13} />
          <span>{deadline.overdue ? '⚠ Overdue · ' : ''}{deadline.text}</span>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
