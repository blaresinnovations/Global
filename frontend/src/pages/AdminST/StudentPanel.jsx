import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, LogOut, X, Menu } from 'lucide-react';
import { BACKEND_URL } from '../../config';
import assets from '../../assets/images/images'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: Home },
  { key: 'catalog', label: 'All Courses', Icon: BookOpen },
  { key: 'courses', label: 'My Courses', Icon: BookOpen },
];

function StudentDashboard({ courses }) {
  return (
    <div>
      <h4 className="font-semibold mb-4">Overview</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
          <div className="text-sm text-gray-500">Enrolled Courses</div>
          <div className="text-2xl font-bold mt-2">{courses.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
          <div className="text-sm text-gray-500">Next Session</div>
          <div className="text-lg mt-2">—</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
          <div className="text-sm text-gray-500">Notifications</div>
          <div className="text-lg mt-2">—</div>
        </div>
      </div>
    </div>
  );
}

function MyCourses({ studentId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${studentId}/courses`);
        const data = await res.json();
        setCourses(Array.isArray(data.courses) ? data.courses : []);
      } catch (e) { console.error(e); setCourses([]); }
      finally { setLoading(false); }
    };
    load();
  }, [studentId]);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h4 className="font-semibold mb-4">My Courses</h4>
      {courses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
              {c.banner_path ? (
                <img src={c.banner_path.startsWith('http') ? c.banner_path : `${BACKEND_URL}${c.banner_path}`} alt={c.name} className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"> <div className="text-blue-400 opacity-50">No Image</div> </div>
              )}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{c.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{c.duration}</p>
                {c.fee !== undefined && <p className="text-sm text-blue-600 font-semibold mb-3">Fee: LKR {c.fee}</p>}
                <p className="text-gray-700 line-clamp-2 text-sm">{c.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div />
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelected(c); }} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-md transition">Details</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-white/40 to-white/30 backdrop-blur-md">
            {selected.banner_path && (
              <div className="relative w-full h-64">
                <img src={selected.banner_path.startsWith('http') ? selected.banner_path : `${BACKEND_URL}${selected.banner_path}`} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute left-6 bottom-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold drop-shadow-md">{selected.name}</h3>
                  <div className="text-sm text-white/90 mt-1">{selected.duration} • LKR {selected.fee || 0}</div>
                </div>
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none text-gray-700 mb-6">{selected.description}</div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h5 className="text-lg font-semibold mb-3">Lecturers</h5>
                  {selected.lecturers && selected.lecturers.length ? (
                    <div className="space-y-3">
                      {selected.lecturers.map(l => (
                        <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {l.photo_path ? <img src={`${BACKEND_URL}${l.photo_path}`} alt={l.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{l.name}</div>
                            <div className="text-sm text-gray-500">{l.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500">No lecturer assigned yet.</p>}

                  <div className="mt-6">
                    <h5 className="text-lg font-semibold mb-3">Lesson Schedule</h5>
                    {selected.lessons && selected.lessons.length ? (
                      <div className="rounded-lg bg-white/5 backdrop-blur-sm overflow-hidden">
                        <table className="w-full table-auto text-sm">
                          <thead className="text-left text-xs text-gray-400 uppercase">
                            <tr>
                              <th className="px-4 py-3">Topic</th>
                              <th className="px-4 py-3">Lecturer</th>
                              <th className="px-4 py-3">Start</th>
                              <th className="px-4 py-3">End</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {selected.lessons.map(ls => {
                              const lecturer = selected.lecturers && selected.lecturers.find(l => String(l.id) === String(ls.lecturer_id));
                              return (
                                <tr key={ls.id} className="hover:bg-white/2">
                                  <td className="px-4 py-3 align-top">
                                    <div className="font-medium text-gray-900">{ls.topic || 'No topic'}</div>
                                    <div className="text-xs text-gray-500 mt-1">{ls.description || ''}</div>
                                  </td>
                                  <td className="px-4 py-3 align-top text-gray-700">{lecturer ? lecturer.name : `ID ${ls.lecturer_id}`}</td>
                                  <td className="px-4 py-3 align-top text-sm text-gray-500">{ls.start_time ? new Date(ls.start_time).toLocaleString() : '—'}</td>
                                  <td className="px-4 py-3 align-top text-sm text-gray-500">{ls.end_time ? new Date(ls.end_time).toLocaleString() : '—'}</td>
                                  <td className="px-4 py-3 align-top text-right">
                                    {(typeof ls.meeting_link === 'string' && ls.meeting_link.trim().length > 0) ? (
                                      <button onClick={() => window.open(ls.meeting_link.trim(), '_blank', 'noopener,noreferrer')} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm">Engage</button>
                                    ) : (<span className="text-xs text-gray-400">—</span>)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : <p className="text-gray-500">No lessons scheduled.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentPanel() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const auth = JSON.parse(sessionStorage.getItem('AUTH_USER') || 'null');
      if (auth && auth.role === 'student' && auth.info && auth.info.id) setStudentId(auth.info.id);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!studentId) return;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/students/${studentId}`);
        if (res.ok) setStudentInfo(await res.json());
      } catch (e) { console.error('fetch studentInfo', e); }
    })();
  }, [studentId]);

  const activeLabel = navItems.find(n => n.key === active)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Student Portal</p>
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

        <div className="p-4 md:p-6 border-t border-gray-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0 overflow-hidden">
              {studentInfo && studentInfo.photo_path ? (
                <img src={`${BACKEND_URL}${studentInfo.photo_path}`} alt={studentInfo.name} className="w-full h-full object-cover" />
              ) : (
                <span>{studentInfo && studentInfo.name ? studentInfo.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'S'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{studentInfo && studentInfo.name ? studentInfo.name : 'Student Name'}</p>
              <p className="text-xs text-gray-500 truncate">{studentInfo && studentInfo.email ? studentInfo.email : 'student@example.com'}</p>
            </div>
            <button onClick={() => { sessionStorage.removeItem('AUTH_USER'); window.location.href = '/'; }} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-5 max-w-8xl mx-auto h-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded bg-white/80 shadow">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{activeLabel}</h2>
            </div>
            <p className="text-gray-600 text-lg">Student dashboard and course management.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-5 lg:p-12">
              {active === 'dashboard' && <StudentDashboard courses={courses} />}
              {active === 'catalog' && <AllCourses studentId={studentId} onPurchased={() => setActive('courses')} />}
              {active === 'courses' && <MyCourses studentId={studentId} />}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function AllCourses({ studentId, onPurchased }) {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [viewMode, setViewMode] = React.useState(null); // 'details' | 'buy'
  const [studentInfo, setStudentInfo] = React.useState(null);
  const [studentCoursesList, setStudentCoursesList] = React.useState([]);
  const [method, setMethod] = React.useState('bank');
  const [slipFile, setSlipFile] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (!mounted) return;
        setCourses(Array.isArray(data) ? data.map(c => ({ 
          ...c, 
          is_free: !!Number(c.is_free),
          is_seminar: !!Number(c.is_seminar),
          meeting_link: c.meeting_link || null,
          early_bird_price: c.early_bird_price || null,
          start_date: c.start_date || null,
          end_date: c.end_date || null
        })) : []);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    })();
    // fetch student info if signed in
    (async () => {
      if (!studentId) return;
        try {
          const s = await fetch(`${BACKEND_URL}/api/students/${studentId}`);
          if (s.ok) setStudentInfo(await s.json());
        } catch (e) { console.error('studentInfo', e); }
        try {
          const sc = await fetch(`${BACKEND_URL}/api/students/${studentId}/enrollments`);
          if (sc.ok) {
            const data = await sc.json();
            setStudentCoursesList(Array.isArray(data.enrollments) ? data.enrollments : []);
          }
        } catch (e) { console.error('student courses', e); setStudentCoursesList([]); }
    })();
    return () => { mounted = false; };
  }, []);

  const uploadSlip = (e) => setSlipFile(e.target.files?.[0] || null);

  const submitPayment = async () => {
    if (!studentId) return alert('Not signed in');
    if (!selected) return alert('Select a course');
    setSubmitting(true);
    setMessage('');
    try {
      // uniqueness check: fetch student info
      // check enrolled courses to prevent duplicate enrollment
      const alreadyEnrolled = Array.isArray(studentCoursesList) && studentCoursesList.some(sc => Number(sc.course_id) === Number(selected.id) && (sc.payment_status === 'approved' || sc.payment_status === 'pending'));
      if (alreadyEnrolled) {
        setMessage('You already have an enrollment request or are enrolled for this course.');
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append('courseId', selected.id);
      fd.append('payment_method', method);
      if (method === 'bank' && slipFile) fd.append('bank_slip', slipFile);

      const res = await fetch(`${BACKEND_URL}/api/students/${studentId}/payment`, { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error || 'Payment submit failed');
      }
      if (method === 'card') {
        setMessage('Payment successful — course added.');
      } else if (method === 'free') {
        setMessage('Enrollment successful — course added.');
      } else {
        setMessage(`We have received your request for ${selected.name}. Please wait until the admin approves the request.`);
      }
      // refresh student info so UI disables relevant course
      try {
        const s = await fetch(`${BACKEND_URL}/api/students/${studentId}`);
        if (s.ok) setStudentInfo(await s.json());
      } catch (e) { /* ignore */ }
      // refresh enrollments list (includes pending approvals)
      try {
        const sc = await fetch(`${BACKEND_URL}/api/students/${studentId}/enrollments`);
        if (sc.ok) {
          const data = await sc.json();
          setStudentCoursesList(Array.isArray(data.enrollments) ? data.enrollments : []);
        }
      } catch (e) { /* ignore */ }
      setSelected(null);
      setSlipFile(null);
      if (method === 'card' && typeof onPurchased === 'function') onPurchased();
    } catch (e) {
      setMessage(e.message || 'Error');
    } finally { setSubmitting(false); }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h3 className="font-semibold mb-4">All Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            {c.banner_path ? (
              <img src={c.banner_path.startsWith('http') ? c.banner_path : `${BACKEND_URL}${c.banner_path}`} alt={c.name} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="text-blue-400 opacity-50">No Image</div>
              </div>
            )}

            <div className="absolute top-4 right-4 z-10">
              <div className="flex flex-col gap-1">
                {c.early_bird_price && parseFloat(c.early_bird_price) > 0 ? (
                  <>
                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        Early Bird: LKR {parseFloat(c.early_bird_price).toLocaleString()}
                      </span>
                    </div>
                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm rounded-full">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 line-through">
                        {parseFloat(c.fee) === 0 ? 'FREE' : `LKR ${parseFloat(c.fee).toLocaleString()}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      {c.is_free ? 'FREE' : `LKR ${parseFloat(c.fee || 0).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{c.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{c.duration}</p>
              {(c.start_date || c.end_date) && (
                <p className="text-sm text-gray-500 mb-2">
                  {c.start_date && <span>Starts: {new Date(c.start_date).toLocaleDateString()}</span>}
                  {c.start_date && c.end_date && <span className="mx-2">•</span>}
                  {c.end_date && <span>Ends: {new Date(c.end_date).toLocaleDateString()}</span>}
                </p>
              )}
              <p className="text-gray-700 line-clamp-2 text-sm">{c.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Lecturer badges will be fetched on details modal; show placeholders */}
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const isPending = Array.isArray(studentCoursesList) && studentCoursesList.some(sc => Number(sc.course_id) === Number(c.id) && sc.payment_status === 'pending');
                    const isApproved = Array.isArray(studentCoursesList) && studentCoursesList.some(sc => Number(sc.course_id) === Number(c.id) && sc.payment_status === 'approved');
                    const disabled = isPending || isApproved;
                    let label = c.is_free ? 'Enroll' : 'Buy';
                    if (isPending) label = 'Pending';
                    if (isApproved) label = 'Enrolled';
                    return (
                      <>
                        <button
                          onClick={() => { setSelected(c); setMethod(c.is_free ? 'free' : 'bank'); setViewMode('buy'); }}
                          disabled={disabled}
                          className={`px-4 py-2 rounded-2xl font-medium shadow ${disabled ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md'}`}
                        >
                          {label}
                        </button>
                        <button onClick={() => { setSelected(c); setViewMode('details'); }} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-md transition">Details</button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button onClick={() => { setSelected(c); setViewMode('details'); }} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-blue-50"><svg className="w-4 h-4 text-gray-700" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {selected && createPortal(
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center py-12 px-4 overflow-y-auto" onClick={() => { setSelected(null); setViewMode(null); }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {viewMode === 'details' ? (
              <>
                {selected.banner_path && <img src={selected.banner_path.startsWith('http') ? selected.banner_path : `${BACKEND_URL}${selected.banner_path}`} alt={selected.name} className="w-full h-80 object-cover" />}
                <div className="p-5 lg:p-12">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selected.name}</h2>
                      <p className="text-lg text-blue-600 mt-2">{selected.duration}</p>
                      {(selected.start_date || selected.end_date) && (
                        <p className="text-sm text-gray-500 mt-2">
                          {selected.start_date && <span>Starts: {new Date(selected.start_date).toLocaleDateString()}</span>}
                          {selected.start_date && selected.end_date && <span className="mx-2">•</span>}
                          {selected.end_date && <span>Ends: {new Date(selected.end_date).toLocaleDateString()}</span>}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-3">
                        {selected.early_bird_price && parseFloat(selected.early_bird_price) > 0 ? (
                          <>
                            <div className="px-3 py-1.5 bg-red-500 rounded-full">
                              <span className="text-sm font-bold text-white">
                                Early Bird: LKR {parseFloat(selected.early_bird_price).toLocaleString()}
                              </span>
                            </div>
                            <div className="px-3 py-1.5 bg-gray-200 rounded-full">
                              <span className="text-sm font-semibold text-gray-700 line-through">
                                {parseFloat(selected.fee) === 0 ? 'FREE' : `LKR ${parseFloat(selected.fee).toLocaleString()}`}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="px-3 py-1.5 bg-blue-100 rounded-full">
                            <span className="text-sm font-semibold text-blue-700">
                              {selected.is_free ? 'FREE' : `LKR ${parseFloat(selected.fee || 0).toLocaleString()}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => { setSelected(null); setViewMode(null); }} className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-md transition">Close</button>
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p>{selected.description}</p>
                    <h4 className="mt-4">Lecturers</h4>
                    <div className="mt-2">
                      {/* fetch lecturers for this course */}
                      <LecturersList courseId={selected.id} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Buy modal
              <div>
                {selected.banner_path && <img src={selected.banner_path.startsWith('http') ? selected.banner_path : `${BACKEND_URL}${selected.banner_path}`} alt={selected.name} className="w-full h-56 object-cover" />}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-semibold">{selected.name}</h4>
                      <div className="text-sm text-gray-600">{selected.duration} • {selected.is_free ? 'Free' : (selected.fee ? `LKR ${selected.fee}` : 'Free')}</div>
                    </div>
                    <div>
                      <button onClick={() => { setSelected(null); setViewMode(null); }} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition">Close</button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {selected.is_free ? (
                      <div className="text-sm text-gray-700">This course is free — click Submit to enroll immediately.</div>
                    ) : (
                      <>
                        <div className="text-sm text-gray-700">Choose payment method:</div>
                        <div className="mt-2 flex gap-4">
                          <label className={`px-3 py-2 border rounded ${method==='bank'?'bg-gray-100':''}`}><input type="radio" name="pm" checked={method==='bank'} onChange={()=>setMethod('bank')} /> Bank Transfer</label>
                          <label className={`px-3 py-2 border rounded ${method==='card'?'bg-gray-100':''}`}><input type="radio" name="pm" checked={method==='card'} onChange={()=>setMethod('card')} /> Card</label>
                        </div>

                        {method === 'bank' && (
                          <div className="mt-4">
                            <div className="text-sm text-gray-600">Bank Details:</div>
                            <div className="mt-2 text-sm">Account: Global Gate Ltd<br/>Bank: Example Bank<br/>Account No: 1234567890<br/>Branch: Colombo</div>
                            <div className="mt-3">
                              <label className="block text-sm mb-1">Upload Bank Slip</label>
                              <input type="file" accept="image/*,application/pdf" onChange={uploadSlip} />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <button disabled={submitting} onClick={submitPayment} className="px-4 py-2 bg-blue-600 text-white rounded">{submitting ? 'Submitting...' : 'Submit Payment'}</button>
                      <button onClick={() => { setSelected(null); setSlipFile(null); }} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-md transition">Cancel</button>
                    </div>
                    {message && <div className="mt-3 text-sm text-green-600">{message}</div>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>, document.body)
      }
    </div>
  );
}

function LecturersList({ courseId }) {
  const [list, setList] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/lecturers`);
        const data = await res.json();
        if (!mounted) return;
        const filtered = Array.isArray(data) ? data.filter(l => Array.isArray(l.courses) && l.courses.map(String).includes(String(courseId))) : [];
        setList(filtered);
      } catch (e) { console.error(e); setList([]); }
    })();
    return () => { mounted = false; };
  }, [courseId]);

  if (!list || list.length === 0) return <p className="text-gray-500">No lecturers assigned.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
      {list.map(l => (
        <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">{l.photo_path ? <img src={`${BACKEND_URL}${l.photo_path}`} alt={l.name} className="w-full h-full object-cover" /> : <div className="p-2 text-gray-400">No</div>}</div>
          <div>
            <div className="font-medium text-gray-900">{l.name}</div>
            <div className="text-sm text-gray-500">{l.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
