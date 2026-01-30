import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../config';
import assets from '../../assets/images/images';
import { motion } from 'framer-motion';
import AddCourses from './AddCourses';
import AddLecturer from './AddLecturer';
import AddAdmin from './AddAdmin';
import AddBlog from './AddBlog';
import Inquiries from './Inquiries';
import Dashboard from './Dashboard';
import { Home, BookOpen, User, Edit3, Mail, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', Icon: Home },
  { key: 'courses', label: 'Courses', Icon: BookOpen },
  { key: 'lecturers', label: 'Lecturers', Icon: User },
  { key: 'blog', label: 'Blog Posts', Icon: Edit3 },
  { key: 'inquiries', label: 'Inquiries', Icon: Mail },
  { key: 'students', label: 'Our Students', Icon: User },
  { key: 'payments', label: 'Approvals', Icon: BookOpen },
  { key: 'admins', label: 'Admins', Icon: User },
];

export default function AdminPanel() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel = navItems.find(n => n.key === active)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      {/* overlay for mobile when sidebar is open */}
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
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Admin Portal</p>
            </div>
            {/* mobile close button */}
            <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden p-2 rounded bg-white/50 hover:bg-white/70">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 overflow-auto">
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
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100/50">
                <SidebarUser />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-5 max-w-8xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded bg-white/80 shadow">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{activeLabel}</h2>
            </div>
          </motion.div>

          {/* Content Card with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white  border border-white overflow-hidden"
          >
            <div className="p-2 lg:p-12">
              {active === 'dashboard' && <Dashboard />}
              {active === 'courses' && <AddCourses />}
              {active === 'lecturers' && <AddLecturer />}
              {active === 'blog' && <AddBlog />}
              {active === 'inquiries' && <Inquiries />}
              {active === 'students' && <StudentsAdmin />}
              {active === 'payments' && <PaymentApprovals />}
              {active === 'admins' && <AddAdmin />}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function StudentsAdmin() {
  const [tab, setTab] = React.useState('pending');
  const [pending, setPending] = React.useState([]);
  const [ongoing, setOngoing] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const p = await fetch(`${BACKEND_URL}/api/students?status=pending`, { headers }).then(r=>r.json()).catch(()=>[]);
      const a = await fetch(`${BACKEND_URL}/api/students?status=approved`, { headers }).then(r=>r.json()).catch(()=>[]);
      setPending(Array.isArray(p)?p:[]);
      setOngoing(Array.isArray(a)?a:[]);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  React.useEffect(()=>{ fetchLists(); }, []);

  const approve = async (id) => {
    if (!confirm('Approve this student and send credentials?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/${id}/approve`, { method: 'PUT', headers });
      if (!r.ok) throw new Error('Failed');
      alert('Approved');
      fetchLists();
    } catch (e) { alert('Error approving'); }
  };

  const decline = async (id) => {
    const comment = prompt('Enter decline reason/comment');
    if (comment === null) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const authHeader = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/${id}/decline`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader }, body: JSON.stringify({ comment }) });
      if (!r.ok) throw new Error('Failed');
      alert('Declined and email sent');
      fetchLists();
    } catch (e) { alert('Error declining'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this registration? This is permanent.')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/${id}`, { method: 'DELETE', headers });
      if (!r.ok) throw new Error('Failed');
      alert('Deleted');
      fetchLists();
    } catch (e) { alert('Delete failed'); }
  };

  const [coursesModal, setCoursesModal] = React.useState({ open: false, studentId: null, courses: [] });

  const openCourses = async (studentId) => {
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/students/${studentId}/courses`, { headers });
      const data = await res.json();
      setCoursesModal({ open: true, studentId, courses: Array.isArray(data.courses)?data.courses:[] });
    } catch (e) { console.error(e); alert('Failed to load courses'); }
  };

  const removeCourseFromStudent = async (studentId) => {
    if (!confirm('Remove this course from student?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/${studentId}/course`, { method: 'DELETE', headers });
      if (!r.ok) throw new Error('Failed');
      alert('Course removed');
      setCoursesModal({ open: false, studentId: null, courses: [] });
      fetchLists();
    } catch (e) { alert('Remove failed'); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl shadow-inner">
          {['pending', 'ongoing'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-8 py-3 rounded-xl font-medium transition-all duration-300"
            >
              {tab === t && (
                <motion.div
                  layoutId="studentsTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${tab === t ? 'text-white' : 'text-gray-600'}`}>
                {t === 'pending' ? 'Pending' : 'Ongoing'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-8xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">NIC</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {(tab === 'pending' ? pending : ongoing).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 w-12">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">{s.photo_path ? <img src={`${BACKEND_URL}${s.photo_path}`} alt="p" className="w-full h-full object-cover" /> : <div className="p-2 text-gray-400">No</div>}</div>
                      <div>
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.student_number || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.nic}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.status || (tab === 'pending' ? 'pending' : 'approved')}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-2">
                        {tab === 'pending' && <button onClick={() => approve(s.id)} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Approve</button>}
                        {tab === 'pending' && <button onClick={() => decline(s.id)} className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm">Decline</button>}
                        <button onClick={() => openCourses(s.id)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Courses</button>
                        <button onClick={() => del(s.id)} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Courses Modal */}
      {coursesModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setCoursesModal({ open:false, studentId:null, courses:[] })}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-auto max-h-[85vh]" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Enrolled Courses</h3>
              <button onClick={() => setCoursesModal({ open:false, studentId:null, courses:[] })} className="px-3 py-1 border rounded">Close</button>
            </div>
            <div className="p-6">
              {coursesModal.courses.length === 0 ? <p className="text-gray-500">No enrolled courses</p> : (
                <ul className="space-y-3">
                  {coursesModal.courses.map(c => (
                    <li key={c.id} className="p-4 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-sm text-gray-600">{c.duration} • {c.fee ? `LKR ${c.fee}` : 'Free'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeCourseFromStudent(coursesModal.studentId)} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentApprovals() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(`${BACKEND_URL}/api/students/payments/list`, { headers });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  React.useEffect(()=>{ fetchList(); }, []);

  const approve = async (id) => {
    if (!confirm('Approve this payment?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/payments/${id}/approve`, { method: 'PUT', headers });
      if (!r.ok) throw new Error('Failed');
      alert('Approved');
      fetchList();
    } catch (e) { alert('Error approving'); }
  };

  const decline = async (id) => {
    const comment = prompt('Enter decline reason/comment');
    if (comment === null) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const r = await fetch(`${BACKEND_URL}/api/students/payments/${id}/decline`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ comment }) });
      if (!r.ok) throw new Error('Failed');
      alert('Declined and email sent');
      fetchList();
    } catch (e) { alert('Error declining'); }
  };

  if (loading) return <div className="text-center py-8"><p className="text-gray-600">Loading approvals...</p></div>;

  return (
    <div>
      <h3 className="font-semibold mb-6 text-lg">Pending Payments</h3>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No pending payments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(it => (
            <div key={it.id} className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Header with status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                <h4 className="text-sm font-bold text-gray-800 truncate">{it.name}</h4>
                <p className="text-xs text-gray-600 truncate">{it.email}</p>
              </div>

              {/* Main content */}
              <div className="p-5 space-y-4">
                {/* Contact info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 font-medium min-w-fit">Mobile:</span>
                    <span className="text-gray-700">{it.mobile || '—'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 font-medium min-w-fit">NIC:</span>
                    <span className="text-gray-700">{it.nic || '—'}</span>
                  </div>
                </div>

                {/* Course info */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-600 font-medium mb-1">Course</p>
                  <p className="text-sm font-semibold text-blue-700">{it.course_name || `Course #${it.course_id}`}</p>
                </div>

                {/* Bank slip */}
                {it.bank_slip_path && (
                  <div>
                    <a href={`${BACKEND_URL}${it.bank_slip_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 16.5a1 1 0 11-2 0 1 1 0 012 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path></svg>
                      View Bank Slip
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button 
                  onClick={()=>approve(it.id)} 
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  Approve
                </button>
                <button 
                  onClick={()=>decline(it.id)} 
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarUser() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  React.useEffect(()=>{
    try{
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
    }catch(e){}
  },[]);
  const logout = () => {
    sessionStorage.removeItem('AUTH_USER');
    window.location.href = '/';
  };
  const email = user && user.info && user.info.email ? user.info.email : 'admin@globalgate.edu';
  const initials = (user && user.info && user.info.name) ? user.info.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'A';
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">{initials}</div>
      <div>
        <p className="font-semibold text-gray-800">{(user && user.info && user.info.name) ? user.info.name : 'Admin User'}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <button onClick={logout} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}