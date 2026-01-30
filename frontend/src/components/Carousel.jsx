import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import assets from '../assets/images/images';

const PremiumCarousel = ({ 
  slides = [], 
  autoPlay = true, 
  interval = 7000,
  showIndicators = true,
  showControls = true,
  instituteName = "Excellence Academy",
  instituteTagline = "Shaping Future Leaders"
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  // Institute-focused slides
  const defaultSlides = [
    {
      id: 1,
      image: assets.caro1,
      title: 'Your Educational Journey Begins',
      subtitle: 'Welcome to Global Gate',
      description: 'A institute dedicated to providing quality education with modern teaching methods, experienced faculty, and a commitment to student success.',
      highlights: ['Modern Curriculum', 'Experienced Faculty', 'Industry-Focused Programs'],
      cta: 'Explore Programs',
      ctaLink: '/programs',
      secondaryCta: 'Enquire Now',
      secondaryCtaLink: '/contact',
      stats: { value: 'NEW', label: 'Fresh Start - Enroll Now' }
    },
    {
      id: 2,
      image: assets.caro2,
      title: 'Learn from Qualified Instructors',
      subtitle: 'Expert Faculty Members',
      description: 'Our faculty members are carefully selected professionals with strong academic credentials and industry experience, ready to mentor the next generation.',
      highlights: ['Qualified Educators', 'Industry Experience', 'Student-Focused Teaching'],
      cta: 'Meet Our Faculty',
      ctaLink: '/faculty',
      secondaryCta: 'Our Vision',
      secondaryCtaLink: '/about',
      stats: { value: 'READY', label: 'To Teach & Guide You' }
    },
    {
      id: 3,
      image: assets.caro3,
      title: 'Modern Learning Environment',
      subtitle: 'State-of-the-Art Facilities',
      description: 'Equipped with modern classrooms, computer labs, and library facilities designed to create an optimal learning experience for all students.',
      highlights: ['Smart Classrooms', 'Computer Labs', 'Digital Resources'],
      cta: 'View Facilities',
      ctaLink: '/facilities',
      secondaryCta: 'Campus Info',
      secondaryCtaLink: '/about',
      stats: { value: 'OPEN', label: 'Admissions Now' }
    },
    {
      id: 4,
      image: assets.caro1,
      title: 'Build Your Future Today',
      subtitle: 'Quality Education & Growth',
      description: 'Starting your education journey with us means joining a community committed to excellence, personal growth, and preparing you for a successful career.',
      highlights: ['Career Preparation', 'Skill Development', 'Personal Growth'],
      cta: 'Enroll Now',
      ctaLink: '/contact',
      secondaryCta: 'Course Details',
      secondaryCtaLink: '/courses',
      stats: { value: 'START', label: 'Your Success Story' }
    }
  ];

  const displaySlides = slides.length > 0 ? slides : defaultSlides;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    setProgress(0);
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    setProgress(0);
  }, [displaySlides.length]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0);
  };

  // Progress animation
  useEffect(() => {
    if (!isPlaying || displaySlides.length <= 1 || isHovered) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (interval / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isPlaying, nextSlide, interval, displaySlides.length, isHovered, currentSlide]);

  const currentSlideData = displaySlides[currentSlide];

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-slate-900 overflow-hidden mt-0"
      style={{ height: 'clamp(600px, calc(100vh - 80px), 850px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Carousel */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlideData.image})` }}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: "linear" }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-2xl"
                >
                  {/* Institute Badge */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                      <GraduationCap className="w-5 h-5 text-amber-500" />
                      <span className="text-amber-500 font-medium text-sm tracking-wide">
                        {currentSlideData.subtitle}
                      </span>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1 
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  >
                    {currentSlideData.title}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl"
                  >
                    {currentSlideData.description}
                  </motion.p>

                  {/* Highlights */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-wrap gap-3 mb-8"
                  >
                    {currentSlideData.highlights.map((highlight, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-white text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = currentSlideData.ctaLink}
                      className="group flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/25"
                    >
                      <span>{currentSlideData.cta}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = currentSlideData.secondaryCtaLink}
                      className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300"
                    >
                      <span>{currentSlideData.secondaryCta}</span>
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Right Side - Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="hidden lg:flex justify-end"
                >
                  <div className="relative">
                    {/* Main Stats Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-80">
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring" }}
                          className="text-6xl font-bold text-white mb-2"
                        >
                          {currentSlideData.stats.value}
                        </motion.div>
                        <div className="text-slate-300 font-medium">
                          {currentSlideData.stats.label}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        {[
                          { icon: Users, label: 'Admissions Open', value: 'Now' },
                          { icon: BookOpen, label: 'Programs', value: '5+' },
                          { icon: Trophy, label: 'Quality Focused', value: 'Yes' }
                        ].map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-amber-500" />
                              </div>
                              <span className="text-slate-300 text-sm">{stat.label}</span>
                            </div>
                            <span className="text-white font-semibold">{stat.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-4 -right-4 bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        <span>New Institute</span>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Quality Focused</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showControls && displaySlides.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* Play/Pause */}
      {autoPlay && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 lg:top-8 right-4 lg:right-8 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </motion.button>
      )}

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Progress Bar */}
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full bg-amber-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom Content */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              
              {/* Slide Indicators */}
              {showIndicators && (
                <div className="flex items-center gap-3">
                  {displaySlides.map((slide, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="group relative"
                    >
                      <div className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/40'
                      }`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Info */}
              <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Mon - Fri: 9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Global Gate Campus</span>
                </div>
              </div>

              {/* Slide Counter */}
              <div className="flex items-center gap-2 text-white">
                <span className="text-2xl font-bold text-amber-500">
                  {String(currentSlide + 1).padStart(2, '0')}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">
                  {String(displaySlides.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="lg:hidden absolute bottom-24 left-4 right-4"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">{currentSlideData.stats.value}</div>
              <div className="text-slate-300 text-sm">{currentSlideData.stats.label}</div>
            </div>
            <div className="flex gap-2">
              {[
                { icon: Users, value: 'Open' },
                { icon: BookOpen, value: '5+' },
                { icon: Trophy, value: 'Best' }
              ].map((stat, index) => (
                <div key={index} className="w-12 h-12 bg-amber-500/10 rounded-lg flex flex-col items-center justify-center">
                  <stat.icon className="w-4 h-4 text-amber-500" />
                  <span className="text-white text-xs font-semibold mt-0.5">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumCarousel;