import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RotateCcw, Package, AlertCircle, Clock, DollarSign, Mail, CreditCard, Zap, Globe } from 'lucide-react';

const Return = () => {
  const [activeSection, setActiveSection] = useState('digital');
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
      id: 'digital',
      title: 'Digital Nature of Products',
      icon: <Package className="w-5 h-5" />,
      color: 'blue',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            All courses offered by Global Gate are digital online courses delivered electronically. Once access to the course has been granted, the product is considered delivered.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Instant Delivery</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Upon successful payment and account creation, your course access is immediately activated and can be accessed 24/7 from any device with internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'eligibility',
      title: 'Refund Eligibility',
      icon: <Check className="w-5 h-5" />,
      color: 'green',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We offer refunds under the following conditions:</p>
          <div className="grid gap-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-green-900">Time Limit</h5>
                  <p className="text-sm text-green-700">A refund request must be submitted within 2 days from the date of purchase.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-green-900">Content Access Limit</h5>
                  <p className="text-sm text-green-700">If you have attended one lecture, you are not eligible for a refund.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-green-900">Valid Reason Required</h5>
                  <p className="text-sm text-green-700">A valid reason for the refund request must be provided.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-red-900">After 2 Days</h5>
                  <p className="text-sm text-red-700">Refund requests submitted after 2 days of purchase will not be eligible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nonrefundable',
      title: 'Non-Refundable Situations',
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'red',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Refunds will not be issued in the following cases:</p>
          <div className="space-y-3 pl-4 list-disc">
            <div className="flex items-start space-x-3">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700">If you have attended one or more lectures, you are not eligible for a refund.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700">Course materials (downloadable resources, templates, or bonus materials) have been downloaded.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700">The purchase was made during a special promotion, discount, or limited-time offer (unless otherwise stated).</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700">Change of mind after full access has been granted.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700">Failure to complete the course.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: <Zap className="w-5 h-5" />,
      color: 'yellow',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If you experience technical difficulties accessing your course, please contact our support team immediately. We will make every reasonable effort to resolve the issue before considering a refund.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="font-semibold text-yellow-900 mb-3">Steps to Take:</h4>
            <ol className="space-y-2 text-sm text-yellow-800">
              <li>1. Clear your browser cache and cookies</li>
              <li>2. Try accessing the course from a different device</li>
              <li>3. Use a different web browser</li>
              <li>4. Check your internet connection stability</li>
              <li>5. Contact support if the issue persists</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'duplicate',
      title: 'Duplicate or Accidental Payments',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'indigo',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If you are charged twice or make an accidental duplicate payment, please contact us within 2 days of the transaction. Verified duplicate charges will be fully refunded.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 mb-3">What You Should Do:</h4>
            <ul className="space-y-2 text-sm text-indigo-800 pl-4 list-disc">
              <li>Keep proof of duplicate transactions (email receipts, payment confirmations)</li>
              <li>Document the dates and amounts of each charge</li>
              <li>Contact support with all relevant details immediately</li>
              <li>Allow 5-10 business days for processing after verification</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'processing',
      title: 'Processing Time',
      icon: <Clock className="w-5 h-5" />,
      color: 'purple',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">Once your refund request is reviewed and approved:</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Clock className="w-6 h-6 text-purple-500 mb-2" />
              <p className="font-medium text-gray-900">Processing Period</p>
              <p className="text-sm text-gray-600 mt-1">5–10 business days</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <DollarSign className="w-6 h-6 text-purple-500 mb-2" />
              <p className="font-medium text-gray-900">Refund Amount</p>
              <p className="text-sm text-gray-600 mt-1">Full amount refunded</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <CreditCard className="w-6 h-6 text-purple-500 mb-2" />
              <p className="font-medium text-gray-900">Refund Method</p>
              <p className="text-sm text-gray-600 mt-1">Original payment method</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Important:</strong> Processing time may vary depending on your bank or payment provider. Some banks may take additional time to reflect the refund in your account.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'request',
      title: 'How to Request a Refund',
      icon: <Mail className="w-5 h-5" />,
      color: 'orange',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">To request a refund, please contact us at:</p>
          
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900">Email Support</h4>
                <a href="mailto:globalgate25.lk@gmail.com" className="text-orange-700 hover:text-orange-900 font-medium">
                  globalgate25.lk@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-3">Include in Your Email:</h4>
            <ul className="space-y-2 text-sm text-blue-800 pl-4 list-disc">
              <li>Your full name</li>
              <li>Course name</li>
              <li>Date of purchase</li>
              <li>Reason for refund</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900">Response Time</h4>
                <p className="text-sm text-green-700">Our support team will respond within 2 business days.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: <Globe className="w-5 h-5" />,
      color: 'gray',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Global Gate reserves the right to modify this Refund Policy at any time. Any updates will be posted on this page.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Policy Modification Details:</h4>
            <ul className="space-y-2 text-sm text-gray-700 pl-4 list-disc">
              <li>Changes become effective immediately upon posting</li>
              <li>We will notify users of significant changes via email</li>
              <li>Continued use of services after changes constitutes acceptance</li>
              <li>Previous versions are available upon request</li>
            </ul>
          </div>
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-20 sm:mt-20">Refund Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Thank you for choosing Global Gate for your online learning journey. We are committed to delivering high-quality educational content and a smooth learning experience. Please read our refund policy carefully before purchasing any course.
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
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-${section.color}-50 to-${section.color}-100 text-${section.color}-600`}>
                        {section.icon}
                      </div>
                      <span className="font-medium text-gray-900 text-left text-sm">{section.title}</span>
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
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {checkedSections.length === sections.length && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">I have read and understood the refund policy</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {checkedSections.length} of {sections.length} sections reviewed
                    </p>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Global Gate, we stand behind the quality of our courses. This refund policy outlines our commitment to our students and the conditions under which refunds may be requested. We encourage all students to review this policy carefully before enrolling in any course.
                </p>
                <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500 flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>2-Day Window</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Full Refunds Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Quick Processing</span>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
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
                          <span className="text-sm">✓</span>
                        )}
                      </button>
                    </div>
                    
                    {section.content}
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-8 bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Questions About Our Refund Policy?</h3>
                    <p className="text-gray-700">
                      Our support team is here to help clarify any aspects of our refund policy.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Contact Support
                    </button>
                    <p className="text-sm text-gray-600 text-center md:text-right">
                      globalgate25.lk@gmail.com
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
                  <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
                  <p className="text-sm text-gray-600">
                    This refund policy is part of our commitment to student satisfaction. Refund eligibility is determined solely by Global Gate Institute based on the conditions outlined in this policy. Any disputes regarding refunds will be resolved in accordance with our standard procedures. 
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Global Gate Institute. All rights reserved.</p>
              <p className="mt-2">Version 1.0 • Effective from {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Return;
