import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HMSRoomProvider, useHMSActions, useHMSStore, selectPeers, selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, selectLocalPeer } from '@100mslive/hms-video-react';

function SessionInner() {
  const peers = useHMSStore(selectPeers) || [];
  const local = useHMSStore(selectLocalPeer);
  const micOn = useHMSStore(selectIsLocalAudioEnabled);
  const camOn = useHMSStore(selectIsLocalVideoEnabled);
  const actions = useHMSActions();

  const toggleMic = async () => { try { await actions.setLocalAudioEnabled(!micOn); } catch (e) { console.warn(e); } };
  const toggleCam = async () => { try { await actions.setLocalVideoEnabled(!camOn); } catch (e) { console.warn(e); } };
  const leave = async () => { try { await actions.leave(); } catch (e) { console.warn(e); } };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">You: {local?.name || local?.id || 'Me'}</div>
        <div className="flex gap-2">
          <button onClick={toggleMic} className={`px-3 py-2 rounded-2xl font-medium transition ${micOn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{micOn ? 'Mute' : 'Unmute'}</button>
          <button onClick={toggleCam} className={`px-3 py-2 rounded-2xl font-medium transition ${camOn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{camOn ? 'Cam Off' : 'Cam On'}</button>
          <button onClick={leave} className="px-4 py-2 bg-red-500 text-white rounded-2xl font-medium hover:shadow-md transition">Leave</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {peers.map(p => (
          <div key={p.id} className="p-4 bg-white rounded-2xl shadow-sm border">
            <div className="font-semibold text-gray-900">{p.name || p.id}</div>
            <div className="text-sm text-gray-500">Role: {p.role}</div>
            <div className="mt-2 text-xs text-gray-400">Audio: {p.isAudioEnabled ? 'on' : 'off'} • Video: {p.isVideoEnabled ? 'on' : 'off'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockSession({ user, id }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [peers] = useState([{ id: 'student-1', name: 'Student 1', role: 'student', isAudioEnabled: true, isVideoEnabled: true }]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">You (mock): {user?.name || user?.email || 'Lecturer'}</div>
        <div className="flex gap-2">
          <button onClick={() => setMicOn(s => !s)} className={`px-3 py-2 rounded-2xl font-medium transition ${micOn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{micOn ? 'Mute' : 'Unmute'}</button>
          <button onClick={() => setCamOn(s => !s)} className={`px-3 py-2 rounded-2xl font-medium transition ${camOn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{camOn ? 'Cam Off' : 'Cam On'}</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="font-semibold text-gray-900">{user?.name || 'You (mock)'}</div>
          <div className="text-sm text-gray-500">Role: Lecturer</div>
          <div className="mt-2 text-xs text-gray-400">Audio: {micOn ? 'on' : 'off'} • Video: {camOn ? 'on' : 'off'}</div>
        </div>
        {peers.map(p => (
          <div key={p.id} className="p-4 bg-white rounded-2xl shadow-sm border">
            <div className="font-semibold text-gray-900">{p.name}</div>
            <div className="text-sm text-gray-500">Role: {p.role}</div>
            <div className="mt-2 text-xs text-gray-400">Audio: {p.isAudioEnabled ? 'on' : 'off'} • Video: {p.isVideoEnabled ? 'on' : 'off'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LecturerSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = React.useMemo(() => JSON.parse(localStorage.getItem('lecturer') || 'null'), []);

  useEffect(() => {
    if (!user) return setError('Not authenticated');
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/100ms/token?lessonId=${encodeURIComponent(id)}&lecturerId=${encodeURIComponent(user.id)}`);
        // If backend token request fails (not configured), fall back to mock session so UI still works
        if (!res.ok) {
          console.warn('HMS token request failed, falling back to mock. Status:', res.status);
          setToken('MOCK');
          return;
        }
        const j = await res.json();
        if (!j?.token) {
          console.warn('HMS token missing in response, falling back to mock');
          setToken('MOCK');
          return;
        }
        setToken(j.token);
      } catch (e) {
        console.warn('HMS token error, falling back to mock', e);
        setToken('MOCK');
      } finally { setLoading(false); }
    })();
  }, [id, user]);

  if (!user) return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">You must be logged in as a lecturer to start a session.</div>
    </div>
  );

  if (loading) return <div className="p-8">Connecting to session...</div>;
  if (error) return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div className="text-red-600 font-semibold mb-2">Error</div>
        <div className="text-gray-700 mb-4">{error}</div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50">Go back</button>
        </div>
      </div>
    </div>
  );

  // If backend returned the mock token string, render a local mock session UI
  if (token === 'MOCK') {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Live Session (mock)</h2>
          <div className="mb-4 text-sm text-gray-600">Lesson ID: {id} — Lecturer: {user?.name || user?.email}</div>
          <div className="border rounded bg-white overflow-hidden">
            <MockSession user={user} id={id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Live Session</h2>
        <div className="mb-4 text-sm text-gray-600">Lesson ID: {id} — Lecturer: {user?.name || user?.email}</div>
        <div className="border rounded bg-white overflow-hidden">
          <HMSRoomProvider
            token={token}
          >
            <SessionInner />
          </HMSRoomProvider>
        </div>
      </div>
    </div>
  );
}
