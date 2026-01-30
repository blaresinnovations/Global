import React from 'react';
import { BACKEND_URL } from '../../config';
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

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Dashboard() {
  const [counts, setCounts] = React.useState({ courses: 0, lecturers: 0, blogs: 0, inquiriesPending: 0 });
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // include auth header for admin-only endpoints (inquiries)
        const raw = sessionStorage.getItem('AUTH_USER');
        const parsed = raw ? JSON.parse(raw) : null;
        const authHeaders = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};

        const [cRes, lRes, bRes, iRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/courses`),
          fetch(`${BACKEND_URL}/api/lecturers`),
          fetch(`${BACKEND_URL}/api/blogs`),
          fetch(`${BACKEND_URL}/api/inquiries`, { headers: authHeaders })
        ]);

        const [courses, lecturers, blogs, inquiries] = await Promise.all([
          cRes.json().catch(() => []),
          lRes.json().catch(() => []),
          bRes.json().catch(() => []),
          iRes.json().catch(() => [])
        ]);

        // normalize is_done values (backend may return 0/1 or '0'/'1' or boolean)
        const isDone = (v) => v === true || v === 1 || v === '1' || v === 'true';
        const pending = Array.isArray(inquiries) ? inquiries.filter(i => !isDone(i.is_done)).length : 0;
        setCounts({ courses: Array.isArray(courses) ? courses.length : 0, lecturers: Array.isArray(lecturers) ? lecturers.length : 0, blogs: Array.isArray(blogs) ? blogs.length : 0, inquiriesPending: pending });

        // prepare 30 days labels
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

        if (Array.isArray(inquiries)) {
          inquiries.forEach(q => {
            const created = q.created_at ? new Date(q.created_at) : null;
            if (!created || Number.isNaN(created.getTime())) return;
            const key = formatDate(created);
            if (map.hasOwnProperty(key)) map[key]++;
          });
        }

        const data = {
          labels: labels.map(l => l.replace(/^[0-9]{4}-/, '')),
          datasets: [
            {
              label: 'Inquiries (last 30 days)',
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
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Total Courses</div>
          <div className="text-2xl font-semibold text-blue-700">{loading ? '—' : counts.courses}</div>
        </div>
        <div className="p-4 bg-white rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Total Lecturers</div>
          <div className="text-2xl font-semibold text-blue-700">{loading ? '—' : counts.lecturers}</div>
        </div>
        <div className="p-4 bg-white rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Total Blogs</div>
          <div className="text-2xl font-semibold text-blue-700">{loading ? '—' : counts.blogs}</div>
        </div>
        <div className="p-4 bg-white rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Pending Inquiries</div>
          <div className="text-2xl font-semibold text-red-600">{loading ? '—' : counts.inquiriesPending}</div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 shadow-sm h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh]">
        {loading && <div className="text-sm text-gray-500">Loading chart...</div>}
        {!loading && chartData && (
          <div className="w-full h-full">
            <Line
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              data={chartData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
