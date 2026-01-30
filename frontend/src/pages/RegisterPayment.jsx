import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function RegisterPayment() {
  const navigate = useNavigate();
  const payload = JSON.parse(sessionStorage.getItem('REG_PAYLOAD') || '{}');
  const photoData = sessionStorage.getItem('REG_PHOTO_DATA') || null;
  const [method, setMethod] = useState('bank');
  const [bankSlip, setBankSlip] = useState(null);
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/courses`).then(r => r.json()).then(data => setCourses(Array.isArray(data) ? data : []));
  }, []);

  const selectedCourse = courses.find(c => String(c.id) === String(payload.courseId));

  const handleBankSlip = (e) => setBankSlip(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    // attach payload fields
    for (const k of Object.keys(payload)) fd.append(k, payload[k]);
    // attach photo if present (data URL)
    if (photoData) {
      const res = await fetch(photoData);
      const blob = await res.blob();
      fd.append('photo', new File([blob], `photo_${Date.now()}.png`, { type: blob.type }));
    }
    if (bankSlip) fd.append('bank_slip', bankSlip);
    fd.append('payment_method', method);
    fd.append('payment_status', method === 'card' ? 'paid' : 'pending');

    try {
      const r = await fetch(`${BACKEND_URL}/api/students`, { method: 'POST', body: fd });
      const res = await r.json();
      if (!r.ok) throw new Error(res.error || 'Registration failed');
      alert('Registration saved');
      sessionStorage.removeItem('REG_PAYLOAD');
      sessionStorage.removeItem('REG_PHOTO_DATA');
      navigate('/');
    } catch (err) {
      alert('Error: ' + (err.message || String(err)));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Payment & Confirmation</h2>
      <div className="bg-white/80 p-6 rounded shadow space-y-4">
        <div>
          <div className="text-sm text-gray-500">Student</div>
          <div className="font-medium">{payload.name} — {payload.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Course</div>
          <div className="font-medium">{selectedCourse ? `${selectedCourse.name} — LKR ${selectedCourse.fee || 0}` : '—'}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={method==='bank'} onChange={()=>setMethod('bank')} />
                <span>Bank Transfer (Upload slip)</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={method==='card'} onChange={()=>setMethod('card')} />
                <span>Card Payment</span>
              </label>
            </div>
          </div>

          {method === 'bank' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Slip</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleBankSlip} />
            </div>
          )}

          {method === 'card' && (
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="Card Number" value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value}))} className="px-3 py-2 border rounded" />
              <input placeholder="Name on Card" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} className="px-3 py-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard(c=>({...c,exp:e.target.value}))} className="px-3 py-2 border rounded" />
                <input placeholder="CVV" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value}))} className="px-3 py-2 border rounded" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded">Submit Registration</button>
          </div>
        </form>
      </div>
    </div>
  );
}
