import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import { Upload, X, Edit2, Trash2, Eye, Plus, Image as ImageIcon, BookOpen } from 'lucide-react';

export default function AddCourses() {
  const [tab, setTab] = React.useState('add');
  const [submitting, setSubmitting] = React.useState(false);
  const [filePreview, setFilePreview] = React.useState(null);
  const [savedPreview, setSavedPreview] = React.useState(null);

  const [form, setForm] = React.useState({ name: '', duration_value: '', duration_unit: 'months', description: '', fee: '', early_bird_price: '', is_free: false, is_seminar: false, meeting_link: '', start_date: '', end_date: '' });
  const [bannerFile, setBannerFile] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);

  const [courses, setCourses] = React.useState([]);
  const [loadingList, setLoadingList] = React.useState(false);
  const [viewCourse, setViewCourse] = React.useState(null);
  const [scheduleCourse, setScheduleCourse] = React.useState(null);
  const [scheduleLessons, setScheduleLessons] = React.useState([]);
  const [scheduleLoading, setScheduleLoading] = React.useState(false);
  const [lecturers, setLecturers] = React.useState([]);
  const [selectedLecturers, setSelectedLecturers] = React.useState([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const formatDate = (d) => {
    try { if (!d) return null; const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleDateString(); } catch(e){ return d; }
  };

  React.useEffect(() => {
    if (tab === 'list') fetchCourses();
    // always fetch lecturers so admin can assign them when creating/editing
    fetchLecturers();
  }, [tab, refreshKey]);

  const fetchLecturers = async () => {
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/lecturers`, { headers });
      const data = await res.json();
      setLecturers(Array.isArray(data) ? data : []);
    } catch (err) { setLecturers([]); }
  };

  const fetchCourses = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data.map(c => ({ ...c, is_free: !!Number(c.is_free), is_seminar: !!Number(c.is_seminar), meeting_link: c.meeting_link || null, early_bird_price: c.early_bird_price || '', start_date: c.start_date || null, end_date: c.end_date || null })) : []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBannerFile(null);
      setFilePreview(null);
      return;
    }
    setBannerFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ name: '', duration_value: '', duration_unit: 'months', description: '', fee: '', is_free: false, start_date: '', end_date: '' });
    setBannerFile(null);
    setFilePreview(null);
    setSavedPreview(null);
    setEditingId(null);
    setSelectedLecturers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('duration', `${form.duration_value || ''} ${form.duration_unit || ''}`.trim());
    fd.append('description', form.description);
    fd.append('fee', form.fee || 0);
    fd.append('is_free', form.is_free ? 1 : 0);
    fd.append('is_seminar', form.is_seminar ? 1 : 0);
    if (form.meeting_link) fd.append('meeting_link', form.meeting_link);
    if (form.early_bird_price) fd.append('early_bird_price', form.early_bird_price);
    if (form.start_date) fd.append('start_date', form.start_date);
    if (form.end_date) fd.append('end_date', form.end_date);
    // include assigned lecturers as JSON array of ids
    if (Array.isArray(selectedLecturers) && selectedLecturers.length) fd.append('lecturers', JSON.stringify(selectedLecturers));
    if (bannerFile) fd.append('banner', bannerFile);

    try {
      const url = editingId
        ? `${BACKEND_URL}/api/courses/${editingId}`
        : `${BACKEND_URL}/api/courses`;
      const method = editingId ? 'PUT' : 'POST';

      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(url, { method, headers, body: fd });
      const payload = await res.json();

      if (!res.ok) throw new Error(payload.error || 'Failed');

      alert(editingId ? 'Course updated successfully' : 'Course created!');
      if (payload.banner_path) setSavedPreview(`${BACKEND_URL}` + payload.banner_path);
      resetForm();
      setTab('list');
      setRefreshKey(k => k + 1);
    } catch (err) {
      alert('Error: ' + (err && err.message ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (c) => {
    // parse duration into number + unit if possible (e.g. "6 months")
    let val = '';
    let unit = 'months';
    try {
      const m = String(c.duration || '').trim().match(/^\s*(\d+)\s*(\w+)?/);
      if (m) { val = m[1]; if (m[2]) unit = m[2]; }
    } catch (e) { /* ignore */ }
    setForm({
      name: c.name || '',
      duration_value: val,
      duration_unit: unit,
      description: c.description || '',
      fee: c.fee || '',
      is_free: Number(c.is_free) === 1 || c.is_free === true,
      is_seminar: Number(c.is_seminar) === 1 || c.is_seminar === true,
      meeting_link: c.meeting_link || '',
      early_bird_price: c.early_bird_price || '',
      start_date: c.start_date ? (String(c.start_date).slice(0,10)) : '',
      end_date: c.end_date ? (String(c.end_date).slice(0,10)) : ''
    });
    setSavedPreview(c.banner_path ? `${BACKEND_URL}` + c.banner_path : null);
    setBannerFile(null);
    setFilePreview(null);
    setEditingId(c.id || c._id);
    // set selected lecturers (lecturers state should be loaded)
    try {
      const assigned = (lecturers || []).filter(l => Array.isArray(l.courses) && l.courses.map(String).includes(String(c.id || c._id)));
      setSelectedLecturers(assigned.map(a => String(a.id || a._id || a)));
    } catch (e) { setSelectedLecturers([]); }
    setTab('add');
  };

  const handleDelete = async (c) => {
    if (!confirm('Delete this course permanently?')) return;
    try {
      const id = c.id || c._id;
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      await fetch(`${BACKEND_URL}/api/courses/${id}`, { method: 'DELETE', headers });
      setCourses(prev => prev.filter(x => (x.id || x._id) !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Fetch lessons for a course (used by admin view schedule)
  const fetchCourseLessons = async (courseId) => {
    setScheduleLoading(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/lessons/course/${courseId}`, { headers });
      const data = await res.json();
      setScheduleLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setScheduleLessons([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/lessons/${lessonId}`, { method: 'DELETE', headers });
      if (!r.ok) throw new Error('Delete failed');
      // refresh
      if (scheduleCourse) fetchCourseLessons(scheduleCourse.id || scheduleCourse._id);
    } catch (err) { alert('Delete failed: ' + (err.message || err)); }
  };

  const handleEditLesson = async (lesson) => {
    const newTopic = window.prompt('Topic', lesson.topic || '');
    if (newTopic === null) return;
    const newStart = window.prompt('Start (YYYY-MM-DDTHH:MM)', lesson.start_time ? new Date(lesson.start_time).toISOString().slice(0,16) : '');
    if (newStart === null) return;
    const newEnd = window.prompt('End (YYYY-MM-DDTHH:MM)', lesson.end_time ? new Date(lesson.end_time).toISOString().slice(0,16) : '');
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const r = await fetch(`${BACKEND_URL}/api/lessons/${lesson.id}`, { method: 'PUT', headers, body: JSON.stringify({ topic: newTopic, start_time: newStart, end_time: newEnd, course_id: lesson.course_id }) });
      if (!r.ok) throw new Error('Update failed');
      if (scheduleCourse) fetchCourseLessons(scheduleCourse.id || scheduleCourse._id);
    } catch (err) { alert('Update failed: ' + (err.message || err)); }
  };

  return (
    <>
      {/* Elegant Tab Switcher */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl shadow-inner">
          {['add', 'list'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                tab === t
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="courseTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t === 'add' ? <Plus className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {t === 'add' ? 'Add New Course' : 'All Courses'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {tab === 'add' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-8xl mx-auto"
        >
          <div className="bg-white p-6 lg:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              {editingId ? 'Edit Course' : 'Create New Course'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Course Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g. Full Stack Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Duration</label>
                  <div className="flex gap-2">
                    <input
                      value={form.duration_value}
                      onChange={e => setForm(f => ({ ...f, duration_value: e.target.value.replace(/[^0-9]/g, '') }))}
                      required
                      type="number"
                      min={1}
                      className="w-1/2 px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="e.g. 6"
                    />
                    <select value={form.duration_unit} onChange={e => setForm(f => ({ ...f, duration_unit: e.target.value }))} className="w-1/2 px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl">
                      <option value="months">Months</option>
                      <option value="weeks">Weeks</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Fee (LKR)</label>
                  <input
                    value={form.fee}
                    onChange={e => setForm(f => ({ ...f, fee: e.target.value }))}
                    type="number"
                    step="0.01"
                    disabled={!!form.is_free}
                    className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                    placeholder="e.g. 35000"
                  />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <label className="inline-flex items-center text-sm">
                    <input type="checkbox" checked={!!form.is_free} onChange={e => setForm(f => ({ ...f, is_free: e.target.checked, fee: e.target.checked ? '0.00' : f.fee }))} className="mr-2" />
                    Free course (no payment required)
                  </label>
                </div>
                {!form.is_free && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Early Bird Offer Price (LKR) - Optional</label>
                    <input
                      value={form.early_bird_price}
                      onChange={e => setForm(f => ({ ...f, early_bird_price: e.target.value }))}
                      type="number"
                      step="0.01"
                      className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="e.g. 25000 (if less than normal fee)"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <label className="inline-flex items-center text-sm">
                    <input type="checkbox" checked={!!form.is_seminar} onChange={e => setForm(f => ({ ...f, is_seminar: e.target.checked }))} className="mr-2" />
                    Seminar (Direct join - users can open meeting link without registering)
                  </label>
                </div>
                {form.is_seminar && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link (e.g. Zoom/Google Meet)</label>
                    <input
                      value={form.meeting_link}
                      onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Describe the course content, benefits, and outcomes..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date || ''}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                    className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">End Date</label>
                  <input
                    type="date"
                    value={form.end_date || ''}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                    className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Selected Lecturer Chips */}
              {selectedLecturers && selectedLecturers.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Lecturers</label>
                  <div className="flex items-center flex-wrap gap-3">
                    {selectedLecturers.map(id => {
                      const lec = (lecturers || []).find(l => String(l.id || l._id) === String(id));
                      return (
                        <div key={id} className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {lec && lec.photo_path ? (
                              <img src={`${BACKEND_URL}${lec.photo_path}`} alt={lec.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-sm text-gray-400">{(lec && lec.name ? lec.name.charAt(0) : '?')}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">{lec ? lec.name : id}</div>
                          <button type="button" onClick={() => setSelectedLecturers(prev => prev.filter(x => String(x) !== String(id)))} className="p-1 rounded-full hover:bg-gray-100">
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Assigned Lecturers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Assign Lecturers</label>
                <div className="flex flex-wrap gap-2">
                  {(lecturers || []).map(l => {
                    const id = String(l.id || l._id || l);
                    const selected = selectedLecturers.map(String).includes(id);
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setSelectedLecturers(prev => prev.map(String).includes(id) ? prev.filter(x => String(x) !== id) : [...prev, id])}
                        className={`text-sm px-3 py-1 rounded-full border transition ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {l.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Course Banner</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all bg-white/30">
                    {filePreview || savedPreview ? (
                      <img
                        src={filePreview || savedPreview}
                        alt="Banner preview"
                        className="mx-auto max-h-40 rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-600">Drop an image here or click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 1200x600px</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
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

      {/* Courses List - Card Grid */}
      {tab === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loadingList ? (
            <p className="col-span-full text-center text-gray-500 py-12">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">No courses yet</p>
              <p className="text-gray-500 mt-2">Create your first course to get started</p>
            </div>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course.id || course._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                {course.banner_path ? (
                  <img
                    src={`${BACKEND_URL}${course.banner_path}`}
                    alt={course.name}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-blue-400 opacity-50" />
                  </div>
                )}

                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{course.duration}</p>
                  {(course.start_date || course.end_date) && (
                    <p className="text-sm text-gray-500 mb-3">
                      {course.start_date && <span>Starts: {formatDate(course.start_date)}</span>}
                      {course.start_date && course.end_date && <span className="mx-2">•</span>}
                      {course.end_date && <span>Ends: {formatDate(course.end_date)}</span>}
                    </p>
                  )}
                  {course.is_free ? (
                    <p className="text-sm text-green-600 font-semibold mb-3">Free Course</p>
                  ) : (
                    course.fee !== undefined && <p className="text-sm text-blue-600 font-semibold mb-3">Fee: LKR {course.fee}</p>
                  )}
                  <p className="text-gray-700 line-clamp-2 text-sm">{course.description}</p>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Lecturers</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {(() => {
                        const assigned = (lecturers || []).filter(l => Array.isArray(l.courses) && l.courses.map(String).includes(String(course.id || course._id)));
                        if (assigned.length === 0) return <span className="text-xs text-gray-400">—</span>;
                        return assigned.slice(0,2).map(a => (
                          <div key={a.id} className="flex items-center gap-2 bg-white/50 px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {a.photo_path ? (
                                <img src={`${BACKEND_URL}${a.photo_path}`} alt={a.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{a.name ? a.name.charAt(0) : '?'}</div>
                              )}
                            </div>
                            <div className="text-xs font-medium text-slate-700">{a.name}</div>
                          </div>
                        ));
                      })()}
                      {(() => {
                        const assigned = (lecturers || []).filter(l => Array.isArray(l.courses) && l.courses.map(String).includes(String(course.id || course._id)));
                        return assigned.length > 2 ? <span className="text-xs text-gray-500">+{assigned.length - 2} more</span> : null;
                      })()}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div />
                    <button onClick={() => { setScheduleCourse(course); fetchCourseLessons(course.id || course._id); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow hover:shadow-md">View Schedule</button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button
                    onClick={() => setViewCourse(course)}
                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-yellow-50"
                  >
                    <Edit2 className="w-4 h-4 text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* View Modal */}
      {viewCourse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 h-auto"
          onClick={() => setViewCourse(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {viewCourse.banner_path && (
              <img
                src={`${BACKEND_URL}${viewCourse.banner_path}`}
                alt={viewCourse.name}
                className="w-full h-80 object-cover"
              />
            )}
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{viewCourse.name}</h2>
                  <p className="text-lg text-blue-600 mt-2">{viewCourse.duration}</p>
                </div>
                <button
                  onClick={() => setViewCourse(null)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{viewCourse.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Schedule Modal */}
      {scheduleCourse && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 h-auto" onClick={() => setScheduleCourse(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Schedule for: {scheduleCourse.name}</h3>
                <button onClick={() => setScheduleCourse(null)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
              </div>

              {scheduleLoading ? (
                <p className="text-gray-500">Loading lessons...</p>
              ) : scheduleLessons.length === 0 ? (
                <p className="text-gray-500">No lessons scheduled for this course.</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecturer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {scheduleLessons.map(ls => (
                        <tr key={ls.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{ls.topic || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{(() => {
                            const lec = (lecturers || []).find(x => String(x.id) === String(ls.lecturer_id) || String(x.id) === String(ls.lecturer));
                            return lec ? lec.name : (ls.lecturer_name || ls.lecturer || '—');
                          })()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ls.start_time ? new Date(ls.start_time).toLocaleString() : '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ls.end_time ? new Date(ls.end_time).toLocaleString() : '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button onClick={() => alert(`Topic: ${ls.topic}\nLecturer: ${ls.lecturer_name || ls.lecturer}\nStart: ${ls.start_time}\nEnd: ${ls.end_time}`)} className="p-2 bg-white border rounded-full hover:bg-blue-50 transition"> <Eye className="w-4 h-4 text-gray-700"/> </button>
                              <button onClick={() => handleEditLesson(ls)} className="p-2 bg-white border rounded-full hover:bg-yellow-50 transition"> <Edit2 className="w-4 h-4 text-yellow-600"/> </button>
                              <button onClick={() => handleDeleteLesson(ls.id)} className="p-2 bg-white border rounded-full hover:bg-red-50 transition"> <Trash2 className="w-4 h-4 text-red-600"/> </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}