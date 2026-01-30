// src/pages/Admin/AddLecturer.tsx  (or .jsx — see note at bottom)
import React from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import {
  Upload, X, Edit2, Trash2, Eye, Plus, User, Mail, Phone, BookOpen
} from 'lucide-react';

export default function AddLecturer() {
  const [tab, setTab] = React.useState('add');
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });
  const [photoFile, setPhotoFile] = React.useState(null);
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);

  const [coursesOptions, setCoursesOptions] = React.useState([]);
  const [selectedCourses, setSelectedCourses] = React.useState([]);
  const [sortBy, setSortBy] = React.useState('new');
  const [courseFilter, setCourseFilter] = React.useState('all');

    const [lecturers, setLecturers] = React.useState([]);
    const [loadingList, setLoadingList] = React.useState(false);
    const [viewLecturer, setViewLecturer] = React.useState(null);

  React.useEffect(() => { fetchCoursesOptions(); }, []);
  React.useEffect(() => { if (tab === 'list') fetchLecturers(); }, [tab]);

  const fetchCoursesOptions = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/courses`);
      const data = await res.json();
      setCoursesOptions(Array.isArray(data) ? data : []);
    } catch (e) { setCoursesOptions([]); }
  };

  const fetchLecturers = async () => {
    setLoadingList(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/lecturers`, { headers });
      const data = await res.json();
      setLecturers(Array.isArray(data) ? data : []);
    } catch (e) { setLecturers([]); }
    finally { setLoadingList(false); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoFile(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditingId(null);
    setSelectedCourses([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('courses', JSON.stringify(selectedCourses));
    if (photoFile) fd.append('photo', photoFile);

    try {
      const url = editingId
        ? `${BACKEND_URL}/api/lecturers/${editingId}`
        : `${BACKEND_URL}/api/lecturers`;
      const method = editingId ? 'PUT' : 'POST';

      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};

      const res = await fetch(url, { method, headers: { ...authHeader }, body: fd });
      const payload = await res.json().catch(() => ({}));
      console.debug('Create lecturer response payload:', payload);
      if (!res.ok) throw new Error(payload.error || 'Save failed');

      if (editingId) alert('Lecturer updated');
      else {
        if (payload.notified) alert('Lecturer created — login credentials emailed to lecturer');
        else if (payload.credentials) alert(`Lecturer created — credentials:\nUsername: ${payload.credentials.username}\nPassword: ${payload.credentials.password}`);
        else alert('Lecturer created — credentials were not emailed; check server logs or lecturer_auth table for generated credentials');
      }
      resetForm();
      setTab('list');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (l) => {
    setForm({ name: l.name || '', email: l.email || '', phone: l.phone || '' });
    setEditingId(l.id);
    setPhotoPreview(l.photo_path ? `${BACKEND_URL}` + l.photo_path : null);
    setSelectedCourses(Array.isArray(l.courses) ? l.courses.map(c => String(c.id || c)) : []);
    setTab('add');
  };

  const handleDelete = async (l) => {
    if (!confirm('Delete this lecturer permanently?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      await fetch(`${BACKEND_URL}/api/lecturers/${l.id}`, { method: 'DELETE', headers });
      setLecturers(prev => prev.filter(x => x.id !== l.id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getCourseName = (id) => {
    const course = coursesOptions.find(c => (c.id || c._id) === id);
    return course ? course.name : id;
  };

  const displayedLecturers = React.useMemo(() => {
    let list = Array.isArray(lecturers) ? [...lecturers] : [];
    if (courseFilter && courseFilter !== 'all') {
      list = list.filter(l => (l.courses || []).map(String).includes(courseFilter));
    }
    if (sortBy === 'new') list.sort((a, b) => (b.id || 0) - (a.id || 0));
    else if (sortBy === 'old') list.sort((a, b) => (a.id || 0) - (b.id || 0));
    else if (sortBy === 'az') list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    else if (sortBy === 'za') list.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
    return list;
  }, [lecturers, sortBy, courseFilter, coursesOptions]);

  return (
    <>
      {/* Premium Tab Switcher */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl shadow-inner">
          {['add', 'list'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-8 py-3 rounded-xl font-medium transition-all duration-300"
            >
              {tab === t && (
                <motion.div
                  layoutId="lecturerTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${tab === t ? 'text-white' : 'text-gray-600'}`}>
                {t === 'add' ? <Plus className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {t === 'add' ? 'Add Lecturer' : 'All Lecturers'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Form */}
      {tab === 'add' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-8xl mx-auto">
          <div className="bg-white p-6 lg:p-8 max-h-[calc(100vh-6rem)] overflow-y-auto">
           

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Photo Upload */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-14 h-14 text-blue-400 opacity-50" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              {/* Assigned Courses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Assigned Courses
                </label>
                <div className="flex flex-wrap gap-2">
                  {coursesOptions.map(c => {
                    const id = String(c.id || c._id);
                    const isSelected = selectedCourses.map(String).includes(id);
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setSelectedCourses(prev => prev.map(String).includes(id) ? prev.filter(x => String(x) !== id) : [...prev, id])}
                        className={`text-sm px-3 py-1 rounded-full border transition ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all"
                >
                  {editingId ? 'Update Lecturer' : 'Create Lecturer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Lecturers Table */}
      {/* Lecturers Table */}
      {tab === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="text-sm text-gray-600">Showing {lecturers.length} lecturers</div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Sort</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-md border bg-white text-sm">
                <option value="new">New → Old</option>
                <option value="old">Old → New</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>

              <label className="text-xs text-gray-500 ml-3">Course</label>
              <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="px-3 py-2 rounded-md border bg-white text-sm">
                <option value="all">All</option>
                {coursesOptions.map(c => (
                  <option key={c.id || c._id} value={String(c.id || c._id)}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingList ? (
            <p className="text-center py-12 text-gray-500">Loading lecturers...</p>
          ) : displayedLecturers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600">No lecturers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecturer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {displayedLecturers.map((lecturer) => (
                    <tr key={lecturer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {lecturer.photo_path ? (
                            <img src={`${BACKEND_URL}${lecturer.photo_path}`} alt={lecturer.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{lecturer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lecturer.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lecturer.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {(lecturer.courses || []).slice(0, 3).map(id => (
                            <span key={id} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{getCourseName(id)}</span>
                          ))}
                          {(lecturer.courses || []).length > 3 && <span className="text-xs text-gray-500">+{(lecturer.courses || []).length - 3} more</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => setViewLecturer(lecturer)} className="p-2 bg-white border rounded-full hover:bg-blue-50 hover:scale-105 transition transform cursor-pointer" title="View">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button onClick={() => handleEdit(lecturer)} className="p-2 bg-white border rounded-full hover:bg-yellow-50 hover:scale-105 transition transform cursor-pointer" title="Edit">
                            <Edit2 className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button onClick={() => handleDelete(lecturer)} className="p-2 bg-white border rounded-full hover:bg-red-50 hover:scale-105 transition transform cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* View Modal */}
      {viewLecturer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewLecturer(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              {viewLecturer.photo_path ? (
                <img src={`${BACKEND_URL}${viewLecturer.photo_path}`} alt={viewLecturer.name} className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <User className="w-32 h-32 text-blue-400 opacity-50" />
                </div>
              )}
              <button
                onClick={() => setViewLecturer(null)}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{viewLecturer.name}</h2>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-3"><Mail className="w-5 h-5" /> {viewLecturer.email}</p>
                {viewLecturer.phone && <p className="flex items-center gap-3"><Phone className="w-5 h-5" /> {viewLecturer.phone}</p>}
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-3">Teaching Courses</h4>
                <div className="flex flex-wrap gap-2">
                  {(viewLecturer.courses || []).map(id => (
                    <span key={id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {getCourseName(id)}
                    </span>
                  ))}
                </div>
                {(viewLecturer.courses || []).length === 0 && (
                  <p className="text-gray-500 italic">No courses assigned yet</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}