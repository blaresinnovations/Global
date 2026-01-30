import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, BookOpen, CreditCard, Truck, Shield, AlertCircle, User, Globe, Lock, Clock } from 'lucide-react';

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [checkedSections, setCheckedSections] = useState([]);

  const toggleCheck = (sectionId) => {
    setCheckedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <Check className="w-5 h-5" />,
      color: 'blue',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">By accessing and using Global Gate Institute's platform, you agree to be bound by these Terms & Conditions and our Privacy Policy.</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Important Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You must be at least 16 years old to create an account and enroll in our courses. If you are under 16, a parent or guardian must create the account on your behalf.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'account',
      title: 'Account Registration',
      icon: <User className="w-5 h-5" />,
      color: 'indigo',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">To access our English language courses, you must create an account with accurate and complete information.</p>
          <ul className="space-y-3 pl-4 list-disc">
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must notify us immediately of any unauthorized account access</li>
            <li>One account per student is allowed unless otherwise authorized</li>
            <li>We reserve the right to suspend or terminate duplicate or fraudulent accounts</li>
          </ul>
        </div>
      )
    },
    {
      id: 'courses',
      title: 'Course Enrollment & Access',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'purple',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Course Access Period</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <Clock className="w-6 h-6 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900">Standard Courses</p>
                <p className="text-sm text-gray-600 mt-1">365 days from enrollment</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <Clock className="w-6 h-6 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900">Live Classes</p>
                <p className="text-sm text-gray-600 mt-1">Access to recordings for 180 days</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <Clock className="w-6 h-6 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900">Subscription Plans</p>
                <p className="text-sm text-gray-600 mt-1">Active while subscription is valid</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Course Content Rights</h4>
            <p className="text-sm text-purple-700">
              All course materials, videos, exercises, and assessments are the intellectual property of Global Gate Institute. You may not redistribute, resell, or share course content with others.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'green',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment Processing</h4>
            <p className="text-gray-700 mb-4">We partner with secure, PCI-DSS compliant payment gateways:</p>
            <div className="flex flex-wrap gap-3">
              {['Payhere Payment Gateway'].map((gateway, index) => (
                <div key={index} className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{gateway}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Refund Policy</h4>
            <div className="grid gap-3">
              
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="font-medium text-red-800">Non-Refundable</span>
                </div>
                <p className="text-sm text-red-700">Digital certificates, assessment fees, and completed courses (over 80%) are non-refundable.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'conduct',
      title: 'Student Conduct',
      icon: <Shield className="w-5 h-5" />,
      color: 'orange',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">To maintain a positive learning environment, we require all students to:</p>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Respect instructors and fellow students in all interactions</li>
            <li>Not share account access or course materials</li>
            <li>Not attempt to hack, disrupt, or overload our platform</li>
            <li>Use appropriate language in discussions and communications</li>
            <li>Not use automated tools to complete courses or assessments</li>
          </ul>
          
          <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Consequences of Violation</h4>
            <p className="text-sm text-orange-700">
              Violation of conduct rules may result in suspension of account access, removal from courses without refund, or permanent termination of your account.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Globe className="w-5 h-5" />,
      color: 'gray',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Availability</h4>
            <p className="text-gray-700">
              While we strive for 99.9% uptime, we do not guarantee uninterrupted access to our platform. Scheduled maintenance and unforeseen technical issues may cause temporary unavailability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-900 mb-2">Technical Requirements</h5>
              <p className="text-sm text-gray-600">
                You are responsible for ensuring your device and internet connection meet the minimum requirements for accessing our courses.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h5 className="font-medium text-gray-900 mb-2">Learning Outcomes</h5>
              <p className="text-sm text-gray-600">
                Course completion and English proficiency improvement depend on your individual effort and engagement with the material.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-600">
              <strong>Disclaimer:</strong> Global Gate Institute shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform or courses.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination & Changes',
      icon: <Lock className="w-5 h-5" />,
      color: 'red',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We reserve the right to:</p>
          <ul className="space-y-2 pl-4 list-disc">
            <li>Modify these Terms & Conditions at any time</li>
            <li>Update course content, pricing, or features</li>
            <li>Suspend or terminate accounts for violations</li>
            <li>Discontinue courses or services</li>
          </ul>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Notification of Changes</h4>
            <p className="text-sm text-gray-600">
              We will notify users of significant changes to these terms via email or platform notifications. Continued use of our services after changes constitutes acceptance.
            </p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-20 sm:mt-20">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to Global Gate Institute. These terms govern your use of our English language learning platform. Please read them carefully.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-${section.color}-50 to-${section.color}-100 text-${section.color}-600`}>
                        {section.icon}
                      </div>
                      <span className="font-medium text-gray-900 text-left">{section.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {checkedSections.includes(section.id) && (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Acceptance Checkbox */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleCheck('all')}
                    className={`mt-1 flex items-center justify-center w-5 h-5 rounded border ${
                      checkedSections.length === sections.length
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {checkedSections.length === sections.length && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div>
                    <p className="font-medium text-gray-900">I have read and understood all terms</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {checkedSections.length} of {sections.length} sections reviewed
                    </p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(checkedSections.length / sections.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:w-2/3"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Introduction */}
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Global Gate Institute</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms & Conditions form a legally binding agreement between you and Global Gate Institute regarding your use of our online English language learning platform, courses, and services.
                </p>
                <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Global Coverage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Student Protection</span>
                  </div>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="divide-y divide-gray-100">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-8 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-${section.color}-50 to-${section.color}-100`}>
                          <div className={`text-${section.color}-600`}>
                            {section.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Section {index + 1} of {sections.length}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCheck(section.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                          checkedSections.includes(section.id)
                            ? 'bg-green-100 border-green-200 text-green-600'
                            : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {checkedSections.includes(section.id) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm">Mark as read</span>
                        )}
                      </button>
                    </div>
                    
                    {section.content}
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Questions or Concerns?</h3>
                    <p className="text-gray-700">
                      Our support team is here to help you understand these terms.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Contact Support
                    </button>
                    <p className="text-sm text-gray-600 text-center md:text-right">
                      support@globalgateinstitute.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Important Legal Note</h4>
                  <p className="text-sm text-gray-600">
                    These Terms & Conditions constitute the entire agreement between you and Global Gate Institute. 
                    If any provision is found invalid, the remaining provisions will continue in effect. 
                    These terms are governed by international commercial laws and dispute resolution procedures.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Global Gate Institute. All rights reserved.</p>
              <p className="mt-2">Version 2.1 • Effective from {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsConditions;