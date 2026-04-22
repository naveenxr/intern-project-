import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Layout, Mail, Lock, User, ArrowRight, CheckCircle2, Rocket, Heart, Key, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/send-otp', { email });
            setStep(2);
            if (res.data.code) {
                alert(`[DEV MODE] Your OTP is: ${res.data.code}\n\n(This is shown because you are using dummy email credentials in the backend)`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Could not send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Updated register function call to include OTP code
            const res = await axios.post('/api/auth/register', { name, email, password, code: otpCode });
            
            // Immediately save token and simulate auth context login (or redirect to login)
            // Since our AuthContext expects (name, email, password), we have to handle the response here directly if we changed the endpoint.
            // Let's actually use the context register if we can, but we need to pass code.
            // Since AuthContext doesn't take code yet, we handle it here:
            localStorage.setItem('smarttask_user', JSON.stringify(res.data));
            window.location.href = '/dashboard'; // Force full reload to update context
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP or registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        // Redirect to backend Google Auth route
        window.location.href = import.meta.env.PROD ? '/api/auth/google' : 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="flex align-center justify-center" style={{ 
            minHeight: '100vh', 
            background: 'radial-gradient(circle at bottom left, #a855f7, #6366f1, #4f46e5)',
            padding: '1.5rem',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '10%', right: '5%', width: '35%', height: '35%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '25%', height: '25%', background: 'rgba(168,85,247,0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex"
                style={{ 
                    width: '100%', 
                    maxWidth: '900px', 
                    borderRadius: '24px', 
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    background: 'var(--bg-card)',
                    zIndex: 1,
                    flexDirection: 'row-reverse'
                }}
            >
                <div className="flex column justify-center" style={{ 
                    flex: 1.2, 
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                    padding: '3rem',
                    color: 'white',
                    display: window.innerWidth < 768 ? 'none' : 'flex'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <Layout size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>Join Thousands of Productive Users.</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6 }}>Start organizing your life and projects with the most intuitive task manager on the market.</p>
                        
                        <div className="flex column gap-3">
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><CheckCircle2 size={20} /></div>
                                <span>Secure OTP Registration</span>
                            </div>
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><Rocket size={20} /></div>
                                <span>Advanced Kanban Workflow</span>
                            </div>
                            <div className="flex align-center gap-2">
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px' }}><Globe size={20} /></div>
                                <span>Sign In with Google</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex column" style={{ flex: 1, padding: '3rem' }}>
                    <div className="flex column align-center" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <div style={{ display: window.innerWidth < 768 ? 'block' : 'none', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
                            <Layout size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Start your journey today</p>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleGoogleAuth}
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
                        Sign up with Google
                    </button>

                    <div className="flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Or with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOtp} 
                                className="flex column gap-3"
                            >
                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ 
                                                color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center',
                                                background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '10px',
                                                borderLeft: '4px solid var(--danger)', marginBottom: '0.5rem'
                                            }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div className="flex column gap-1">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '44px', height: '48px' }} required />
                                    </div>
                                </div>

                                <div className="flex column gap-1">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '44px', height: '48px' }} required />
                                    </div>
                                </div>

                                <div className="flex column gap-1">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '44px', height: '48px' }} required minLength={6} />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem', fontWeight: 700, height: '52px' }} disabled={isLoading}>
                                    {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRegister} 
                                className="flex column gap-3"
                            >
                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ 
                                                color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center',
                                                background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '10px',
                                                borderLeft: '4px solid var(--danger)', marginBottom: '0.5rem'
                                            }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                        We sent a 6-digit code to <strong>{email}</strong>
                                    </p>
                                </div>

                                <div className="flex column gap-1">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Verification Code</label>
                                    <div style={{ position: 'relative' }}>
                                        <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit code" 
                                            value={otpCode} 
                                            onChange={(e) => setOtpCode(e.target.value)} 
                                            style={{ paddingLeft: '44px', height: '48px', letterSpacing: '2px', fontSize: '1.1rem' }}
                                            required 
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                                    <button type="button" className="btn-ghost" style={{ flex: 1, padding: '1rem', height: '52px' }} onClick={() => setStep(1)}>
                                        Back
                                    </button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1rem', fontSize: '1rem', fontWeight: 700, height: '52px' }} disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Complete Registration'}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
