// src/pages/Admin/AddBlog.jsx
import React from 'react';
import { BACKEND_URL } from '../../config';
import { motion } from 'framer-motion';
import {
  Upload, X, Edit2, Trash2, Eye, Plus, Calendar, Image as ImageIcon,
  Play, Volume2, ChevronLeft, ChevronRight
} from 'lucide-react';

function MediaPreview({ item, size = 'full' }) {
  if (!item) return null;
  const isImage = item.type?.startsWith('image') || item.media_type?.includes('image');
  const isVideo = item.type?.startsWith('video') || item.media_type?.includes('video');
  const isAudio = item.type?.startsWith('audio') || item.media_type?.includes('audio');

  if (isImage)
    return <img src={item.url || item.media_path} alt="" className={`${size === 'small' ? 'w-24 h-24' : 'w-full h-64'} object-cover rounded-xl`} />;
  if (isVideo)
    return <video controls src={item.url || item.media_path} className={`${size === 'small' ? 'w-24 h-24' : 'w-full h-64'} rounded-xl object-cover`} />;
  if (isAudio)
    return <audio controls src={item.url || item.media_path} className="w-full" />;
  return null;
}

export default function AddBlog() {
  const [tab, setTab] = React.useState('add');
  const [form, setForm] = React.useState({ title: '', description: '', publish_date: '' });
  const [mediaFiles, setMediaFiles] = React.useState([]);
  const [editingId, setEditingId] = React.useState(null);

  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [carouselIndex, setCarouselIndex] = React.useState({});
  const [viewBlog, setViewBlog] = React.useState(null);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  React.useEffect(() => {
    if (tab === 'list') fetchBlogs();
  }, [tab]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map(f => ({
      file: f,
      type: f.type,
      url: URL.createObjectURL(f),
      name: f.name
    }));
    setMediaFiles(mapped);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', publish_date: '' });
    setMediaFiles([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('publish_date', form.publish_date || new Date().toISOString().split('T')[0]);
    mediaFiles.forEach(m => fd.append('media', m.file));

    try {
      const url = editingId ? `${BACKEND_URL}/api/blogs/${editingId}` : `${BACKEND_URL}/api/blogs`;
      const method = editingId ? 'PUT' : 'POST';
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      const res = await fetch(url, { method, headers, body: fd });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');

      alert(editingId ? 'Blog updated!' : 'Blog published!');
      resetForm();
      setTab('list');
    } catch (err) {
      alert('Error: ' + (err && err.message ? err.message : String(err)));
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (blog) => {
    setViewBlog(blog);
    setCarouselIndex(prev => ({ ...prev, [blog.id]: 0 }));
    setLightboxIndex(0);
  };

  const handleEdit = (b) => {
    setForm({
      title: b.title || '',
      description: b.description || '',
      publish_date: b.publish_date ? b.publish_date.split('T')[0] : ''
    });
    setEditingId(b.id);
    setTab('add');
  };

  const handleDelete = async (b) => {
    if (!confirm('Delete this blog permanently?')) return;
    try {
      const raw = sessionStorage.getItem('AUTH_USER');
      const parsed = raw ? JSON.parse(raw) : null;
      const headers = parsed && parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
      await fetch(`${BACKEND_URL}/api/blogs/${b.id}`, { method: 'DELETE', headers });
      setBlogs(prev => prev.filter(x => x.id !== b.id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getMediaUrl = (item) => {
    const path = item.media_path || item.path || item.url;
    return path?.startsWith('http') ? path : `${BACKEND_URL}${path}`;
  };

  return (
    <>
      {/* Premium Tab Switcher */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl shadow-inner">
          {['add', 'list'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-8 py-3 rounded-xl font-medium transition-all duration-300"
            >
              {tab === t && (
                <motion.div
                  layoutId="blogTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${tab === t ? 'text-white' : 'text-gray-600'}`}>
                {t === 'add' ? <Plus className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {t === 'add' ? 'Write New Post' : 'All Posts'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Write/Edit Blog */}
      {tab === 'add' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-8xl mx-auto">
          <div className="bg-white p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="An amazing blog title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Publish Date
                </label>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={e => setForm(f => ({ ...f, publish_date: e.target.value }))}
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={8}
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Write your story..."
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Media Gallery (images, videos, audio)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    multiple
                    onChange={handleMediaChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all bg-white/30">
                    {mediaFiles.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mediaFiles.map((m, i) => (
                          <div key={i} className="relative group">
                            <MediaPreview item={m} size="small" />
                            <button
                              onClick={() => setMediaFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-gray-600">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-500">Supports images, videos, and audio</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  {editingId ? 'Update Post' : 'Publish Post'}
                </button>
                <button type="button" onClick={resetForm} className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Blog Grid */}
      {tab === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-full text-center py-20 text-gray-500">Loading posts...</p>
          ) : blogs.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">No blog posts yet</p>
            </div>
          ) : (
            blogs.map((blog) => {
              const currentIdx = carouselIndex[blog.id] || 0;
              const media = blog.media?.[currentIdx];
              const totalMedia = blog.media?.length || 0;

              return (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                    {media ? (
                      <MediaPreview item={{ ...media, url: getMediaUrl(media) }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-20 h-20 text-blue-400 opacity-50" />
                      </div>
                    )}
                    {totalMedia > 1 && (
                      <>
                        <button
                          onClick={() => setCarouselIndex(p => ({ ...p, [blog.id]: ((p[blog.id] || 0) - 1 + totalMedia) % totalMedia }))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCarouselIndex(p => ({ ...p, [blog.id]: (p[blog.id] || 0) + 1 }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                          {Array.from({ length: totalMedia }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition ${i === currentIdx ? 'bg-white' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}
                    </p>
                    <p className="text-gray-700 line-clamp-3 text-sm">{blog.description}</p>
                  </div>

                  {/* Floating Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button onClick={() => handleView(blog)} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-blue-50">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button onClick={() => handleEdit(blog)} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-yellow-50">
                      <Edit2 className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button onClick={() => handleDelete(blog)} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {viewBlog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setViewBlog(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-full overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur z-10 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{viewBlog.title}</h2>
                <p className="text-gray-600 mt-1">
                  {viewBlog.publish_date ? new Date(viewBlog.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unpublished'}
                </p>
              </div>
              <button
                onClick={() => setViewBlog(null)}
                className="p-3 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                <p className="whitespace-pre-wrap">{viewBlog.description}</p>
              </div>

              {viewBlog.media && viewBlog.media.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900">Media Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {viewBlog.media.map((item, i) => (
                      <div key={i} className="relative group cursor-pointer" onClick={() => setLightboxIndex(i)}>
                        <MediaPreview item={{ ...item, url: getMediaUrl(item) }} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                          {item.media_type?.includes('video') && <Play className="w-16 h-16 text-white" />}
                          {item.media_type?.includes('audio') && <Volume2 className="w-16 h-16 text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}