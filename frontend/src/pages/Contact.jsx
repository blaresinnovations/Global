import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Facebook, Twitter, Instagram, Linkedin, Globe, CheckCircle, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: '', // Contact form doesn't have phone, but API requires it
          message: `Subject: ${formData.subject}\n\n${formData.message}`
        })
      });

      if (response.ok) {
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Address',
      details: ['info@globalgate.lk'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+94 773 329 211'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['+94 773 329 211'],
      color: 'from-green-600 to-green-400'
    },
   
  ];

  const normalizePhone = (s) => (s || '').toString().replace(/[^0-9]/g, '');
  const mapSrc = 'https://www.google.com/maps?q=226/1,+Wendesiwatta,+Mabima+Road,+Heiyanthuduwa,+11618&output=embed';

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#', color: 'hover:bg-blue-600 hover:text-white' },
    { icon: Twitter, label: 'Twitter', url: '#', color: 'hover:bg-sky-500 hover:text-white' },
    { icon: Instagram, label: 'Instagram', url: '#', color: 'hover:bg-pink-600 hover:text-white' },
    { icon: Linkedin, label: 'LinkedIn', url: '#', color: 'hover:bg-blue-700 hover:text-white' },
    { icon: MessageCircle, label: 'WhatsApp', url: '#', color: 'hover:bg-green-500 hover:text-white' }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse animation-delay-2s"></div>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rounded-lg transform rotate-45"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full mb-6 backdrop-blur">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-semibold text-sm">We're Here to Help</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We're here to help you succeed. Reach out with any questions or inquiries, and we'll get back to you promptly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Contact Information Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Contact Information
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple ways to connect with us. We're always ready to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((item, index) => {
              const firstDetail = item.details[0] || '';
              const link = item.title === 'Email Address'
                ? `mailto:${firstDetail}`
                : item.title === 'Phone Numbers'
                ? `tel:+${normalizePhone(firstDetail)}`
                : item.title === 'WhatsApp'
                ? `https://wa.me/${normalizePhone(firstDetail)}`
                : null;
              const isExternal = item.title === 'WhatsApp';

              return (
                <a
                  key={index}
                  href={link || '#'}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8 flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-125 transition-transform duration-500 shadow-lg group-hover:shadow-xl mb-6`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">{item.title}</h3>
                    
                    <div className="space-y-2 flex-1">
                      {item.details.map((detail, idx) => {
                        if (item.title === 'Email Address') {
                          return (
                            <p key={idx} className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              <a href={`mailto:${detail}`} className="hover:underline font-medium hover:text-blue-600">{detail}</a>
                            </p>
                          );
                        }

                        if (item.title === 'Phone Numbers') {
                          const tel = `+${normalizePhone(detail)}`;
                          return (
                            <p key={idx} className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              <a href={`tel:${tel}`} className="hover:underline font-medium hover:text-blue-600">{detail}</a>
                            </p>
                          );
                        }

                        if (item.title === 'WhatsApp') {
                          const wa = normalizePhone(detail);
                          return (
                            <p key={idx} className="text-gray-600 group-hover:text-gray-900 transition-colors">
                              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium hover:text-green-600">{detail}</a>
                            </p>
                          );
                        }

                        return <p key={idx} className="text-gray-600 group-hover:text-gray-900 transition-colors">{detail}</p>;
                      })}
                    </div>
                    
                    {item.title === 'WhatsApp' && (
                      <a
                        href={`https://wa.me/${normalizePhone(item.details[0])}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Message
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    
                    <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-gradient-to-b from-blue-600 to-indigo-600 transition-all duration-500"></div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Map and Form Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Map and Social */}
          

          {/* Right Column - Inquiry Form */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all">
            <div className="mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <Send className="w-8 h-8 text-blue-600" />
                Send Message
              </h3>
              <p className="text-gray-600 text-lg">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-3">Message Sent!</h4>
                <p className="text-gray-600 text-lg mb-10">
                  Thank you for contacting us. We'll respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-800">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-blue-50 border-2 rounded-xl transition-all duration-300 outline-none font-medium ${focusedField === 'name' ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="John Doe"
                      />
                      {focusedField === 'name' && <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600"><Sparkles className="w-5 h-5" /></div>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-800">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-blue-50 border-2 rounded-xl transition-all duration-300 outline-none font-medium ${focusedField === 'email' ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="john@example.com"
                      />
                      {focusedField === 'email' && <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600"><Mail className="w-5 h-5" /></div>}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-800">
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-blue-50 border-2 rounded-xl transition-all duration-300 outline-none font-medium ${focusedField === 'subject' ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-800">
                    Your Message *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={6}
                      className={`w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-blue-50 border-2 rounded-xl transition-all duration-300 outline-none font-medium resize-none ${focusedField === 'message' ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                  <div className="text-sm text-gray-500 font-medium">
                    * Required fields
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 border border-blue-200 shadow-lg">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          
          <div className="relative text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 relative">
            {[
              { icon: Clock, q: "What are your operating hours?", a: "Monday to Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM" },
              { icon: Globe, q: "Do you offer online consultations?", a: "Yes, we offer virtual consultations via Zoom or Google Meet" },
              { icon: Send, q: "How long does it take to get a response?", a: "We typically respond within 1-2 hours during business hours" },
              { icon: MapPin, q: "Is there parking available?", a: "Yes, we have dedicated parking for visitors at our location" },
            ].map((faq, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-md hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <faq.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">{faq.q}</h4>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2s {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}