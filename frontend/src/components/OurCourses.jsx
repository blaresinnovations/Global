import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, User, ArrowRight, Star, Clock, Users, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }
  
  .shimmer-text {
    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 25%, #2563eb 50%, #4f46e5 75%, #2563eb 100%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  
  .card-glow {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-glow:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(37, 99, 235, 0.15);
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(45deg, #1a1f2e, #222839) padding-box,
                linear-gradient(45deg, #2563eb, #4f46e5) border-box;
    border: 2px solid transparent;
  }
  
  .particle {
    position: absolute;
    background: radial-gradient(circle at center, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}

export default function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Add particle effect on card hover
  useEffect(() => {
    const createParticles = (x, y) => {
      const particles = [];
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 60 + 30;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x - size/2}px`;
        particle.style.top = `${y - size/2}px`;
        particle.style.opacity = '0';
        document.body.appendChild(particle);
        
        // Animate
        particle.animate([
          { opacity: 0.5, transform: 'scale(0.8)' },
          { opacity: 0, transform: 'scale(1.5)' }
        ], {
          duration: 800,
          easing: 'ease-out'
        }).onfinish = () => particle.remove();
        
        particles.push(particle);
      }
    };

    const handleMouseMove = (e) => {
      if (hoveredCard !== null) {
        createParticles(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredCard]);

  const DISPLAY_LIMIT = 9;
  const displayCourses = courses.slice(0, DISPLAY_LIMIT);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (!mounted) return;
        setCourses(Array.isArray(data) ? data.map(c => ({
          ...c,
          is_seminar: !!Number(c.is_seminar),
          meeting_link: c.meeting_link || null,
          early_bird_price: c.early_bird_price || null,
          duration: c.duration || '8 weeks',
          students: c.students || Math.floor(Math.random() * 500) + 100,
          rating: c.rating || (Math.random() * 0.5 + 4.5).toFixed(1)
        })) : []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load courses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="h-12 w-64 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 w-96 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg mx-auto animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-red-900/20 to-red-800/20 backdrop-blur-xl rounded-2xl border border-red-800/30">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <p className="text-red-300 font-medium text-lg">Unable to load courses at the moment</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex flex-col items-center p-12 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl rounded-3xl border border-blue-500/20">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center mb-4 float-animation">
                  <Sparkles className="w-12 h-12 text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" fill="white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">Premium Courses Coming Soon</h3>
              <p className="text-gray-400 max-w-md">Our expert-led courses are being meticulously crafted for your success</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-radial from-blue-500/3 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50/10 backdrop-blur-xl rounded-full mb-8 border border-blue-500/30">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-widest">
              Elite Programs
            </span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Master English
            </span>
            <br />
            <span className="shimmer-text">For Global Success</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Transformative English programs crafted by Sri Lanka's finest educators, designed to unlock international opportunities
          </p>
        </div>

        {/* Courses Grid */}
        <div ref={containerRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course, idx) => (
              <div
                key={`${course.id}-${idx}`}
                className="relative group"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent 
                                rounded-2xl blur-xl transition-all duration-500
                                ${hoveredCard === idx ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
                
                <div className={`relative h-full gradient-border rounded-2xl overflow-hidden
                                card-glow backdrop-blur-sm bg-gradient-to-br from-slate-800/40 to-slate-900/40
                                ${hoveredCard === idx ? 'border-opacity-100' : 'border-opacity-30'}`}>
                  
                  {/* Course Image */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
                    {course.banner_path ? (
                      <img
                        src={course.banner_path && course.banner_path.startsWith('http') 
                          ? course.banner_path 
                          : `${BACKEND_URL}${course.banner_path && course.banner_path.startsWith('/') 
                              ? course.banner_path 
                              : (course.banner_path ? `/CourseImage/${course.banner_path}` : '')}`}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="relative">
                          <div className="text-6xl font-bold text-gray-700">EN</div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
                        </div>
                      </div>
                    )}

                    {/* Price Tag (moved to top-right to match Courses.jsx) */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm rounded-full border border-gray-700">
                        {course.early_bird_price && parseFloat(course.early_bird_price) > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-orange-300">EARLY: LKR {parseFloat(course.early_bird_price).toLocaleString()}</span>
                            <span className="text-sm font-semibold line-through text-slate-400">LKR {(() => { const f = parseFloat(course.fee); return isNaN(f) ? (course.fee || '0') : f.toLocaleString(); })()}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-gray-200">
                            {(() => {
                              const feeNum = parseFloat(course.fee);
                              return feeNum === 0 ? 'FREE ENROLLMENT' : `LKR ${feeNum.toLocaleString()}`;
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-5">
                    {/* Early Bird Badge */}
                    {course.early_bird_price && parseFloat(course.early_bird_price) > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-900/60 to-red-900/60 backdrop-blur-sm rounded-full border border-orange-500/30">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span className="text-xs font-bold text-orange-300 uppercase tracking-widest">Early Bird Offer</span>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {course.name}
                      </h3>
                      
                      {/* Lecturer Info with Profile Photo */}
                      <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border border-slate-600">
                          {course.lecturer_photo ? (
                            <img
                              src={course.lecturer_photo && course.lecturer_photo.startsWith('http') 
                                ? course.lecturer_photo 
                                : `${BACKEND_URL}${course.lecturer_photo && course.lecturer_photo.startsWith('/') 
                                    ? course.lecturer_photo 
                                    : (course.lecturer_photo ? `/LecturerImage/${course.lecturer_photo}` : '')}`}
                              alt={course.lecturer_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Instructor</p>
                          <p className="text-sm font-semibold text-white truncate">{course.lecturer_name || 'Expert Instructor'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Course Dates */}
                    <div className="space-y-2 text-sm">
                      {course.start_date && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span>Starts: <span className="font-semibold">{new Date(course.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
                        </div>
                      )}
                      {course.end_date && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span>Ends: <span className="font-semibold">{new Date(course.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {course.description}
                    </p>

                    <button
                      onClick={() => {
                        if (course.is_seminar && course.meeting_link) {
                          try { window.open(course.meeting_link, '_blank'); return; } catch (e) { /* fallback */ }
                        }
                        navigate(`/register?courseId=${course.id}`);
                      }}
                      className="group/btn w-full flex items-center justify-center gap-3 
                               px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 
                               text-white font-semibold rounded-xl
                               hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 
                               transform transition-all duration-300 hover:scale-[1.02]
                               shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                    >
                      <span>{course.is_seminar ? 'Join Seminar' : 'Enroll Now'}</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length > DISPLAY_LIMIT && (
            <div className="text-center mt-16">
              <button
                onClick={() => navigate('/courses')}
                className="group inline-flex items-center gap-3 px-8 py-4 
                         bg-gradient-to-r from-slate-800 to-slate-900 
                         text-slate-200 font-semibold text-lg
                         rounded-xl border-2 border-slate-700 
                         hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-indigo-900/20
                         transition-all duration-300 hover:scale-105
                         shadow-lg hover:shadow-blue-500/20"
              >
                Explore All Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </div>

      
      </div>
    </section>
  );
}