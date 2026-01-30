import React from "react";
import { 
  Target, Eye, Users, Clock, Award, Brain, 
  MessageSquare, Smartphone, TrendingUp, Heart,
  Zap, Shield, Globe, Star, Users2, Sparkles,
  ArrowRight, CheckCircle2, Play
} from "lucide-react";

export default function About() {
  const painPoints = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Limited Practice Time",
      description: "Traditional classes offer only 2-3 hours of weekly interaction, leaving students stuck between classes."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "One-Way Teaching",
      description: "Passive learning where students listen but don't get enough speaking practice to build confidence."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Isolated Learning",
      description: "Students learn alone without peer interaction, missing collaborative growth opportunities."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Theory Over Practice",
      description: "Focus on grammar rules instead of practical communication skills needed in real-life situations."
    }
  ];

  const differentiators = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Activity-Based Learning",
      description: "Every lesson is an interactive experience with games, role-plays, and real-world scenarios that make learning stick.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Behavioral Transformation",
      description: "We don't just teach English—we transform how students think, speak, and interact with the language daily.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "7-Day Learning Journey",
      description: "Continuous engagement through our community app, ensuring daily practice and consistent improvement.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Modern Technology Integration",
      description: "AI-powered feedback, interactive platforms, and cutting-edge tools that make learning engaging and effective.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Young & Innovative Trainers",
      description: "Our passionate instructors use creative, out-of-the-box methods tailored to different learning styles.",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Vibrant Student Community",
      description: "A supportive network where learners interact, collaborate, and grow together beyond classroom walls.",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const stats = [
    { value: "500+", label: "Students Transformed" },
    { value: "99%", label: "Success Rate" },
    { value: "7", label: "Days of Engagement" },
    { value: "24/7", label: "Community Access" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Dark */}
      <section className="relative bg-slate-950 py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 
                        border border-blue-500/30 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
              Redefining English Education
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            We're Not Just Teaching
            <br />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                We're Transforming
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 400 12" fill="none">
                <path d="M2 8.5C100 3 300 3 398 8.5" stroke="url(#underline-gradient)" strokeWidth="4" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="400" y2="0">
                    <stop stopColor="#60A5FA"/>
                    <stop offset="0.5" stopColor="#818CF8"/>
                    <stop offset="1" stopColor="#A78BFA"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            At Global Gate, we understand that mastering English isn't about memorizing rules—it's about 
            creating a lifestyle where the language becomes a natural part of who you are.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 
                              hover:border-blue-500/50 transition-all duration-500">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Light */}
      <section className="relative py-24 bg-gradient-to-b from-white to-slate-50">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-slate-950 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl 
                            transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 border border-slate-200 
                            transform group-hover:-translate-y-1 transition-transform duration-500">
                <div className="flex items-start gap-6 mb-8">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                    <Target className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">Our Mission</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  To democratize English fluency through innovative, continuous learning experiences that 
                  transform passive learners into confident communicators, ready to seize global opportunities.
                </p>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-800 font-medium">Creating confident global citizens</span>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl 
                            transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 border border-slate-200 
                            transform group-hover:-translate-y-1 transition-transform duration-500">
                <div className="flex items-start gap-6 mb-8">
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                    <Eye className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">Our Vision</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  To become Sri Lanka's most transformative English education platform, recognized globally 
                  for pioneering a holistic approach that blends technology, community, and continuous engagement.
                </p>
                <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <span className="text-indigo-800 font-medium">Pioneering educational innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points - Dark */}
      <section className="relative py-24 bg-slate-950 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500"></div>
              <span className="text-red-400 font-semibold uppercase tracking-wider text-sm">The Problem</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We Understand Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"> Challenges</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Traditional English learning methods fail to address the real needs of modern learners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent rounded-2xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 
                              hover:border-red-500/50 transition-all duration-500 h-full">
                  <div className="inline-flex p-3 bg-red-500/10 text-red-400 rounded-xl mb-6 
                                group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-500">
                    {point.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">
                    {point.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference Section - Light with Pattern */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full">
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)"/>
          </svg>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <div className="w-6 h-1 bg-blue-600 rounded-full"></div>
              </div>
              <span className="text-lg font-semibold text-slate-700">How We're Different</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-indigo-600 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Global Gate 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Difference</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're rewriting the rules of English education with a comprehensive approach that works.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 
                         hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 
                         transition-all duration-500"
              >
                {/* Floating Number Badge */}
                <div className="absolute -top-5 left-8">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} 
                                flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="mt-6 mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.color} 
                                text-white group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {item.icon}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    

      {/* Final CTA - Gradient Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <pattern id="cta-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-pattern)"/>
          </svg>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/80 font-semibold text-lg">Join the Transformation</span>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
          </div>
          
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Experience<br />the Difference?
          </h3>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Join hundreds of Sri Lankan students who have transformed their English journey with Global Gate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-10 py-5 bg-white text-indigo-700 font-bold rounded-2xl 
                             hover:bg-slate-100 transition-all duration-300 shadow-2xl shadow-black/20
                             hover:shadow-3xl hover:-translate-y-1">
              <span className="flex items-center justify-center gap-3">
                Start Your Transformation
                <TrendingUp className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 
                             text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/50 
                             transition-all duration-300 hover:-translate-y-1">
              Book a Free Consultation
            </button>
          </div>
          
          
        </div>
      </section>
    </div>
  );
}