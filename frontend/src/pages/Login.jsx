import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      sessionStorage.setItem('AUTH_USER', JSON.stringify({ role: data.role, info: data.student || data.lecturer || data.admin, token: data.token }));
      if (data.role === 'student') navigate('/student');
      else if (data.role === 'lecturer') navigate('/lecturer');
      else if (data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setForgotMessage(data.message || 'If an account exists with this email, a reset link has been sent.');
      setForgotEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotMessage('');
      }, 3000);
    } catch (err) {
      setForgotError(err.message || String(err));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071029] via-[#0b2540] to-[#10273f] p-6">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-[linear-gradient(135deg,#0f172a_0%,#12263f_100%)] text-white">
          <div className="text-3xl font-extrabold mb-4">Global Gate</div>
          <p className="text-sm text-slate-300 max-w-xs text-center">Welcome back — sign in to manage courses, lessons and enquiries. Fast, secure and simple.</p>
          <div className="mt-6 w-full flex items-center justify-center">
            <img src="/public/logo192.png" alt="logo" className="w-28 h-28 opacity-80" onError={(e)=>e.target.style.display='none'} />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Sign in to your account</h2>
          <p className="text-sm text-slate-300 mb-6">Enter your email or username and password to continue.</p>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-300 bg-red-900/30 p-3 rounded">{error}</div>}

            <div>
              <label className="block text-sm text-slate-300 mb-2">Email / Username</label>
              <div className="relative">
                <input
                  className="w-full pl-12 pr-3 py-3 rounded-lg bg-white/6 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  required
                />
                <div className="absolute left-3 top-3 text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full pl-12 pr-3 py-3 rounded-lg bg-white/6 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
                <div className="absolute left-3 top-3 text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zM6 20h12v-1a6 6 0 00-6-6 6 6 0 00-6 6v1z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" /> Remember me
              </label>
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>

            
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Reset Password</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                  setForgotError('');
                  setForgotMessage('');
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              {forgotError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {forgotError}
                </div>
              )}

              {forgotMessage && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  {forgotMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50 mt-6"
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                  setForgotError('');
                  setForgotMessage('');
                }}
                className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* End Forgot Password Modal */}

      {/* End main wrapper */}
    </div>
  );
}

