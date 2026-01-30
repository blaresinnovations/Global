import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, Mail, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({
    dataCollection: false,
    dataUsage: false,
    paymentInfo: false,
    cookies: false,
    rights: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'dataCollection',
      title: 'Information We Collect',
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>To provide you with our English language courses and services, we collect:</p>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Personal identification information (name, email, phone number) during registration</li>
            <li>Payment information processed securely through trusted payment gateways</li>
            <li>Course progress and assessment data to personalize your learning experience</li>
            <li>Browsing information including IP address, device type, and browser information</li>
            <li>Communication history when you contact our support team</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dataUsage',
      title: 'How We Use Your Information',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 pl-4 list-disc">
            <li><strong>Course Delivery:</strong> To provide access to purchased courses and track your learning progress</li>
            <li><strong>Payment Processing:</strong> To securely process transactions through our payment partners</li>
            <li><strong>Personalization:</strong> To tailor course recommendations and learning paths based on your progress</li>
            <li><strong>Communication:</strong> To send course updates, reminders, and educational resources</li>
            <li><strong>Improvement:</strong> To enhance our teaching methods and course content</li>
            <li><strong>Security:</strong> To protect against unauthorized access and fraud</li>
          </ul>
        </div>
      )
    },
    {
      id: 'paymentInfo',
      title: 'Payment Information & Security',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Payment Gateway Partners</h4>
            <p className="text-gray-700">We partner with trusted, PCI-DSS compliant payment processors including:</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Payhere Payment Gateway</li>
            </ul>
          </div>
          <p className="text-gray-700">Your payment details are encrypted and processed directly by our payment partners. We do not store your complete credit card information on our servers.</p>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600"><strong>Note:</strong> All payment transactions are protected by SSL encryption and comply with international security standards.</p>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking Technologies',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>We use cookies and similar technologies to enhance your learning experience:</p>
          <div className="grid gap-3 md:grid-cols-2 mt-3">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-800">Essential Cookies</h5>
              <p className="text-sm text-gray-600 mt-1">Required for course access, login sessions, and payment processing</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-800">Analytics Cookies</h5>
              <p className="text-sm text-gray-600 mt-1">Help us understand how you use our platform to improve course delivery</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-800">Preference Cookies</h5>
              <p className="text-sm text-gray-600 mt-1">Remember your language preferences and course settings</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-800">Marketing Cookies</h5>
              <p className="text-sm text-gray-600 mt-1">Used to show relevant course recommendations</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">You can control cookie settings through your browser, but some features may not function properly.</p>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights & Choices',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>You have the right to:</p>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data (subject to legal obligations)</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your learning progress and course data</li>
            <li>Withdraw consent for data processing where applicable</li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Contact Our Privacy Team</h4>
            <p className="text-gray-700">For privacy-related requests or questions:</p>
            <p className="text-blue-600 font-medium mt-1">privacy@globalgateinstitute.com</p>
            <p className="text-sm text-gray-600 mt-2">We respond to all inquiries within 7 business days.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with brand styling */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-15">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Global Gate Institute, we are committed to protecting your privacy and ensuring the security of your personal information while you learn English with us.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              As an online English language learning platform, we understand the importance of protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security for all student data</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-600">PCI-DSS compliant payment processing</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Standards</h3>
                <p className="text-sm text-gray-600">Compliant with international data protection laws</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections[section.id] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedSections[section.id] ? 'auto' : 0,
                    opacity: expandedSections[section.id] ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    {section.content}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Data Retention</h4>
                <p className="text-gray-700">
                  We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, and improve our educational offerings.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Policy Updates</h4>
                <p className="text-gray-700">
                  We may update this policy periodically. Significant changes will be communicated via email or through platform notifications.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Need Help?</h4>
                  <p className="text-gray-700">Contact our Data Protection Officer for any privacy concerns.</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Contact Privacy Team
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-500 text-sm pt-8 border-t border-gray-100"
          >
            <p>© {new Date().getFullYear()} Global Gate Institute. All rights reserved.</p>
            <p className="mt-2">This Privacy Policy is compliant with GDPR, CCPA, and other international data protection regulations.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;