// AboutGlobal.jsx
import React, { useEffect, useRef, useState } from "react";
import assets from "../assets/images/images";
import { 
  CheckCircle, 
  Globe, 
  Users, 
  Award, 
  Clock, 
  Target, 
  ArrowRight,
  Play,
  Sparkles,
  GraduationCap,
  BookOpen,
  TrendingUp
} from "lucide-react";

export default function AboutGlobal() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { 
      icon: <Globe className="w-5 h-5" />, 
      text: "Island Wide Service",
      description: "Accessible education across the nation"
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      text: "All Ages Welcome",
      description: "No age limits, everyone can learn"
    },
    { 
      icon: <Award className="w-5 h-5" />, 
      text: "100% Success Rate",
      description: "Proven track record of excellence"
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      text: "Flexible Schedule",
      description: "Learn at your own pace"
    },
    { 
      icon: <Target className="w-5 h-5" />, 
      text: "Goal-Oriented",
      description: "Customized learning paths"
    },
  ];

  const keyPoints = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Expert Native Tutors",
      description: "Industry-leading instructors with specialized training methodologies"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Progress Tracking",
      description: "Real-time analytics and personalized feedback on your journey"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Practical Learning",
      description: "Real-world conversation simulations & business English modules"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Flexible Pathways",
      description: "Customized learning paths for career & academic excellence"
    },
  ];

  const stats = [
    { value: "100+", label: "Students Enrolled", icon: <Users className="w-5 h-5" /> },
    { value: "10+", label: "Expert Tutors", icon: <GraduationCap className="w-5 h-5" /> },
    { value: "100+", label: "Course Programs", icon: <BookOpen className="w-5 h-5" /> },
    { value: "100%", label: "Success Rate", icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 via-indigo-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/30 via-cyan-100/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-3 h-3 bg-blue-400/30 rounded-full animate-float" />
        <div className="absolute top-40 right-[15%] w-2 h-2 bg-indigo-400/30 rounded-full animate-float-delayed" />
        <div className="absolute bottom-32 left-[20%] w-4 h-4 bg-emerald-400/20 rounded-full animate-float" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 tracking-wide">About Our Institute</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Transforming Lives Through
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              Quality Education
            </span>
          </h2>
          
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Visual Section */}
          <div 
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {/* Main Card */}
            <div className="relative">
              {/* Background Decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-[2rem] blur-2xl" />
              
              {/* Logo Card */}
              <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-blue-200 rounded-tl-xl opacity-50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-blue-200 rounded-br-xl opacity-50" />
                
                {/* Logo */}
                <div className="relative text-center mb-8">
                  <div className="inline-block relative">
                    <img
                      src={assets.logo2}
                      alt="Global Gate Institute Logo"
                      className="w-48 lg:w-56 mx-auto object-contain"
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl -z-10 scale-150" />
                  </div>
                </div>

                {/* Tagline */}
                <div className="text-center mb-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                    Your Gateway to Excellence
                  </h3>
                  <p className="text-slate-600">
                    Building futures, one student at a time
                  </p>
                </div>

                {/* Mini Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "500+", label: "Enrollment" },
                    { value: "10+", label: "Expert Tutors" },
                    { value: "100%", label: "Success" },
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 lg:-right-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Admissions Open</span>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeFeature === index 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent shadow-lg shadow-blue-500/25' 
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeFeature === index 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      {feature.icon}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      activeFeature === index ? 'text-white' : 'text-slate-700'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Content Section */}
          <div 
            className={`space-y-8 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Heading */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Global Gate
                </span>
                <span className="block text-slate-900 mt-3 text-3xl sm:text-4xl lg:text-5xl">
                  Your Gateway to
                </span>
                <span className="block text-slate-800 text-3xl sm:text-4xl lg:text-5xl">
                  Fluency & Confidence
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
              Where innovation meets education. As a forward-thinking institute, 
              we're redefining language mastery through cutting-edge pedagogy and 
              <span className="text-blue-600 font-medium"> personalized learning journeys</span>.
            </p>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-4">
              {keyPoints.map((point, index) => (
                <div 
                  key={index}
                  className="group p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {point.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {point.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">100+</span> happy students
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">4.9/5</span> rating
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300">
                {/* Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="group flex-1 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                <span className="flex items-center justify-center gap-3">
                  
                  Contact Us <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}