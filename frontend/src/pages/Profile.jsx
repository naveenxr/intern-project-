import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { BellRing, Camera, Upload, User, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/users/profile-picture', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            // Update auth context
            const updatedUser = { ...user, profilePicture: res.data.profilePicture };
            setUser(updatedUser);
            localStorage.setItem('smarttask_user', JSON.stringify(updatedUser));
            
            setSuccess('Profile picture updated successfully!');
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading image.');
        } finally {
            setLoading(false);
        }
    };

    const hasProfilePic = Boolean(user?.profilePicture);

    return (
        <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
            <header className="flex justify-between align-center flex-wrap gap-2" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <button className="btn-ghost" onClick={() => navigate('/dashboard')}
                        style={{ marginBottom: '0.75rem', padding: '0.4rem 0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Your Profile</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Manage your account settings and preferences.</p>
                </div>
            </header>

            {/* Alert / Alarm if no profile picture */}
            <AnimatePresence>
                {!hasProfilePic && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{ 
                            padding: '1.25rem 1.5rem', 
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--danger)',
                        }}
                    >
                        <motion.div 
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }} 
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                            style={{ background: 'transparent', padding: '0.75rem', borderRadius: '50%', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                        >
                            <BellRing size={24} />
                        </motion.div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.2rem' }}>Action Required</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You haven't uploaded a profile picture yet. Please upload one to personalize your workspace.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-4 flex-wrap" style={{ alignItems: 'flex-start' }}>
                {/* Profile Card */}
                <div className="card flex column align-center" style={{ flex: '1 1 300px', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-light)', borderRadius: '50%', filter: 'blur(40px)' }} />
                    
                    <div style={{ position: 'relative', marginBottom: '2rem' }}>
                        <div style={{ 
                            width: '140px', height: '140px', borderRadius: '50%', background: 'var(--bg-main)',
                            border: '4px solid var(--bg-card)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                            )}
                        </div>
                        <button 
                            className="btn-primary"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ 
                                position: 'absolute', bottom: '0', right: '0', borderRadius: '50%', 
                                width: '40px', height: '40px', padding: 0, boxShadow: 'var(--shadow-lg)'
                            }}
                            title="Choose Image"
                        >
                            <Camera size={18} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                        />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user?.email}</p>

                    <AnimatePresence>
                        {file && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ width: '100%', marginTop: '1.5rem' }}>
                                <button className="btn-primary" onClick={handleUpload} disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
                                    {loading ? 'Uploading...' : <><Upload size={18} /> Save Picture</>}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.85rem' }}>{error}</div>}
                    {success && <div style={{ color: 'var(--success)', marginTop: '1rem', fontSize: '0.85rem' }}>{success}</div>}
                </div>

                {/* Details Card */}
                <div className="card" style={{ flex: '2 1 400px', padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontStyle: 'italic' }}>
                        <BookOpen size={20} style={{ color: 'var(--primary)' }}/> Account Details
                    </h3>
                    
                    <div className="flex column gap-3">
                        <div className="flex column gap-1">
                            <label>Full Name</label>
                            <input type="text" value={user?.name || ''} readOnly disabled style={{ background: 'var(--bg-main)', opacity: 0.8 }} />
                        </div>
                        <div className="flex column gap-1">
                            <label>Email Address</label>
                            <input type="email" value={user?.email || ''} readOnly disabled style={{ background: 'var(--bg-main)', opacity: 0.8 }} />
                        </div>
                        <div className="flex column gap-1">
                            <label>Account Status</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span className="badge badge-completed" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
