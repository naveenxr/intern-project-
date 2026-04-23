import React, { useEffect, useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import BoardCard from '../components/BoardCard';
import { Plus, BookOpen, CheckCircle, Clock, List, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Small reusable stat card ────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, total }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="stat-card">
      <div style={{
        background: `${color}22`,
        color,
        padding: '0.75rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
        {total > 0 && (
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Dashboard ───────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const { boards, fetchBoards, createBoard, updateBoard, deleteBoard, fetchSummary, loading } = useTasks();
  const [summary, setSummary] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0 });

  // Create board modal
  const [showModal, setShowModal] = useState(false);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  // Edit board modal
  const [editBoard, setEditBoard] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const loadAll = useCallback(async () => {
    fetchBoards();
    try {
      const s = await fetchSummary();
      setSummary(s);
    } catch (e) {
      console.error('Summary error', e);
    }
  }, []);

  useEffect(() => { loadAll(); }, []);

  /* Create board */
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createBoard(newBoard);
      setShowModal(false);
      setNewBoard({ name: '', description: '' });
      const s = await fetchSummary();
      setSummary(s);
    } finally {
      setSaving(false);
    }
  };

  /* Delete board */
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Delete this board and all its tasks?')) return;
    await deleteBoard(boardId);
    const s = await fetchSummary();
    setSummary(s);
  };

  /* Open edit modal */
  const handleEditBoard = (board) => {
    setEditBoard(board);
    setEditData({ name: board.name, description: board.description || '' });
  };

  /* Save edit */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBoard(editBoard._id, editData);
      setEditBoard(null);
    } finally {
      setSaving(false);
    }
  };

  const completionPct = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>

      {/* ── Page header ── */}
      <header className="flex justify-between align-center flex-wrap gap-2" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Welcome back, <strong style={{ color: 'var(--primary)' }}>{user?.name}</strong>! Here's your overview.
          </p>
        </div>
        <button id="new-board-btn" className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Board
        </button>
      </header>

      {/* Profile Picture Alarm */}
      <AnimatePresence>
        {!user?.profilePicture && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => window.location.href = '/profile'}
                className="card"
                style={{ 
                    padding: '1.25rem 1.5rem', 
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--danger)',
                    cursor: 'pointer',
                }}
            >
                <motion.div 
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    style={{ background: 'transparent', padding: '0.75rem', borderRadius: '50%', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                >
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                </motion.div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.2rem' }}>Action Required: Profile Picture</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You haven't uploaded a profile picture yet. Click here to upload one now!</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats ── */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={List}        label="Total Tasks"  value={summary.total}      color="#6366f1" total={summary.total} />
        <StatCard icon={Clock}       label="To Do"        value={summary.todo}       color="#64748b" total={summary.total} />
        <StatCard icon={TrendingUp}  label="In Progress"  value={summary.inProgress} color="#f59e0b" total={summary.total} />
        <StatCard icon={CheckCircle} label="Completed"    value={summary.completed}  color="#10b981" total={summary.total} />
      </div>

      {/* ── Completion banner ── */}
      {summary.total > 0 && (
        <div className="card flex align-center gap-3" style={{ marginBottom: '2.5rem', padding: '1rem 1.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', minWidth: '3.5rem' }}>{completionPct}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Overall Completion</div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Boards ── */}
      <section>
        <div className="section-title">
          <BookOpen size={24} style={{ color: 'var(--primary)' }} />
          Your Grimoires <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({boards.length})</span>
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : boards.length > 0 ? (
          <div className="board-grid">
            <AnimatePresence>
              {boards.map(board => (
                <BoardCard
                  key={board._id}
                  board={board}
                  onDelete={handleDeleteBoard}
                  onEdit={handleEditBoard}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={48} style={{ color: 'var(--border)', margin: '0 auto 1rem' }} />
            <p>No grimoires yet. Create your first book to start tracking tasks!</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Create My First Grimoire
            </button>
          </div>
        )}
      </section>

      {/* ── Create Board Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Create New Board</h3>
                <button className="btn-ghost" style={{ padding: '0.3rem' }} onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateBoard} className="flex column gap-2">
                <div>
                  <label>Board Name *</label>
                  <input
                    type="text"
                    id="new-board-name"
                    placeholder="e.g., Q2 Marketing Campaign"
                    value={newBoard.name}
                    onChange={e => setNewBoard({ ...newBoard, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    id="new-board-desc"
                    placeholder="What is this board for?"
                    rows="3"
                    value={newBoard.description}
                    onChange={e => setNewBoard({ ...newBoard, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Creating…' : <><Plus size={16} /> Create Board</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Board Modal ── */}
      <AnimatePresence>
        {editBoard && (
          <div className="modal-overlay" onClick={() => setEditBoard(null)}>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Rename Board</h3>
                <button className="btn-ghost" style={{ padding: '0.3rem' }} onClick={() => setEditBoard(null)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="flex column gap-2">
                <div>
                  <label>Board Name *</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn-ghost" onClick={() => setEditBoard(null)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
