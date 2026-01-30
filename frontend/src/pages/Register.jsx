import React, { useEffect, useState, useRef } from 'react';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Phone, Calendar, MapPin, Briefcase, ChevronRight, Upload, Shield, CheckCircle, Lock, Sparkles } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    mobile: '', 
    email: '', 
    dob: '', 
    gender: 'Male', 
    nic: '', 
    address: '', 
    occupation: '' 
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/courses`).then(r => r.json()).then(data => setCourses(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!cameraOpen) return;
    const openCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) { console.error('Camera error', e); }
    };
    openCamera();
    return () => {
      if (streamRef.current) { 
        streamRef.current.getTracks().forEach(t => t.stop()); 
        streamRef.current = null; 
      }
    };
  }, [cameraOpen]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setPhotoFile(null);
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setCameraOpen(false);
      if (streamRef.current) { 
        streamRef.current.getTracks().forEach(t => t.stop()); 
        streamRef.current = null; 
      }
    }, 'image/png', 0.9);
  };

  const [registered, setRegistered] = useState(false);
  const [registeredInfo, setRegisteredInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      if (!form.nic || form.nic.trim() === '') {
        setErrorMsg('Please enter NIC');
        return;
      }
      setLoading(true);

      const chk = await fetch(`${BACKEND_URL}/api/students?nic=${encodeURIComponent(form.nic.trim())}`);
      if (chk.ok) {
        const list = await chk.json();
        if (Array.isArray(list) && list.length > 0) {
          setErrorMsg('A student with this NIC already exists.');
          setLoading(false);
          return;
        }
      }

      const fd = new FormData();
      fd.append('name', form.name || '');
      fd.append('mobile', form.mobile || '');
      fd.append('email', form.email || '');
      fd.append('dob', form.dob || '');
      fd.append('gender', form.gender || 'Male');
      fd.append('nic', form.nic || '');
      fd.append('address', form.address || '');
      fd.append('occupation', form.occupation || '');
      if (photoFile) fd.append('photo', photoFile);

      const res = await fetch(`${BACKEND_URL}/api/students`, { 
        method: 'POST', 
        body: fd 
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Registration failed');
      }
      
      const data = await res.json();
      setRegisteredInfo({ email: form.email, nic: form.nic });
      setRegistered(true);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 mt-10 md:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Student Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join our learning community with a seamless registration experience
          </p>
        </div>

        {/* Main Form Container */}
        <div className="relative">
          {registered ? (
            <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Registration Complete</h3>
                <p className="text-gray-600 mb-8">
                  Your account has been created successfully
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Username</div>
                      <div className="font-semibold text-gray-900 text-lg">{registeredInfo.email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Temporary Password</div>
                      <div className="font-mono text-gray-900 text-lg">{registeredInfo.nic}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Proceed to Login
                  </button>
                  <button 
                    onClick={() => setRegistered(false)}
                    className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Register Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-12">
              {/* Profile Photo Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-4">
                    <Camera className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Profile Photo</h3>
                    <p className="text-gray-500">Upload a clear photo for identification</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Photo Preview */}
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-4">
                              <User className="w-20 h-20 text-gray-400" />
                            </div>
                            <p className="text-gray-400 font-medium text-lg">No photo selected</p>
                            <p className="text-gray-400 text-sm mt-2">Upload or capture a photo</p>
                          </div>
                        )}
                      </div>
                      {photoPreview && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-700">Photo ready</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block group cursor-pointer">
                        <div className="p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-lg mb-1">Upload Photo</div>
                              <p className="text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                          </div>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="hidden" 
                        />
                      </label>

                      <button 
                        type="button" 
                        onClick={() => setCameraOpen(true)}
                        className="w-full p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                              <Camera className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-lg">Use Camera</div>
                              <p className="text-blue-100">Take a photo instantly</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </button>
                    </div>

                    {cameraOpen && (
                      <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
                        <div className="bg-gray-900 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-white font-semibold">Live Camera</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-yellow-300" />
                              <span className="text-sm text-gray-300">Look at the camera</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black p-6">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-80 rounded-xl object-cover"
                          />
                        </div>
                        <div className="bg-white p-6 flex gap-4">
                          <button 
                            type="button" 
                            onClick={capturePhoto}
                            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                          >
                            Capture Photo
                          </button>
                          <button 
                            type="button" 
                            onClick={() => { 
                              setCameraOpen(false); 
                              if (streamRef.current) { 
                                streamRef.current.getTracks().forEach(t => t.stop()); 
                              } 
                            }}
                            className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center mr-4">
                    <User className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                    <p className="text-gray-500">Enter your basic details</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: User, label: 'Full Name', key: 'name', placeholder: 'John Doe', required: true },
                    { icon: Phone, label: 'Mobile Number', key: 'mobile', placeholder: '+94 77 123 4567', required: true },
                    { icon: Mail, label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com', required: true },
                    { icon: Calendar, label: 'Date of Birth', key: 'dob', type: 'date', required: true },
                    { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                    { label: 'NIC Number', key: 'nic', placeholder: '123456789V', required: true }
                  ].map((field) => (
                    <div key={field.key} className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        {field.icon && <field.icon className="inline w-4 h-4 mr-2" />}
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={form[field.key]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={form[field.key]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 flex items-center justify-center mr-4">
                    <Briefcase className="w-7 h-7 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Additional Information</h3>
                    <p className="text-gray-500">Tell us more about yourself</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Address
                    </label>
                    <input
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="123 Main Street, City"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      Occupation
                    </label>
                    <input
                      value={form.occupation}
                      onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center">
                      <Lock className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Secure Registration</div>
                      <p className="text-gray-500 text-sm">All data is encrypted and protected</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    {errorMsg && (
                      <div className="px-4 py-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                        {errorMsg}
                      </div>
                    )}
                    
                    <button 
                      disabled={loading}
                      type="submit"
                      className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span>Processing Registration...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Registration</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-center text-gray-500">
                    By registering, you agree to our{' '}
                    <button className="text-blue-600 font-semibold hover:text-blue-700">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-blue-600 font-semibold hover:text-blue-700">Privacy Policy</button>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}