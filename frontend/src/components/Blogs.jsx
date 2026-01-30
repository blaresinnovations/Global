import React from 'react';
import { BACKEND_URL } from '../config';
import { motion } from 'framer-motion';
import { Eye, Image as ImageIcon, Play, X, PlayCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

function MediaPreview({ item, size = 'full' }) {
	if (!item) return null;
	const isImage = item.type?.startsWith('image') || item.media_type?.includes('image') || (item.media_path && item.media_path.match(/\.(jpg|jpeg|png|webp)$/i));
	const isVideo = item.type?.startsWith('video') || item.media_type?.includes('video') || (item.media_path && item.media_path.match(/\.(mp4|webm|ogg)$/i));
	if (isImage) return <img src={item.url || item.media_path} alt="" className={`${size === 'small' ? 'w-24 h-24' : 'w-full h-64'} object-cover rounded-xl`} />;
	if (isVideo) return <video controls src={item.url || item.media_path} className={`${size === 'small' ? 'w-24 h-24' : 'w-full h-64'} rounded-xl object-cover`} />;
	return null;
}

export default function Blogs() {
	const [blogs, setBlogs] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [viewBlog, setViewBlog] = React.useState(null);
	const [carouselIndex, setCarouselIndex] = React.useState(0);

	React.useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(`${BACKEND_URL}/api/blogs`);
				const data = await res.json();
				if (!mounted) return;
				setBlogs(Array.isArray(data) ? data : []);
			} catch (e) {
				if (!mounted) return;
				setBlogs([]);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const getMediaUrl = (item) => {
		const path = item.media_path || item.path || item.url;
		if (!path) return null;
		return path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
	};

	return (
		<section className="py-12 bg-white">
			<div className="max-w-6xl mx-auto px-6">
				<div className="text-center mb-12 mt-0">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
						<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
						<span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Latest</span>
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">News</span></h2>
					<p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">Read our latest insights, tutorials and announcements from the Global Gate team.</p>
				</div>

				<div>
			{loading ? (
				<p className="text-center text-gray-500 py-12">Loading blogs...</p>
			) : blogs.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
						<ImageIcon className="w-12 h-12 text-gray-400" />
					</div>
					<p className="text-lg text-gray-600">No blog posts yet</p>
				</div>
			) : (
				<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{blogs.map(blog => (
						<motion.div key={blog.id} layout className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
							<div className="relative h-56 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
								{blog.media && blog.media[0] ? (
									<MediaPreview item={{ ...blog.media[0], media_path: getMediaUrl(blog.media[0]) }} />
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<div className="text-5xl font-bold text-blue-100">GG</div>
									</div>
								)}
							</div>

							<div className="p-6">
								<h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{blog.title}</h3>
								<p className="text-sm text-slate-600 mb-3">{blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Draft'}</p>
								<p className="text-sm text-slate-700 line-clamp-3">{blog.description}</p>
								<div className="mt-4 flex justify-end">
									<button onClick={() => { setViewBlog(blog); setCarouselIndex(0); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">View</button>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}

			{viewBlog && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setViewBlog(null)}>
					<button onClick={(e) => { e.stopPropagation(); setViewBlog(null); }} aria-label="Close" className="absolute top-4 right-4 z-50 p-2 bg-white/90 rounded-full shadow hover:bg-gray-100">
						<X className="w-5 h-5" />
					</button>
					<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
						{/* Carousel */}
						{viewBlog.media && viewBlog.media.length > 0 && (
							<div className="relative bg-black/5">
								<div className="w-full h-64 md:h-96 overflow-hidden">
									{viewBlog.media[carouselIndex] && (
										viewBlog.media[carouselIndex].media_type?.includes('video') ? (
											<video controls src={getMediaUrl(viewBlog.media[carouselIndex])} className="w-full h-full object-cover" />
										) : (
											<img src={getMediaUrl(viewBlog.media[carouselIndex])} alt="" className="w-full h-full object-cover" />
										)
									)}
								</div>
								{viewBlog.media.length > 1 && (
									<>
										<button onClick={() => setCarouselIndex(i => (i - 1 + viewBlog.media.length) % viewBlog.media.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"> <ChevronLeft className="w-5 h-5" /> </button>
										<button onClick={() => setCarouselIndex(i => (i + 1) % viewBlog.media.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"> <ChevronRight className="w-5 h-5" /> </button>
										<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
											{viewBlog.media.map((_, idx) => (
												<button key={idx} onClick={() => setCarouselIndex(idx)} className={`w-2 h-2 rounded-full ${idx === carouselIndex ? 'bg-white' : 'bg-white/60'}`} />
											))}
										</div>
									</>
								)}
							</div>
						)}

						<div className="p-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold mb-2">{viewBlog.title}</h2>
									<p className="text-sm text-gray-600">{viewBlog.publish_date ? new Date(viewBlog.publish_date).toLocaleDateString() : 'Unpublished'}</p>
								</div>
								<div className="flex items-center gap-3">
									<button onClick={async () => {
										const shareData = { title: viewBlog.title, text: viewBlog.description?.slice(0,200), url: window.location.href };
										try {
											if (navigator.share) await navigator.share(shareData);
											else { await navigator.clipboard.writeText(shareData.url); alert('Link copied to clipboard'); }
										} catch (e) { console.error(e); alert('Share failed'); }
									}} className="px-3 py-2 bg-white border rounded-md flex items-center gap-2 hover:bg-gray-50"><Share2 className="w-4 h-4"/> Share</button>
									<button onClick={() => setViewBlog(null)} className="p-3 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
								</div>
							</div>

							<div className="prose prose-lg max-w-none text-gray-700 mt-6">
								<p className="whitespace-pre-wrap">{viewBlog.description}</p>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
			</div>
		</div>
	</section>
	);
}

