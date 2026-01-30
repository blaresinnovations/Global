import React, { useState } from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { Home, BookOpen, User, Edit3, LogOut, Trash2, Play, Eye, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import assets from '../../assets/images/images';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: Home },
  { key: 'lectures', label: 'My Lectures', Icon: BookOpen },
  { key: 'schedule', label: 'Schedule Lesson', Icon: Edit3 },
  { key: 'courses', label: 'My Courses', Icon: User },
];

export default function LecturerPanel() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem('lecturer') || 'null'));
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [lecturer, setLecturer] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [allCourses, setAllCourses] = React.useState([]);
  const [selectedCourseId, setSelectedCourseId] = React.useState(null);
  const [lessons, setLessons] = React.useState([]);
  const [chartData, setChartData] = React.useState(null);
  const [chartLoading, setChartLoading] = React.useState(true);
  const [form, setForm] = React.useState({ course_id: '', topic: '', start_time: '', end_time: '', meeting_link: '' });
  const [viewCourse, setViewCourse] = React.useState(null);

  const activeLabel = navItems.find(n => n.key === active)?.label || 'Dashboard';

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const p = await res.json();
      if (!res.ok) throw new Error(p.error || 'Login failed');
      // store token + role in the same shape as the main Login page so other components can read it
      sessionStorage.setItem('AUTH_USER', JSON.stringify({ role: p.role, info: p.lecturer || p.admin || p.student || null, token: p.token }));
      setUser(p.lecturer || p.admin || p.student || null);
    } catch (err) { alert('Login error: ' + err.message); }
  };

  React.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/lecturers`);
        const all = await res.json();
        const me = all.find(x => x.id === user.id || x.email === user.email);
        setLecturer(me || user);
        setCourses(me?.courses || []);
      } catch (e) { setLecturer(user); }
      fetchLessons();
      // fetch full course list to map ids -> names
      try {
        const cres = await fetch(`${BACKEND_URL}/api/courses`);
        const cdata = await cres.json();
        setAllCourses(Array.isArray(cdata) ? cdata : []);
      } catch (err) { setAllCourses([]); }
    })();
  }, [user]);

  const fetchLessons = async () => {
    if (!user) return;
    try {
      const lecturerId = lecturer?.id || user.id;
      const res = await fetch(`${BACKEND_URL}/api/lecturers/${lecturerId}/lessons`);
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (e) { setLessons([]); }
  };

  function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  React.useEffect(() => {
    setChartLoading(true);
    try {
      const today = new Date();
      const labels = [];
      const map = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = formatDate(d);
        labels.push(key);
        map[key] = 0;
      }

      lessons.forEach(ls => {
        const created = ls.start_time ? new Date(ls.start_time) : null;
        if (!created || Number.isNaN(created.getTime())) return;
        const key = formatDate(created);
        if (map.hasOwnProperty(key)) map[key]++;
      });

      const data = {
        labels: labels.map(l => l.replace(/^[0-9]{4}-/, '')),
        datasets: [
          {
            label: 'Lessons (last 30 days)',
            data: labels.map(l => map[l] || 0),
            fill: true,
            backgroundColor: 'rgba(59,130,246,0.12)',
            borderColor: 'rgba(59,130,246,0.9)',
            tension: 0.35,
            pointRadius: 2
          }
        ]
      };

      setChartData(data);
    } catch (e) {
      console.error(e);
      setChartData(null);
    }
    setChartLoading(false);
  }, [lessons]);

  const submitLesson = async (e) => {
    e.preventDefault();
    try {
      if (!lecturer || !lecturer.id) {
        alert('Lecturer information not loaded. Please refresh the page.');
        return;
      }
      const res = await fetch(`${BACKEND_URL}/api/lecturers/${lecturer.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const p = await res.json();
      if (!res.ok) throw new Error(p.error || 'Create failed');
      alert('Lesson scheduled');
      setForm({ course_id: '', topic: '', start_time: '', end_time: '', meeting_link: '' });
      fetchLessons();
      setActive('lectures');
    } catch (err) { alert('Error: ' + err.message); }
  };

  const logout = () => { localStorage.removeItem('lecturer'); setUser(null); setLecturer(null); setLessons([]); };

  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white/80 p-8 rounded-2xl shadow">
          <h3 className="text-xl font-bold mb-4">Lecturer Login</h3>
          <form onSubmit={login} className="space-y-4">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded" />
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 md:w-80 bg-white/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/20 shadow-2xl flex flex-col md:sticky md:top-0 h-auto md:h-screen overflow-hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-8 pb-0 border-b border-gray-100/50">
          <div className="flex items-center gap-4">
            <div className="w-15 h-15 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <img src={assets.logo2} alt="Global Gate" className="w-15 h-15 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Global Gate</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Lecturer Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden p-2 rounded bg-white/50 hover:bg-white/70">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8">
          <div className="space-y-2">
            {navItems.map(({ key, label, Icon }) => {
              const isActive = active === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActive(key)}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span className="font-medium tracking-wide">{label}</span>
                  {isActive && (
                    <motion.div layoutId="activeIndicator" className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100/50">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">L</div>
            <div>
              <p className="font-semibold text-gray-800">{user.name || 'Lecturer'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-red-500 transition-colors" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-5 max-w-8xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded bg-white/80 shadow">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{activeLabel}</h2>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white overflow-hidden">
            <div className="p-5 lg:p-12">
              {active === 'dashboard' && (
                <div className="min-h-screen flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <div className="text-sm text-gray-500">Scheduled Lessons</div>
                      <div className="text-2xl font-semibold text-blue-700">{lessons.length}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <div className="text-sm text-gray-500">Assigned Courses</div>
                      <div className="text-2xl font-semibold text-blue-700">{courses.length}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <div className="text-sm text-gray-500">Next Lesson</div>
                      <div className="text-2xl font-semibold text-blue-700">{lessons[0] ? `${lessons[0].topic} • ${new Date(lessons[0].start_time).toLocaleString()}` : '—'}</div>
                    </div>
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <div className="text-sm text-gray-500">Upcoming This Week</div>
                      <div className="text-2xl font-semibold text-blue-700">{lessons.filter(l => {
                        const d = l.start_time ? new Date(l.start_time) : null;
                        if (!d) return false;
                        const now = new Date();
                        const in7 = new Date(); in7.setDate(now.getDate() + 7);
                        return d >= now && d <= in7;
                      }).length}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-md p-4 shadow-sm h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh]">
                    {chartLoading && <div className="text-sm text-gray-500">Loading chart...</div>}
                    {!chartLoading && chartData && (
                      <div className="w-full h-full">
                        <Line options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} data={chartData} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {active === 'lectures' && (
                <div>
                  <h4 className="font-semibold mb-4">Your Scheduled Lessons</h4>
                  {lessons.length === 0 ? (
                    <p className="text-gray-500">No lessons scheduled yet</p>
                  ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {(selectedCourseId ? lessons.filter(l => l.course_id === selectedCourseId) : lessons).map(ls => (
                            <tr key={ls.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{ls.topic || '—'}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{allCourses.find(ac => ac.id === ls.course_id)?.name || ls.course_id}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{ls.start_time ? new Date(ls.start_time).toLocaleString() : '—'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{ls.end_time ? new Date(ls.end_time).toLocaleString() : '—'}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  {ls.meeting_link ? (
                                    <button onClick={() => window.open(ls.meeting_link, '_blank')} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium hover:shadow-md">Start Session</button>
                                  ) : null}
                                  <button onClick={async () => {
                                    const ok = window.confirm('Delete this lesson?');
                                    if (!ok) return;
                                    try {
                                      const raw = sessionStorage.getItem('AUTH_USER');
                                      const parsed = raw ? JSON.parse(raw) : null;
                                      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
                                      const dres = await fetch(`${BACKEND_URL}/api/lessons/${ls.id}`, { method: 'DELETE', headers });
                                      if (!dres.ok) throw new Error('Delete failed');
                                      fetchLessons();
                                    } catch (err) { alert('Delete error: ' + err.message); }
                                  }} className="p-2 bg-white border rounded-full hover:bg-red-50 hover:scale-105 transition transform cursor-pointer" title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                  <button onClick={async () => {
                                    const newTopic = window.prompt('Topic', ls.topic || '');
                                    if (newTopic === null) return;
                                    const newStart = window.prompt('Start (YYYY-MM-DDTHH:MM)', ls.start_time ? new Date(ls.start_time).toISOString().slice(0,16) : '');
                                    if (newStart === null) return;
                                    const newEnd = window.prompt('End (YYYY-MM-DDTHH:MM)', ls.end_time ? new Date(ls.end_time).toISOString().slice(0,16) : '');
                                    try {
                                      const newMeeting = window.prompt('Meeting link (Zoom / Google Meet)', ls.meeting_link || '');
                                      const raw = sessionStorage.getItem('AUTH_USER');
                                      const parsed = raw ? JSON.parse(raw) : null;
                                      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
                                      const pres = await fetch(`${BACKEND_URL}/api/lessons/${ls.id}`, { method: 'PUT', headers, body: JSON.stringify({ topic: newTopic, start_time: newStart, end_time: newEnd, course_id: ls.course_id, meeting_link: newMeeting }) });
                                      if (!pres.ok) throw new Error('Update failed');
                                      fetchLessons();
                                    } catch (err) { alert('Update error: ' + err.message); }
                                  }} className="p-2 bg-white border rounded-full hover:bg-yellow-50 hover:scale-105 transition transform cursor-pointer" title="Edit">
                                    <Edit3 className="w-4 h-4 text-yellow-600" />
                                  </button>
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

              {active === 'schedule' && (
                <div>
                  <h4 className="font-semibold mb-4">Schedule a Lesson</h4>
                  <form onSubmit={submitLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select required value={form.course_id} onChange={e => setForm(f => ({ ...f, course_id: Number(e.target.value) }))} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="">Select course</option>
                      {allCourses.filter(c => courses.includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input required value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="Topic" className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    <input required type="datetime-local" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    <input type="datetime-local" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    <input value={form.meeting_link} onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))} placeholder="Meeting link (Zoom / Google Meet)" className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    <div className="md:col-span-2 flex items-center gap-3">
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all">Create Lesson</button>
                      <button type="button" onClick={() => setForm({ course_id: '', topic: '', start_time: '', end_time: '' })} className="px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all">Clear</button>
                    </div>
                  </form>
                </div>
              )}

              {active === 'courses' && (
                <div>
                  <h4 className="font-semibold mb-4">My Courses</h4>
                  {courses.length === 0 ? (
                    <p className="text-gray-500">You have no courses assigned.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allCourses.filter(c => courses.includes(c.id)).map(c => (
                        <div key={c.id} className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
                          {c.banner_path ? (
                            <img src={`${BACKEND_URL}${c.banner_path}`} alt={c.name} className="w-full h-40 object-cover" />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-blue-400 opacity-50" />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="font-medium text-gray-900">{c.name}</div>
                            <div className="text-sm text-gray-600">Duration: {c.duration}</div>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="text-sm text-blue-600 font-semibold">LKR {c.fee || 0}</div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => { setSelectedCourseId(c.id); setActive('lectures'); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow hover:shadow-md">Schedule</button>
                                    <button onClick={() => setViewCourse(c)} className="p-2 bg-white border rounded-full hover:bg-blue-50 hover:scale-105 transition transform cursor-pointer" title="View">
                                      <Eye className="w-4 h-4 text-gray-700" />
                                    </button>
                                  </div>
                                </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
                {viewCourse && <CourseModal course={viewCourse} onClose={() => setViewCourse(null)} />}
                </div>
          </main>
        </div>
  );
}

// Render course view modal when needed
// use inside same file so we can easily set state from cards
function CourseModal({ course, onClose }) {
  if (!course) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {course.banner_path ? (
            <img src={`${BACKEND_URL}${course.banner_path}`} alt={course.name} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-400 opacity-60" />
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
          {course.description && <p className="mt-3 text-gray-600">{course.description}</p>}
          <div className="mt-6 flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-medium">{course.duration || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fee</div>
              <div className="font-semibold text-blue-600">LKR {course.fee || 0}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Course view modal
export function CourseViewModal({ course, onClose }) {
  if (!course) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {course.banner_path ? (
            <img src={`${BACKEND_URL}${course.banner_path}`} alt={course.name} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-400 opacity-60" />
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
          {course.description && <p className="mt-3 text-gray-600">{course.description}</p>}
          <div className="mt-6 flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-medium">{course.duration || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fee</div>
              <div className="font-semibold text-blue-600">LKR {course.fee || 0}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
