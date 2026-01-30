import React from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import { User, Lock, Check, X, Mail } from 'lucide-react';

export default function AddAdmin() {
  const [tab, setTab] = React.useState('add');
  const [form, setForm] = React.useState({ name: '', email: '', password: '', role: 'Staff' });
  const [editingId, setEditingId] = React.useState(null);
  const [admins, setAdmins] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => { if (tab === 'list') fetchAdmins(); }, [tab]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/admins`, { headers });
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (e) { setAdmins([]); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      setMessage('Please fill in all required fields');
      return;
    }
    if (!editingId && (!form.email || !form.password)) {
      setMessage('Email and password are required for new admins');
      return;
    }
    if (editingId && !form.email) {
      setMessage('Email is required');
      return;
    }
    setSubmitting(true);
    try {
      const url = editingId ? `${BACKEND_URL}/api/admins/${editingId}` : `${BACKEND_URL}/api/admins`;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { name: form.name, role: form.role } : form;
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify(body) });
      const p = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(p.error || 'Save failed');
      setMessage(editingId ? 'Admin updated successfully' : 'Admin created successfully! Credentials sent to email');
      setForm({ name: '', email: '', password: '', role: 'Staff' });
      setEditingId(null);
      setTimeout(() => {
        setTab('list');
        setMessage('');
      }, 2000);
    } catch (err) { 
      setMessage('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({ name: a.name || '', email: a.email || '', password: '', role: a.role || 'Staff' });
    setTab('add');
  };

  const handleToggleActive = async (a) => {
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/admins/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify({ is_active: a.is_active ? 0 : 1, name: a.name, role: a.role }) });
      if (!res.ok) throw new Error('Failed');
      fetchAdmins();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleDelete = async (a) => {
    if (!confirm('Delete this admin?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/admins/${a.id}`, { method: 'DELETE', headers: { ...authHeader } });
      if (!r.ok) throw new Error('Delete failed');
      fetchAdmins();
    } catch (err) { alert('Error: ' + err.message); }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl shadow-inner">
          {['add','list'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`relative px-6 py-2 rounded-xl font-medium ${tab===t?'text-white':''}`}>
              {tab===t && <motion.div layoutId="adminTab" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl" />}
              <span className={`relative z-10 flex items-center gap-2 ${tab===t? 'text-white':'text-gray-700'}`}>{t==='add' ? 'Add Admin' : 'All Admins'}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-xl max-w-2xl mx-auto">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {message.includes('Error') ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              {message}
            </motion.div>
          )}
          
          <h3 className="text-xl font-semibold mb-6">{editingId ? 'Edit Admin' : 'Create New Admin'}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name *</label>
              <input 
                required 
                value={form.name} 
                onChange={e => setForm(f=>({...f,name:e.target.value}))} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Email *</label>
              <input 
                required={!editingId} 
                type="email" 
                value={form.email} 
                onChange={e => setForm(f=>({...f,email:e.target.value}))} 
                disabled={editingId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="admin@globalgate.edu"
              />
            </div>
            
            {!editingId && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Password *</label>
                <input 
                  required 
                  type="password" 
                  value={form.password} 
                  onChange={e=>setForm(f=>({...f,password:e.target.value}))} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter strong password"
                />
                <p className="text-xs text-gray-500 mt-1">Password will be sent to the admin's email along with their username</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Role *</label>
              <select 
                value={form.role} 
                onChange={e=>setForm(f=>({...f,role:e.target.value}))} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Super Admin">Super Admin - Full access to all features</option>
                <option value="Admin">Admin - Can manage courses, lecturers, and students</option>
                <option value="Staff">Staff - Limited access to view data</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-6">
              <button 
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {submitting ? 'Processing...' : (editingId ? 'Update Admin' : 'Create Admin')}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', email: '', password: '', role: 'Staff' });
                    setMessage('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {tab === 'list' && (
        <div>
          {loading ? <p>Loading admins...</p> : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {admins.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{a.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => handleEdit(a)} className="p-2 bg-white border rounded-full hover:bg-yellow-50"> <Check className="w-4 h-4 text-yellow-600"/> </button>
                          <button onClick={() => handleToggleActive(a)} className="p-2 bg-white border rounded-full hover:bg-blue-50"> {a.is_active ? 'Deactivate' : 'Activate'} </button>
                          <button onClick={() => handleDelete(a)} className="p-2 bg-white border rounded-full hover:bg-red-50"> <X className="w-4 h-4 text-red-600"/> </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
