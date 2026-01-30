import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import { User, ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function Courses() {

	const formatDate = (d) => {
		try { if (!d) return null; const dt = new Date(d); if (isNaN(dt)) return d; return dt.toLocaleDateString(); } catch(e){ return d; }
	};
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modalCourse, setModalCourse] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch('/api/courses');
				const data = await res.json();
				if (!mounted) return;
				setCourses(Array.isArray(data) ? data.map(c => ({ ...c, is_seminar: !!Number(c.is_seminar), meeting_link: c.meeting_link || null })) : []);
			} catch (e) {
				if (!mounted) return;
				setError(e.message || 'Failed to load courses');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const openModal = (course) => setModalCourse(course);
	const closeModal = () => setModalCourse(null);

	if (loading) return (
		<section className="py-12 min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950">
			<div className="max-w-6xl mx-auto px-6 text-center">
				<div className="inline-block">
					<div className="flex items-center gap-3 justify-center mb-4">
						<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
						<div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
						<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
					</div>
					<p className="mt-4 text-lg text-slate-300">Loading our courses...</p>
				</div>
			</div>
		</section>
	);

	if (error) return (
		<section className="py-12 min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950">
			<div className="max-w-6xl mx-auto px-6 text-center">
				<div className="inline-flex items-center gap-3 px-6 py-4 bg-red-900/20 rounded-2xl border border-red-800/30">
					<div className="w-3 h-3 bg-red-500 rounded-full"></div>
					<p className="text-red-300 font-medium">Unable to load courses: {error}</p>
				</div>
			</div>
		</section>
	);

	return (
		<section className="py-12 min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950">
			<div className="max-w-7xl mx-auto px-6">
				<div className="text-center mb-12 mt-10">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/10 backdrop-blur-xl rounded-full mb-6 border border-blue-500/20">
						<div className="w-3 h-3 bg-blue-400 rounded-full"></div>
						<span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wide">Our Programs</span>
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Courses</span></h2>
					<p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">Specialized programs designed for learners seeking global opportunities.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
					{courses.map(course => (
								<div key={course.id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 card-glow bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700">
									<div className="relative h-56 overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>
										{course.banner_path ? (
											<img
												src={course.banner_path && course.banner_path.startsWith('http') ? course.banner_path : `${BACKEND_URL}${course.banner_path && course.banner_path.startsWith('/') ? course.banner_path : (course.banner_path ? `/CourseImage/${course.banner_path}` : '')}`}
												alt={course.name}
												className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<div className="text-5xl font-bold text-blue-100">GG</div>
											</div>
										)}

										<div className="absolute top-4 right-4">
											<div className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm rounded-full border border-gray-700">
												{course.early_bird_price && parseFloat(course.early_bird_price) > 0 ? (
													<div className="flex flex-col items-end">
														<span className="text-xs font-bold text-orange-300">EARLY: LKR {parseFloat(course.early_bird_price).toLocaleString()}</span>
														<span className="text-sm font-semibold line-through text-slate-400">LKR {(() => { const f = parseFloat(course.fee); return isNaN(f) ? (course.fee || '0') : f.toLocaleString(); })()}</span>
													</div>
												) : (
													<span className="text-sm font-semibold text-gray-200">
														{(() => {
															const feeNum = parseFloat(course.fee);
															return feeNum === 0 ? 'FREE ENROLLMENT' : `LKR ${feeNum.toLocaleString()}`;
														})()}
													</span>
												)}
											</div>
										</div>
									</div>

									<div className="p-6 space-y-5">
										{course.early_bird_price && parseFloat(course.early_bird_price) > 0 && (
											<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-900/60 to-red-900/60 backdrop-blur-sm rounded-full border border-orange-500/30">
												<Sparkles className="w-3 h-3 text-orange-400" />
												<span className="text-xs font-bold text-orange-300 uppercase tracking-widest">Early Bird Offer</span>
											</div>
										)}

										<div>
											<h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors">{course.name}</h3>

											<div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg mb-4">
												<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border border-slate-600">
													{course.lecturer_photo ? (
														<img
															src={course.lecturer_photo && course.lecturer_photo.startsWith('http')
																? course.lecturer_photo
																: `${BACKEND_URL}${course.lecturer_photo && course.lecturer_photo.startsWith('/')
																		? course.lecturer_photo
																		: (course.lecturer_photo ? `/LecturerImage/${course.lecturer_photo}` : '')}`}
															alt={course.lecturer_name}
															className="w-full h-full object-cover"
														/>
													) : (
														<User className="w-5 h-5 text-white" />
													)}
												</div>
												<div className="min-w-0">
													<p className="text-xs text-slate-400">Instructor</p>
													<p className="text-sm font-semibold text-white truncate">{course.lecturer_name || 'Expert Instructor'}</p>
												</div>
											</div>
										</div>

										<div className="space-y-2 text-sm">
											{course.start_date && (
												<div className="flex items-center gap-2 text-slate-300">
													<Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
													<span>Starts: <span className="font-semibold">{new Date(course.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
												</div>
											)}
											{course.end_date && (
												<div className="flex items-center gap-2 text-slate-300">
													<Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
													<span>Ends: <span className="font-semibold">{new Date(course.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
												</div>
											)}
										</div>

										<p className="text-gray-300 text-sm leading-relaxed">{course.description}</p>

										<button
											onClick={() => {
												if (course.is_seminar && course.meeting_link) {
													try { window.open(course.meeting_link, '_blank'); return; } catch (e) { }
												}
												navigate(`/register?courseId=${course.id}`);
											}}
											className="group/btn w-full flex items-center justify-center gap-3 
															 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 
															 text-white font-semibold rounded-xl
															 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 
															 transform transition-all duration-300 hover:scale-[1.02]
															 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
										>
											<span>{course.is_seminar ? 'Join Seminar' : 'Enroll Now'}</span>
											<ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
										</button>
									</div>
								</div>
					))}
				</div>
			</div>

			{/* Modal */}
			{modalCourse && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={closeModal} />
							<div className="relative max-w-3xl w-full mx-4 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
								<div className="relative h-56 bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
							{modalCourse.banner_path ? (
								<img src={modalCourse.banner_path && modalCourse.banner_path.startsWith('http') ? modalCourse.banner_path : `${BACKEND_URL}${modalCourse.banner_path && modalCourse.banner_path.startsWith('/') ? modalCourse.banner_path : (modalCourse.banner_path ? `/CourseImage/${modalCourse.banner_path}` : '')}`} alt={modalCourse.name} className="w-full h-full object-cover" />
							) : (
										<div className="w-full h-full flex items-center justify-center text-blue-100 text-5xl">GG</div>
							)}
						</div>
								<div className="p-6 bg-slate-900/40 text-slate-200">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
											<h3 className="text-2xl font-bold text-white">{modalCourse.name}</h3>
											<div className="flex items-center gap-3 mt-3 text-slate-300">
										<User className="w-4 h-4" />
										<div>
													<div className="text-sm">{modalCourse.lecturer_name || 'Instructor'}</div>
													<div className="text-xs text-slate-300">
														{modalCourse.start_date && <span>Starts: {formatDate(modalCourse.start_date)}</span>}
														{modalCourse.start_date && modalCourse.end_date && <span className="mx-2">•</span>}
														{modalCourse.end_date && <span>Ends: {formatDate(modalCourse.end_date)}</span>}
													</div>
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm text-slate-500">Fee</div>
									<div className="text-lg font-semibold">
										{(() => { const f = parseFloat(modalCourse.fee); if (!isNaN(f)) return f === 0 ? 'FREE' : `LKR ${f.toLocaleString()}`; return modalCourse.fee || 'FREE'; })()}
									</div>
								</div>
							</div>
									<div className="mt-6 text-slate-300 leading-relaxed">
										{modalCourse.description || 'No description provided.'}
									</div>

									<div className="mt-6 flex items-center gap-3">
										<button onClick={() => { if (modalCourse.is_seminar && modalCourse.meeting_link) { try { window.open(modalCourse.meeting_link, '_blank'); return; } catch(e){} } navigate(`/register?courseId=${modalCourse.id}`); }} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl">{modalCourse.is_seminar ? 'Join' : 'Register'}</button>
										<button onClick={closeModal} className="px-4 py-2 border rounded-lg border-slate-600 text-slate-200">Close</button>
									</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
