// src/pages/Admin/Inquiries.jsx
import React from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, MessageSquare, Phone, Mail, User, Edit3, Save, Filter, Trash2 } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all'); // 'all' | 'pending' | 'completed'

  React.useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/inquiries`, { headers });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (id, current) => {
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      // try to preserve any unsaved admin note in the editor when toggling status
      const inquiry = inquiries.find(i => i.id === id);
      let admin_comment = inquiry && inquiry.admin_comment ? inquiry.admin_comment : '';
      const textarea = document.getElementById(`admin-comment-${id}`);
      if (textarea && textarea.value !== undefined) admin_comment = textarea.value;

      const res = await fetch(`${BACKEND_URL}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ is_done: !current, admin_comment })
      });
      if (!res.ok) throw new Error('Update failed');
      fetchInquiries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const saveComment = async (id, comment) => {
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ admin_comment: comment })
      });
      if (!res.ok) throw new Error('Save failed');
      fetchInquiries();
    } catch (err) {
      alert('Failed to save comment');
    }
  };

  const deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/inquiries/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      fetchInquiries();
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries = React.useMemo(() => {
    if (filter === 'all') return inquiries;
    if (filter === 'pending') return inquiries.filter(i => !i.is_done);
    if (filter === 'completed') return inquiries.filter(i => i.is_done);
    return inquiries;
  }, [inquiries, filter]);

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => !i.is_done).length,
    completed: inquiries.filter(i => i.is_done).length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
        <div className="w-28 h-28 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <MessageSquare className="w-14 h-14 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No inquiries yet</h3>
        <p className="text-gray-600">When users contact you, their messages will appear here.</p>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contact Inquiries</h2>
          <p className="text-gray-600 mt-1">{inquiries.length} total messages</p>
        </div>

        <div className="flex bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-1.5">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="relative px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              {filter === f && <motion.div layoutId="inquiryFilter" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />}
              <span className={`relative z-10 flex items-center gap-2 ${filter === f ? 'text-white' : 'text-gray-600'}`}>
                {f === 'all' && <Filter className="w-4 h-4" />}
                {f === 'pending' && <Circle className="w-4 h-4" />}
                {f === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                <span className="capitalize">{f}</span>
                <span className={`text-xs font-semibold ${filter === f ? 'text-white/90' : 'text-gray-500'}`}> {counts[f]}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">No {filter === 'all' ? '' : filter} inquiries found</p>
          </div>
        ) : (
          filteredInquiries.map((inq, idx) => (
            <motion.div key={inq.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="bg-white/80 rounded-3xl shadow-md border border-white/30 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0 w-full lg:w-1/3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{inq.name}</div>
                        <div className="text-sm text-gray-600">{inq.email} • {inq.mobile}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <div><strong>Received:</strong> {new Date(inq.created_at || Date.now()).toLocaleString()}</div>
                      <div className="mt-2"><strong>Status:</strong> {inq.is_done ? 'Completed' : 'Pending'}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-700 mb-4">
                      <p className="whitespace-pre-line">{inq.message}</p>
                    </div>

                    <AdminCommentSection inquiry={inq} onSave={saveComment} />
                  </div>

                  <div className="flex-shrink-0 w-full lg:w-56 flex flex-col items-end gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={inq.is_done} onChange={() => toggleDone(inq.id, inq.is_done)} className="sr-only peer" />
                      <div className="w-14 h-8 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 transition-all z-0"></div>
                      <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all peer-checked:translate-x-6 z-10 shadow-md"></div>
                      <div className="absolute inset-0 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 z-0"></div>
                    </label>

                    <button onClick={() => deleteInquiry(inq.id)} className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:opacity-95">Delete</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function AdminCommentSection({ inquiry, onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [comment, setComment] = React.useState(inquiry.admin_comment || '');

  const handleSave = () => {
    onSave(inquiry.id, comment);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-blue-50/60 backdrop-blur border border-blue-200 rounded-2xl p-6">
        <textarea
          id={`admin-comment-${inquiry.id}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-5 py-4 bg-white/80 border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none"
          placeholder="Write your internal note or response plan..."
        />
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Note
          </button>
          <button
            onClick={() => {
              setComment(inquiry.admin_comment || '');
              setEditing(false);
            }}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/70 backdrop-blur border border-gray-200 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700 mb-2">Admin Note</p>
          {inquiry.admin_comment ? (
            <p className="text-gray-800 italic leading-relaxed">"{inquiry.admin_comment}"</p>
          ) : (
            <p className="text-gray-500 italic">No internal note added yet</p>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="ml-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}