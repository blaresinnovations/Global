
import React from 'react';
import assets from '../assets/images/images';
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Twitter, label: 'Twitter', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Linkedin, label: 'LinkedIn', url: '#' },
    { icon: MessageCircle, label: 'WhatsApp', url: 'https://wa.me/0773329211' }
  ];
  return (
    <footer className="bg-[#0A1428] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Logo, Description & Social Links */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src={assets.logo} 
                alt="Lanka Spa Association" 
                className="h-25 w-auto mb-4"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiMwQTE0MjgiLz48dGV4dCB4PSIxMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0Q0QUYzNyI+TEFOS0EgU1BBIEFTU09DLjwvdGV4dD48L3N2Zz4=';
                }}
              />
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                The Global Gate is the premier institute dedicated to promoting excellence, 
                standards, and professionalism in Sri Lanka's Educational industry.
              </p>
            </div>
            
            <div className="flex space-x-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gold-500 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-gold-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/home" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Home</span>
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Courses</span>
                </a>
              </li>
              <li>
                <a href="/app" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">App</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gold-500 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-gold-500">
              Important Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/inquiries" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Inquiries</span>
                </a>
              </li>
              <li>
                <a href="registration" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Registration</span>
                </a>
              </li>
              <li>
                <a href="/Contact" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-gold-500 transition-all duration-300 flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gold-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Login</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gold-500 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-gold-500">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300"><a href="tel:+94773329211">077 332 9211</a></span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300"><a href="mailto:globalgate25.lk@gmail.com">globalgate25.lk@gmail.com</a></span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300"><a href="https://maps.app.goo.gl/P6rbmthR8cGtt8zD6">NO. 120, Rajagiriya Road, Rajagiriya, postcode: 10107</a></span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300">Mon - Sat: 8:30 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} <a href="https://www.blaresinnovations.com">Blares Innovations</a>. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-gold-500 text-sm transition-all duration-300 hover:translate-x-1">
                Privacy Policy
              </a>
              <a href="/return" className="text-gray-400 hover:text-gold-500 text-sm transition-all duration-300 hover:translate-x-1">
                Refund Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-gold-500 text-sm transition-all duration-300 hover:translate-x-1">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-gray-400 hover:text-gold-500 text-sm transition-all duration-300 hover:translate-x-1">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
