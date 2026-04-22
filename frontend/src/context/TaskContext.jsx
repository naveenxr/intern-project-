import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [boards, setBoards] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const getConfig = () => ({
        headers: { Authorization: `Bearer ${user?.token}` },
    });

    /* ── Boards ─────────────────────────────────────────── */
    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/boards', getConfig());
            setBoards(res.data);
        } catch (error) {
            addToast('Failed to load boards', 'error');
            console.error('Error fetching boards', error);
        } finally {
            setLoading(false);
        }
    };

    const createBoard = async (boardData) => {
        try {
            const res = await axios.post('/api/boards', boardData, getConfig());
            setBoards(prev => [...prev, res.data]);
            addToast('Board created successfully!');
            return res.data;
        } catch (error) {
            addToast('Failed to create board', 'error');
            throw error;
        }
    };

    const updateBoard = async (boardId, boardData) => {
        try {
            const res = await axios.put(`/api/boards/${boardId}`, boardData, getConfig());
            setBoards(prev => prev.map(b => b._id === boardId ? res.data : b));
            addToast('Board updated successfully!');
            return res.data;
        } catch (error) {
            addToast('Failed to update board', 'error');
            throw error;
        }
    };

    const deleteBoard = async (boardId) => {
        try {
            await axios.delete(`/api/boards/${boardId}`, getConfig());
            setBoards(prev => prev.filter(b => b._id !== boardId));
            addToast('Board deleted successfully');
        } catch (error) {
            addToast('Failed to delete board', 'error');
            throw error;
        }
    };

    /* ── Tasks ──────────────────────────────────────────── */
    const fetchTasks = async (boardId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/tasks/${boardId}`, getConfig());
            setTasks(res.data);
        } catch (error) {
            addToast('Failed to load tasks', 'error');
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await axios.get('/api/tasks/summary/user', getConfig());
            return res.data;
        } catch (error) {
            console.error('Summary error', error);
            return { total: 0, todo: 0, inProgress: 0, completed: 0 };
        }
    };

    const createTask = async (taskData) => {
        try {
            const res = await axios.post('/api/tasks', taskData, getConfig());
            setTasks(prev => [...prev, res.data]);
            addToast('Task added!');
            return res.data;
        } catch (error) {
            addToast('Failed to add task', 'error');
            throw error;
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, taskData, getConfig());
            setTasks(prev => prev.map(t => t._id === taskId ? res.data : t));
            if (taskData.status) {
                // If only status changed (via drag/arrows), show minimal toast or none
            } else {
                addToast('Task updated');
            }
            return res.data;
        } catch (error) {
            addToast('Failed to update task', 'error');
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`, getConfig());
            setTasks(prev => prev.filter(t => t._id !== taskId));
            addToast('Task removed');
        } catch (error) {
            addToast('Failed to remove task', 'error');
            throw error;
        }
    };

    return (
        <TaskContext.Provider value={{
            boards, fetchBoards, createBoard, updateBoard, deleteBoard,
            tasks, fetchTasks, fetchSummary, createTask, updateTask, deleteTask,
            loading,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
