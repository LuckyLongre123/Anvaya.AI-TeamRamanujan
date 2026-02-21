import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../apis/api.js';
import { useAuth } from '../components/providers/AuthProvider.jsx';
import { FiUser, FiMail, FiLock, FiBriefcase, FiFileText, FiZap, FiArrowRight } from 'react-icons/fi';

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: '',
    fullName: '',
    password: '',
    desc: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await createUser(form);
      const created = res?.data ?? null;
      if (created) {
        setUser(created);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6 relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />

      {/* --- SIGNUP CARD --- */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 p-10 animate-in fade-in zoom-in duration-500">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 mb-4">
            <FiZap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Workspace</h2>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Initialize your Logic Profile</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Top Row: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FiUser size={16} />
                </div>
                <input
                  name="fullName"
                  placeholder="Kush Kumar"
                  value={form.fullName}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FiMail size={16} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Middle Row: Password & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FiLock size={16} />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Role</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FiBriefcase size={16} />
                </div>
                <input
                  name="role"
                  placeholder="e.g. Project Lead"
                  value={form.role}
                  onChange={onChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bottom: Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Description</label>
            <div className="relative group">
              <div className="absolute top-3 left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <FiFileText size={16} />
              </div>
              <textarea
                name="desc"
                placeholder="Briefly describe your project goals..."
                value={form.desc}
                onChange={onChange}
                className="w-full pl-11 pr-4 py-3 h-24 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 group inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 disabled:opacity-60 active:scale-95"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            ) : (
              <>Initialize Profile <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log into workspace</Link>
        </p>
      </div>
    </div>
  );
}