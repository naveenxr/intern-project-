import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, Mail, Lock, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex align-center justify-center" style={{ 
            minHeight: '100vh', 
            background: 'radial-gradient(circle at top right, #6366f1, #4f46e5, #3730a3)',
            padding: '1.5rem',
            overflow: 'hidden'
        }}>
            {/* Background decorative elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '30%', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex"
                style={{ 
                    width: '100%', 
                    maxWidth: '900px', 
                    borderRadius: '24px', 
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    background: 'var(--bg-card)',
                    zIndex: 1
                }}
            >
                {/* Left Side: Illustration/Text (Hidden on small screens) */}
                <div className="flex column justify-center" style={{ 
                    flex: 1.2, 
                    background: 'linear-gradient(135deg, #4f46e5, #6366f1)', 
                    padding: '3rem',
                    color: 'white',
                    display: window.innerWidth < 768 ? 'none' : 'flex'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <Layout size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Master Your Workflow with SmartTask.</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6 }}>The next generation task management system designed for high-performance teams and individuals.</p>
                        
                        <div className="flex column gap-3">
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><ShieldCheck size={20} /></div>
                                <span>Secure & Private Infrastructure</span>
                            </div>
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><Zap size={20} /></div>
                                <span>Real-time Sync Across Devices</span>
                            </div>
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><Globe size={20} /></div>
                                <span>Built for Global Teams</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Form */}
                <div className="flex column" style={{ flex: 1, padding: '3.5rem 3rem' }}>
                    <div className="flex column align-center" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <div style={{ display: window.innerWidth < 768 ? 'block' : 'none', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
                            <Layout size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Enter your credentials to access your workspace</p>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => window.location.href = import.meta.env.PROD ? '/api/auth/google' : 'http://localhost:5000/api/auth/google'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Sign in with Google
                    </button>

                    <div className="flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Or with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex column gap-4">
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ 
                                        color: 'var(--danger)', 
                                        fontSize: '0.85rem', 
                                        textAlign: 'center',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        borderLeft: '4px solid var(--danger)'
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="flex column gap-1">
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    style={{ paddingLeft: '44px', height: '50px' }}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="flex column gap-1">
                            <div className="flex justify-between align-center">
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    style={{ paddingLeft: '44px', height: '50px' }}
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ 
                                padding: '1rem', 
                                marginTop: '1rem', 
                                fontSize: '1rem',
                                fontWeight: 700,
                                height: '54px'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
