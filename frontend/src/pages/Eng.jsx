import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Mic, 
  Bot, 
  Users, 
  Share2, 
  Globe, 
  Download,
  Star,
  CheckCircle,
  Sparkles,
  Smartphone,
  Shield,
  Trophy,
  ArrowRight,
  Play,
  Award,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Globe as Earth
} from 'lucide-react';

const EnglishAppIntroduction = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Practice with learners worldwide through instant messaging',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mic,
      title: 'Voice Practice',
      description: 'Improve pronunciation with AI-powered feedback',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get instant grammar corrections & suggestions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Group Sessions',
      description: 'Join voice calls with multiple learners',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with learners from different countries',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Award,
      title: 'Progress Tracking',
      description: 'Monitor improvement with detailed analytics',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const stats = [
    { value: 'Join First!', label: 'Be a Pioneer', icon: Trophy },
    { value: 'AI Powered', label: 'Smart Learning', icon: Zap },
    { value: 'Free', label: 'for Students', icon: Sparkles },
    { value: 'Global', label: 'Worldwide Access', icon: Earth }
  ];

  const launchOffers = [
    'Free for Global Gate students.',
    'Early access to all new features',
    'Priority support from our team',
    'Exclusive learning materials'
  ];

  const handleDownload = (platform) => {
    if (platform === 'ios') {
      window.open('https://apps.apple.com/app/id123456789', '_blank');
    } else if (platform === 'android') {
      window.open('https://play.google.com/store/apps/details?id=com.englishchat', '_blank');
    } else if (platform === 'web') {
      window.open('#download-web', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Launch Badge */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Launch Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-lg font-semibold mb-6 shadow-lg relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -left-12 top-0 w-24 h-full bg-white/20"
                />
                <Sparkles className="w-5 h-5 relative z-10" />
                <span className="relative z-10">🚀 Just Launched!</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full ml-2 relative z-10"
                />
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Speak English
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Like Never Before
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mt-8 leading-relaxed">
                Be among the first to experience the next generation of language learning. 
                Real conversations, AI-powered feedback, and a global community at your fingertips.
              </p>

              {/* Launch Offers */}
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Launch Exclusive Offers:
                </h3>
                <ul className="space-y-3">
                  {launchOffers.map((offer, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{offer}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Download Buttons - Updated with Web Download */}
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold text-gray-900">Download Now and Start Learning</h3>
                
                {/* App Store & Play Store */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload('ios')}
                    className="group flex-1 flex items-center justify-center gap-4 px-8 py-5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 384 512">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm opacity-90">Download on the</div>
                      <div className="text-xl font-bold">App Store</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload('android')}
                    className="group flex-1 flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm opacity-90">Get it on</div>
                      <div className="text-xl font-bold">Google Play</div>
                    </div>
                  </motion.button>
                </div>

                {/* Web Download Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('web')}
                  className="group w-full flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-90">Download directly from</div>
                    <div className="text-xl font-bold">Our Website</div>
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all" />
                </motion.button>

                <p className="text-sm text-gray-500 text-center">
                  All versions are 100% free • No credit card required
                </p>
              </div>
            </motion.div>

            {/* Right - App Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto">
                {/* Launch Badge */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -left-6 z-10"
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-2xl shadow-2xl">
                    <div className="text-white font-bold text-center">
                      <div className="text-2xl">NEW</div>
                      <div className="text-xs">Just Launched</div>
                    </div>
                  </div>
                </motion.div>

                {/* Phone Mockup */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-[3rem] p-8 shadow-2xl border border-gray-100">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-7 bg-gray-50 rounded-b-3xl border-l border-r border-b border-gray-100"></div>
                  
                  {/* Screen */}
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
                    {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <MessageCircle className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xl">Welcome!</div>
                            <div className="text-white/80 text-sm">You're joining us early</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white/90 text-sm">Launch Day</span>
                        </div>
                      </div>
                    </div>

                    {/* Welcome Content */}
                    <div className="p-6 space-y-6">
                      {/* Welcome Message */}
                      <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to EnglishChat!</h3>
                        <p className="text-gray-600 text-sm">
                          You're among the first to experience our revolutionary language learning platform
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">1st</div>
                          <div className="text-sm text-gray-600">Day Live</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">Free</div>
                          <div className="text-sm text-gray-600">Premium Access</div>
                        </div>
                      </div>

                      {/* Get Started Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg"
                      >
                        Start Learning Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : index === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : index === 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Revolutionary Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">EnglishChat?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience language learning powered by cutting-edge AI and real human connection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ArrowRight className={`w-5 h-5 ${feature.color} opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

     

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default EnglishAppIntroduction;