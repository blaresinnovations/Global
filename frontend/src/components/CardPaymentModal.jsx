import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { BACKEND_URL } from '../config';

// Card validation utilities
const validateCardNumber = (number) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

const validateExpiry = (expiry) => {
  const [month, year] = expiry.split('/');
  if (!month || !year) return false;
  
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  
  if (m < 1 || m > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const fullYear = y < 100 ? (y < 50 ? 2000 + y : 1900 + y) : y;
  const expireDate = new Date(fullYear, m, 0);
  const now = new Date();
  
  return expireDate >= now;
};

const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  const chunks = digits.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
};

export default function CardPaymentModal({
  isOpen,
  onClose,
  course,
  studentId,
  paymentPlan,
  onPaymentSuccess
}) {
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1); // 1 = card details, 2 = confirmation

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCard(prev => ({ ...prev, number: formatted }));
    if (errors.number) setErrors(prev => ({ ...prev, number: '' }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setCard(prev => ({ ...prev, expiry: formatted }));
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' }));
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCard(prev => ({ ...prev, cvv: value }));
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!card.number.trim()) {
      newErrors.number = 'Card number is required';
    } else if (!validateCardNumber(card.number)) {
      newErrors.number = 'Invalid card number';
    }

    if (!card.name.trim()) {
      newErrors.name = 'Name on card is required';
    }

    if (!card.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!validateExpiry(card.expiry)) {
      newErrors.expiry = 'Card expired or invalid date';
    }

    if (!card.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(card.cvv)) {
      newErrors.cvv = 'Invalid CVV (3-4 digits)';
    }

    if (!card.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(card.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep(2);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create PayHere payment session
      const resp = await fetch(`${BACKEND_URL}/api/payments/create-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          courseId: course.id,
          amount: course.fee || 0,
          payment_plan: paymentPlan || 'full',
          card: {
            number: card.number.replace(/\s/g, ''),
            name: card.name,
            expiry: card.expiry,
            cvv: card.cvv,
            email: card.email
          },
          return_url: window.location.href
        })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Payment processing failed');
      }

      const result = await resp.json();

      if (result.redirect_url) {
        // Redirect to PayHere checkout
        setMessage({ 
          type: 'success', 
          text: 'Card validated! Redirecting to payment gateway...' 
        });
        setTimeout(() => {
          window.location.href = result.redirect_url;
        }, 1500);
      } else if (result.status === 'success' || result.status === 'paid') {
        // Payment processed successfully
        setMessage({ 
          type: 'success', 
          text: 'Payment successful! Processing enrollment...' 
        });
        setTimeout(() => {
          if (typeof onPaymentSuccess === 'function') {
            onPaymentSuccess();
          }
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Payment could not be processed');
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Payment failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  const maskCardNumber = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.length <= 4) return clean;
    return '*'.repeat(clean.length - 4) + clean.slice(-4);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center py-4 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white z-10">
          <h2 className="text-2xl font-bold">Card Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex gap-2 mb-6">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm text-gray-600">Course</div>
                <div className="font-semibold text-gray-900">{course.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Amount</div>
                <div className="font-bold text-blue-600">LKR {parseFloat(course.fee || 0).toLocaleString()}</div>
              </div>
            </div>
            {paymentPlan && paymentPlan !== 'full' && (
              <div className="text-xs text-gray-600 mt-2">Plan: {paymentPlan}</div>
            )}
          </div>

          {step === 1 ? (
            // Step 1: Card Details
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {message.text && (
                <div className={`flex gap-2 p-3 rounded-lg ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.number
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.number && (
                  <p className="text-red-600 text-sm mt-1">{errors.number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={card.name}
                  onChange={e => {
                    setCard(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.name
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                      errors.expiry
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  {errors.expiry && (
                    <p className="text-red-600 text-sm mt-1">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    value={card.cvv}
                    onChange={handleCVVChange}
                    maxLength="4"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                      errors.cvv
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={card.email}
                  onChange={e => {
                    setCard(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                    errors.email
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-gray-600">
                  ✓ Your card details are encrypted and secure
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : (
            // Step 2: Confirmation
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {message.text && (
                <div className={`flex gap-2 p-3 rounded-lg ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Card Number</span>
                  <span className="font-medium">{maskCardNumber(card.number)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="font-medium">{card.name}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Expiry</span>
                  <span className="font-medium">{card.expiry}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-medium text-sm">{card.email}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Amount to be Charged:
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  LKR {parseFloat(course.fee || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-amber-900">
                  By clicking "Complete Payment", you authorize this transaction and agree to the terms.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
