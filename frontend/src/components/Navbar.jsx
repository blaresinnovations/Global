import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import assets from '../assets/images/images';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopVisible, setIsTopVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const mobileMenuRef = useRef(null);

  // Handle scroll with smooth performance
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          if (window.scrollY > 100 && window.scrollY > lastScrollY) {
            setIsTopVisible(false);
          } else {
            setIsTopVisible(true);
          }

          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigateTo = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Inquiries', path: '/inquiries' },
    { label: 'Register', path: '/register' },
    { label: 'App', path: '/app' },
    { label: 'Contact', path: '/contact' }
  ];

  const socialLinks = [
    { href: "https://web.facebook.com/profile.php?id=100095526422233", icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z", name: "Facebook" },
    { href: "https://twitter.com", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84", name: "Twitter" },
    { href: "https://instagram.com", icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z", name: "Instagram" },
    { href: "https://linkedin.com", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z", name: "LinkedIn" }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Premium Top Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ease-out transform ${
          isTopVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } hidden lg:block`}
      >
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Animated Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
          
          {/* Top Accent Line */}
          <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
          
          <div className="container mx-auto px-6 xl:px-8">
            <div className="flex justify-between items-center h-11">
              {/* Contact Information */}
              <div className="flex items-center divide-x divide-slate-700/50">
                {/* Phone */}
                <a 
                  href="tel:+94773329211" 
                  className="group flex items-center gap-2.5 pr-5 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300 ring-1 ring-blue-500/20">
                    <svg className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium tracking-wide">077 332 9211</span>
                </a>
                
                {/* Email */}
                <a 
                  href="mailto:info@globalgate.lk" 
                  className="group flex items-center gap-2.5 px-5 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-300 ring-1 ring-emerald-500/20">
                    <svg className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium tracking-wide">info@globalgate.lk</span>
                </a>
                
                {/* Working Hours */}
                <div className="flex items-center gap-2.5 pl-5 text-slate-300">
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium tracking-wide">Mon - Sat: 9:00 AM - 8:00 PM</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-1">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white transition-all duration-300 hover:bg-white/10"
                    aria-label={social.name}
                  >
                    <svg 
                      className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`fixed left-0 right-0 z-[100] transition-all duration-500 ease-out ${
          isScrolled 
            ? 'top-0 bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100' 
            : 'lg:top-[44px] top-0 bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group relative" 
              onClick={() => navigateTo('/')}
            >
              <div className="relative">
                <img
                  src={assets.logo2}
                  alt="Global Gate Institute"
                  className="h-14 lg:h-16 w-auto transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiMwQTE0MjgiLz48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0Q0QUYzNyI+R0xPQkFMIEdBVEU8L3RleHQ+PC9zdmc+';
                  }}
                />
                {/* Logo Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {/* Nav Items Container */}
              <div className="relative flex items-center bg-slate-50/80 rounded-2xl p-1.5 mr-4">
                {navItems.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => navigateTo(item.path)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {/* Active Background */}
                    {isActive(item.path) && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300" />
                    )}
                    
                    {/* Hover Background */}
                    {hoveredIndex === index && !isActive(item.path) && (
                      <span className="absolute inset-0 bg-white rounded-xl shadow-sm transition-all duration-300" />
                    )}
                    
                    {/* Label */}
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active Dot Indicator */}
                    {isActive(item.path) && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Login Button */}
              <button
                onClick={() => navigateTo('/login')}
                className="group relative px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {/* Button Content */}
                <span className="relative flex items-center gap-2">
                  <span>Login</span>
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Mobile Menu Controls */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Login Button */}
              <button
                onClick={() => navigateTo('/login')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-300"
              >
                Login
              </button>
              
              {/* Hamburger Button */}
              <button
                className="mobile-menu-button relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span 
                    className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                    }`} 
                  />
                  <span 
                    className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0 translate-x-3' : ''
                    }`} 
                  />
                  <span 
                    className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 ease-out ${
            isMobileMenuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-4'
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div 
            ref={mobileMenuRef}
            className="relative mx-4 mt-2 bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden"
          >
            {/* Menu Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
            </div>
            
            {/* Menu Items */}
            <div className="p-3">
              {navItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: isMobileMenuOpen ? 'slideIn 0.3s ease forwards' : 'none'
                  }}
                >
                  <span>{item.label}</span>
                  {isActive(item.path) ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Menu Footer */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" className="animate-pulse" />
                  </svg>
                  <span>We're open now</span>
                </div>
                <a href="tel:+94779504951" className="text-blue-600 font-medium hover:underline">
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className={`transition-all duration-500 ${
        isScrolled ? 'h-16 lg:h-20' : 'h-16 lg:h-[124px]'
      }`} />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;