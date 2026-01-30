import React from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  User, 
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';
import { BACKEND_URL } from '../config';

export default function NewInquiries() {
	const [form, setForm] = React.useState({ name: '', mobile: '', email: '', message: '' });
	const [submitting, setSubmitting] = React.useState(false);
	const [success, setSuccess] = React.useState(null);
	const [error, setError] = React.useState('');

	const handleSubmit = async (e) => {
		e && e.preventDefault();
		setSubmitting(true);
		setSuccess(null);
		setError('');
		try {
			const res = await fetch(`${BACKEND_URL}/api/inquiries`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
			if (!res.ok) throw new Error('Submit failed');
			await res.json();
			setSuccess('Message sent successfully! Our team will contact you shortly.');
			setForm({ name: '', mobile: '', email: '', message: '' });
		} catch (err) {
			console.error(err);
			setError('Submission failed. Please try again or contact us directly.');
		}
		setSubmitting(false);
	};

	return (
		<div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="grid mt-15 md:mt-10 lg:grid-cols-2 gap-12 items-center">
					{/* Left Column - Information */}
					<div className="space-y-8">
						<div>
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
								<Send className="w-4 h-4" />
								Get in Touch
							</div>
							
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								Let's Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Conversation</span>
							</h1>
							
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Share your inquiry with us. Our dedicated team will provide personalized assistance and get back to you promptly.
							</p>
						</div>

						{/* Features/Benefits */}
						<div className="space-y-6">
							<div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-white border border-blue-100">
								<div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
									<Shield className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-bold text-gray-900 text-lg mb-1">Secure & Confidential</h3>
									<p className="text-gray-600">Your information is protected with enterprise-grade security</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-100">
								<div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
									<Clock className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-bold text-gray-900 text-lg mb-1">Quick Response</h3>
									<p className="text-gray-600">We aim to reply within 24 hours during business days</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-white border border-purple-100">
								<div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
									<MessageSquare className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-bold text-gray-900 text-lg mb-1">Personalized Support</h3>
									<p className="text-gray-600">Every inquiry receives individual attention from our experts</p>
								</div>
							</div>
						</div>

						{/* Contact Info */}
						<div className="pt-8 border-t border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Prefer direct contact?</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
										<Mail className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<div className="text-sm text-gray-500">Email us at</div>
										<div className="font-medium text-gray-900">info@globalgate.lk</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
										<Phone className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<div className="text-sm text-gray-500">Call us</div>
										<div className="font-medium text-gray-900">077 332 9211</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Form */}
					<div className="relative">
						{/* Decorative Elements */}
						<div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-5"></div>
						<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-5"></div>
						
						<div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
							{/* Form Header */}
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
										<MessageSquare className="w-7 h-7 text-white" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-white">Send Your Inquiry</h2>
										<p className="text-blue-100">Fill out the form below and we'll get back to you</p>
									</div>
								</div>
							</div>

							{/* Form Content */}
							<div className="p-8">
								{success && (
									<div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
										<div className="flex items-center gap-3">
											<CheckCircle className="w-5 h-5 text-emerald-600" />
											<div className="text-emerald-700 font-medium">{success}</div>
										</div>
									</div>
								)}

								{error && (
									<div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
										<div className="flex items-center gap-3">
											<div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
												<div className="w-2 h-2 rounded-full bg-red-600"></div>
											</div>
											<div className="text-red-700 font-medium">{error}</div>
										</div>
									</div>
								)}

								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
												<User className="w-4 h-4 text-blue-600" />
												Full Name
											</label>
											<input
												required
												value={form.name}
												onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
												placeholder="Enter your full name"
												className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-400"
											/>
										</div>

										<div className="space-y-2">
											<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
												<Phone className="w-4 h-4 text-blue-600" />
												Mobile Number
											</label>
											<input
												required
												value={form.mobile}
												onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
												placeholder="Enter your mobile number"
												className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-400"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
											<Mail className="w-4 h-4 text-blue-600" />
											Email Address
										</label>
										<input
											required
											type="email"
											value={form.email}
											onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
											placeholder="Enter your email address"
											className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-400"
										/>
									</div>

									<div className="space-y-2">
										<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
											<MessageSquare className="w-4 h-4 text-blue-600" />
											Your Message
										</label>
										<textarea
											value={form.message}
											onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
											rows={6}
											placeholder="Please share details about your inquiry..."
											className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder:text-gray-400 resize-none"
										/>
									</div>

									<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
										<div className="flex items-center gap-4">
											<button
												type="submit"
												disabled={submitting}
												className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
											>
												{submitting ? (
													<>
														<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
														<span>Sending...</span>
													</>
												) : (
													<>
														<Send className="w-5 h-5" />
														<span>Send Message</span>
														<ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
													</>
												)}
											</button>

											<button
												type="button"
												onClick={() => setForm({ name: '', mobile: '', email: '', message: '' })}
												className="px-6 py-4 text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
											>
												Clear Form
											</button>
										</div>

										
									</div>

									<div className="pt-4 border-t border-gray-100">
										<p className="text-sm text-gray-500 text-center">
											By submitting this form, you agree to our privacy policy. Your data is secure with us.
										</p>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

				
			</div>
		</div>
	);
}