import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft, X, CheckCircle, Clock, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'To Do',       label: 'To Do',        badge: 'badge-todo',      icon: List,         color: '#64748b' },
  { id: 'In Progress', label: 'In Progress',   badge: 'badge-progress',  icon: Clock,        color: '#f59e0b' },
  { id: 'Completed',   label: 'Completed',     badge: 'badge-completed', icon: CheckCircle,  color: '#10b981' },
];

const EMPTY_TASK = { title: '', description: '', status: 'To Do', priority: 'Medium', deadline: '' };

const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, boards, fetchBoards, loading } = useTasks();

  const [currentBoard, setCurrentBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskData, setTaskData] = useState(EMPTY_TASK);
  const [saving, setSaving] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    if (boards.length === 0) fetchBoards();
    fetchTasks(id);
  }, [id]);

  useEffect(() => {
    if (boards.length > 0) {
      setCurrentBoard(boards.find(b => b._id === id) || null);
    }
  }, [boards, id]);

  const openCreate = (status = 'To Do') => {
    setEditingTask(null);
    setTaskData({ ...EMPTY_TASK, status });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setTaskData({
      title:       task.title,
      description: task.description || '',
      status:      task.status,
      priority:    task.priority,
      deadline:    task.deadline ? task.deadline.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask({ ...taskData, boardId: id });
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = (taskId, newStatus) => updateTask(taskId, { status: newStatus });

  const filteredTasks = (colId) => tasks
    .filter(t => t.status === colId)
    .filter(t => filterPriority === 'All' || t.priority === filterPriority);

  if (!currentBoard && loading) {
    return <div className="spinner-wrapper"><div className="spinner" /></div>;
  }
  if (!currentBoard && !loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Board not found.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: '1.5rem 0 4rem' }}>

      {/* ── Page header ── */}
      <header style={{ marginBottom: '1.75rem' }}>
        <button className="btn-ghost" onClick={() => navigate('/dashboard')}
          style={{ marginBottom: '0.75rem', padding: '0.4rem 0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex justify-between align-center flex-wrap gap-2">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{currentBoard?.name}</h1>
            {currentBoard?.description && (
              <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.9rem' }}>{currentBoard.description}</p>
            )}
          </div>

          <div className="flex align-center gap-2">
            {/* Priority filter */}
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button id="add-task-btn" className="btn-primary" onClick={() => openCreate()}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>

        {/* Column totals row */}
        <div className="flex gap-2 flex-wrap" style={{ marginTop: '1rem' }}>
          {COLUMNS.map(col => (
            <div key={col.id} className="flex align-center gap-1"
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <col.icon size={13} style={{ color: col.color }} />
              <span>{col.label}:</span>
              <strong style={{ color: 'var(--text-main)' }}>{filteredTasks(col.id).length}</strong>
            </div>
          ))}
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            · {tasks.length} total task{tasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </header>

      {/* ── Kanban columns ── */}
      <div className="status-columns">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks(col.id);
          return (
            <div key={col.id} className="kanban-column">
              {/* Column header */}
              <div className="flex justify-between align-center" style={{ marginBottom: '0.75rem' }}>
                <div className="flex align-center gap-1">
                  <span className={`badge ${col.badge}`}>
                    <col.icon size={11} />
                    {col.label}
                  </span>
                  <span style={{
                    background: 'var(--border)',
                    color: 'var(--text-muted)',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                  }}>{colTasks.length}</span>
                </div>
                <button
                  className="btn-ghost"
                  style={{ padding: '0.25rem', borderRadius: '7px' }}
                  onClick={() => openCreate(col.id)}
                  title={`Add task to ${col.label}`}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Tasks */}
              <AnimatePresence>
                {colTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={openEdit}
                    onDelete={deleteTask}
                    onMove={handleMove}
                  />
                ))}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <div
                  className="empty-state"
                  style={{ padding: '1.5rem', cursor: 'pointer' }}
                  onClick={() => openCreate(col.id)}
                >
                  <Plus size={20} style={{ margin: '0 auto 0.4rem', display: 'block', color: 'var(--border)' }} />
                  <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>Click to add a task</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Task Modal ── */}
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
                <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
                <button className="btn-ghost" style={{ padding: '0.3rem' }} onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex column gap-2">
                <div>
                  <label>Title *</label>
                  <input
                    id="task-title"
                    type="text"
                    placeholder="What needs to be done?"
                    value={taskData.title}
                    onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    id="task-desc"
                    placeholder="Add more details…"
                    rows="3"
                    value={taskData.description}
                    onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <div style={{ flex: 1 }}>
                    <label>Priority</label>
                    <select
                      id="task-priority"
                      value={taskData.priority}
                      onChange={e => setTaskData({ ...taskData, priority: e.target.value })}
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🔴 High</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Status</label>
                    <select
                      id="task-status"
                      value={taskData.status}
                      onChange={e => setTaskData({ ...taskData, status: e.target.value })}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Deadline</label>
                  <input
                    id="task-deadline"
                    type="date"
                    value={taskData.deadline}
                    onChange={e => setTaskData({ ...taskData, deadline: e.target.value })}
                  />
                </div>

                <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingTask ? 'Update Task' : <><Plus size={16} /> Create Task</>}
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

export default BoardView;
