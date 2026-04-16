import { useState, useEffect, useRef, useCallback } from 'react';
import { coursesService } from '../Services/services';
import type { Course } from '../Services/services';
import { useAuth } from '../Context/AuthContext';
import {
  PlayCircle,
  Upload,
  Search,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  FileVideo,
  Link2,
  X,
  CloudUpload,
  Loader2,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

const statusStyle: Record<string, { class: string; icon: any }> = {
  Published: { class: 'bg-emerald-500/15 text-emerald-400', icon: CheckCircle },
  Processing: { class: 'bg-blue-500/15 text-blue-400', icon: Clock },
  Draft:      { class: 'bg-slate-500/15 text-slate-400',  icon: Video },
  Failed:     { class: 'bg-red-500/15 text-red-400',      icon: AlertCircle },
};

// ─── Preview Modal ─────────────────────────────────────────────────────────────

interface PreviewModalProps {
  video: { title: string; videoUrl?: string; url?: string; duration?: number | string; videoType?: string };
  onClose: () => void;
}

function PreviewModal({ video, onClose }: PreviewModalProps) {
  const src = video.videoUrl || video.url || '';
  const type = video.videoType;

  // Detect YouTube or Vimeo for iframe embed
  const isYouTube = type === 'youtube' || /youtube\.com|youtu\.be/.test(src);
  const isVimeo   = /vimeo\.com/.test(src);

  const getEmbedUrl = () => {
    if (isYouTube) {
      const id = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (isVimeo) {
      const id = src.match(/vimeo\.com\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#10111a 0%,#0d0e1c 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2111D4]/20 flex items-center justify-center shrink-0">
              <PlayCircle size={16} className="text-[#2111D4]" />
            </div>
            <span className="text-white font-semibold text-sm truncate">{video.title}</span>
            {video.duration && (
              <span className="flex items-center gap-1 text-slate-500 text-xs shrink-0">
                <Clock size={11} /> {video.duration} min
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {src && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Open in new tab"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="p-5">
          {!src ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Video size={40} className="opacity-30 mb-3" />
              <p className="text-sm">No video URL available</p>
            </div>
          ) : embedUrl ? (
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
          ) : (
            <video
              src={src}
              controls
              autoPlay
              className="w-full rounded-xl max-h-[500px] bg-black"
              style={{ outline: 'none' }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

interface DeleteConfirmProps {
  videoTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ videoTitle, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-red-500/20 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#10111a 0%,#0d0e1c 100%)' }}
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Delete Video?</h3>
            <p className="text-slate-400 text-sm mt-1">
              "<span className="text-white">{videoTitle}</span>" will be permanently removed.
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

interface UploadModalProps {
  courses: Course[];
  onClose: () => void;
  onSuccess: () => void;
}

function UploadModal({ courses, onClose, onSuccess }: UploadModalProps) {
  const [tab, setTab] = useState<'url' | 'file'>('url');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('video/')) {
      setFile(dropped);
      setError('');
    } else {
      setError('Only video files are accepted.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) { setFile(selected); setError(''); }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!courseId)             return setError('Please select a course.');
    if (!title.trim())         return setError('Please enter a video title.');
    if (tab === 'url' && !videoUrl.trim()) return setError('Please enter a video URL.');
    if (tab === 'file' && !file)           return setError('Please select or drop a video file.');

    setLoading(true);
    setProgress(0);

    try {
      if (tab === 'file' && file) {
        const form = new FormData();
        form.append('title', title);
        form.append('duration', duration || '0');
        form.append('video', file);

        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 85) { clearInterval(progressInterval); return 85; }
            return prev + Math.random() * 15;
          });
        }, 400);

        await coursesService.addVideo(courseId, form);
        clearInterval(progressInterval);
        setProgress(100);
      } else {
        await coursesService.addVideo(courseId, {
          title,
          videoUrl,
          duration: parseFloat(duration) || 0,
        } as any);
      }

      setTimeout(() => { onSuccess(); onClose(); }, 400);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add video. Please try again.');
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#10111a 0%,#0d0e1c 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2111D4]/20 flex items-center justify-center">
              <Video size={18} className="text-[#2111D4]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Add Video</h2>
              <p className="text-slate-500 text-xs">Upload a file or paste a URL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <BookOpen size={12} /> Course
            </label>
            <select
              id="upload-course-select"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2111D4]/60 focus:border-[#2111D4]/50 transition-all cursor-pointer"
              style={{ backgroundImage: 'none' }}
            >
              <option value="" className="bg-[#10111a] text-slate-400">Select a course…</option>
              {courses.map(c => (
                <option key={c._id} value={c._id} className="bg-[#10111a] text-slate-200">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Video Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Video Title</label>
            <input
              id="upload-video-title"
              type="text"
              placeholder="e.g. Introduction to React Hooks"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2111D4]/60 focus:border-[#2111D4]/50 transition-all placeholder-slate-600"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Clock size={12} /> Duration (minutes)
            </label>
            <input
              id="upload-video-duration"
              type="number"
              placeholder="e.g. 12.5"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              min="0"
              step="0.1"
              className="w-full bg-white/5 border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2111D4]/60 focus:border-[#2111D4]/50 transition-all placeholder-slate-600"
            />
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              type="button"
              id="tab-url"
              onClick={() => { setTab('url'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'url'
                  ? 'bg-[#2111D4] text-white shadow-md shadow-[#2111D4]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 size={14} /> Paste URL
            </button>
            <button
              type="button"
              id="tab-file"
              onClick={() => { setTab('file'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'file'
                  ? 'bg-[#2111D4] text-white shadow-md shadow-[#2111D4]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudUpload size={14} /> Upload File
            </button>
          </div>

          {/* URL Tab */}
          {tab === 'url' && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Video URL</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-1 focus-within:ring-[#2111D4]/60 focus-within:border-[#2111D4]/50 transition-all">
                <Link2 size={14} className="text-slate-500 shrink-0 mr-2" />
                <input
                  id="upload-video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="bg-transparent outline-none text-slate-200 text-sm w-full placeholder-slate-600"
                />
              </div>
              <p className="text-xs text-slate-600">Supports YouTube, Vimeo, direct MP4 links, and more.</p>
            </div>
          )}

          {/* File Upload Tab */}
          {tab === 'file' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                id="upload-file-input"
              />
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#2111D4] bg-[#2111D4]/10'
                      : 'border-white/15 bg-white/3 hover:border-[#2111D4]/50 hover:bg-[#2111D4]/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDragging ? 'bg-[#2111D4]/30 scale-110' : 'bg-[#2111D4]/15'}`}>
                    <CloudUpload size={22} className="text-[#2111D4]" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">
                      {isDragging ? 'Drop it here!' : 'Drag & drop your video'}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      MP4, MOV, AVI, MKV — or{' '}
                      <span className="text-[#2111D4] underline underline-offset-2">browse files</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <FileVideo size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && tab === 'file' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Uploading to Cloudinary…</span>
                <span>{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2111D4] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              id="upload-submit-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#2111D4] hover:bg-[#1a0db0] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2111D4]/30 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {tab === 'file' ? 'Uploading…' : 'Adding…'}
                </>
              ) : (
                <>
                  {tab === 'file' ? <CloudUpload size={15} /> : <Link2 size={15} />}
                  {tab === 'file' ? 'Upload Video' : 'Add Video'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface FlatVideo {
  _id?: string;
  title: string;
  videoUrl?: string;
  url?: string;
  duration?: number | string;
  status: string;
  views: number;
  createdAt?: string;
  courseId: string;
  courseTitle: string;
  section?: string;
  adminName?: string;
  adminEmail?: string;
}

export default function Course_video_content() {
  const { user } = useAuth();
  const [courses, setCourses]         = useState<Course[]>([]);
  const [search, setSearch]           = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showModal, setShowModal]     = useState(false);
  const [previewVideo, setPreviewVideo] = useState<FlatVideo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlatVideo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCourses = () => {
    coursesService.getAll()
      .then(res => {
        const data = res.data as any;
        if (Array.isArray(data))              setCourses(data);
        else if (data && Array.isArray(data.data))    setCourses(data.data);
        else if (data && Array.isArray(data.courses)) setCourses(data.courses);
        else setCourses([]);
      })
      .catch(console.error);
  };

  useEffect(() => { fetchCourses(); }, []);

  const adminNameFallback = user?.name || 'Unknown admin';

  const allVideos: FlatVideo[] = courses.flatMap(c =>
    (c.videos || []).map(v => ({
      ...v,
      courseId:    c._id,
      courseTitle: c.title,
      section:     (v as any).section || 'General',
      status:      (v as any).status || 'Published',
      views:       (v as any).views  || 0,
      videoUrl:    (v as any).videoUrl || v.url || '',
      adminName:   c.instructor?.name || adminNameFallback,
      adminEmail:  c.instructor?.email || user?.email || '',
    }))
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    setDeleteLoading(true);
    try {
      await coursesService.deleteVideo(deleteTarget.courseId, deleteTarget._id);
      setDeleteTarget(null);
      fetchCourses();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const summaryStats = [
    { label: 'Total Videos',  value: allVideos.length,                                          color: '#2111D4' },
    { label: 'Published',     value: allVideos.filter(v => v.status === 'Published').length,     color: '#10b981' },
    { label: 'Processing',    value: allVideos.filter(v => v.status === 'Processing').length,    color: '#3b82f6' },
    { label: 'Drafts',        value: allVideos.filter(v => v.status === 'Draft').length,         color: '#f59e0b' },
  ];

  const filters = ['All', 'Published', 'Processing', 'Draft', 'Failed'];

  const filtered = allVideos.filter(v => {
    const matchSearch =
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
      v.adminName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || v.status === activeFilter;
    const matchCourse = selectedCourse === '' || v.courseId === selectedCourse;
    return matchSearch && matchFilter && matchCourse;
  });

  // Group videos by course and then by section
  const groupedVideos = filtered.reduce((acc, video) => {
    const courseKey = video.courseId;
    if (!acc[courseKey]) {
      acc[courseKey] = {
        courseTitle: video.courseTitle,
        adminName: video.adminName,
        adminEmail: video.adminEmail,
        sections: {},
      };
    }
    const sectionKey = video.section || 'General';
    if (!acc[courseKey].sections[sectionKey]) {
      acc[courseKey].sections[sectionKey] = [];
    }
    acc[courseKey].sections[sectionKey].push(video);
    return acc;
  }, {} as Record<string, { courseTitle: string; adminName?: string; adminEmail?: string; sections: Record<string, FlatVideo[]> }>);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PlayCircle size={26} className="text-[#2111D4]" />
            Video Content
          </h1>
          <p className="text-slate-400 text-sm mt-1">{allVideos.length} videos across all courses</p>
        </div>
        <button
          id="open-upload-modal-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2111D4] hover:bg-[#1a0db0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2111D4]/30 hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Upload size={15} /> Add Video
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3 hover:bg-white/8 transition-colors">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Drop Zone */}
      <div
        onClick={() => setShowModal(true)}
        className="rounded-2xl border-2 border-dashed border-white/15 bg-white/3 p-8 flex flex-col items-center justify-center gap-3 hover:border-[#2111D4]/50 hover:bg-[#2111D4]/5 transition-all group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#2111D4]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload size={24} className="text-[#2111D4]" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">Drag & drop or click to add a video</p>
          <p className="text-slate-500 text-sm mt-1">
            Upload from your PC or paste a URL —{' '}
            <span className="text-[#2111D4]">open upload dialog</span>
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-white/5 border border-white/10 text-slate-300 rounded-xl px-3 py-2.5 items-center flex-1 focus-within:ring-1 focus-within:ring-[#2111D4]/60 focus-within:border-[#2111D4]/60 transition-all group">
            <Search size={16} className="text-slate-500 group-focus-within:text-[#2111D4] mr-2 shrink-0 transition-colors" />
            <input
              type="text"
              placeholder="Search by video title or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-500 text-slate-200"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white ml-2 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="bg-white/5 border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#2111D4]/60 focus:border-[#2111D4]/50 transition-all cursor-pointer min-w-[220px]"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#10111a] text-slate-400">Filter by Course…</option>
            {courses.map(c => (
              <option key={c._id} value={c._id} className="bg-[#10111a] text-slate-200">
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-[#2111D4] text-white shadow-md shadow-[#2111D4]/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grouped by Course and Section */}
      <div className="space-y-6">
        {Object.entries(groupedVideos).length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center py-16 text-slate-500">
            <FileVideo size={40} className="mb-3 opacity-30" />
            <p>No videos found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-[#2111D4] text-sm hover:underline"
            >
              Add your first video →
            </button>
          </div>
        ) : (
          Object.entries(groupedVideos).map(([courseId, courseData]) => (
            <div key={courseId} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-[#2111D4]/20 to-[#2111D4]/10 border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2111D4]/30 flex items-center justify-center">
                      <BookOpen size={20} className="text-[#2111D4]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{courseData.courseTitle}</h3>
                      <p className="text-slate-400 text-xs">
                        {courseData.adminName && <>Admin: {courseData.adminName}</>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">
                      {Object.values(courseData.sections).reduce((sum, videos) => sum + videos.length, 0)} videos
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections within Course */}
              <div className="divide-y divide-white/5">
                {Object.entries(courseData.sections).map(([sectionName, sectionVideos]) => (
                  <div key={sectionName} className="p-6 space-y-4">
                    {/* Section Title */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-6 bg-[#2111D4] rounded-r-lg"></div>
                      <h4 className="text-white font-semibold text-sm">{sectionName}</h4>
                      <span className="ml-auto text-xs text-slate-500">{sectionVideos.length} video(s)</span>
                    </div>

                    {/* Videos in Section */}
                    <div className="space-y-2">
                      {sectionVideos.map((video, idx) => {
                        const s = statusStyle[video.status] || statusStyle['Published'];
                        const StatusIcon = s.icon;
                        return (
                          <div
                            key={video._id || idx}
                            className="flex flex-col gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group sm:flex-row sm:items-center"
                          >
                            {/* Video Info */}
                            <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0">
                              <button
                                onClick={() => setPreviewVideo(video)}
                                className="w-14 h-10 rounded-lg bg-[#2111D4]/15 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#2111D4]/40 hover:bg-[#2111D4]/30 transition-all"
                                title="Preview video"
                              >
                                <PlayCircle size={18} className="text-[#2111D4] opacity-70 group-hover:opacity-100 transition-opacity" />
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors line-clamp-1 truncate">
                                  {video.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                  {video.duration && (
                                    <>
                                      <Clock size={11} />
                                      <span>{video.duration} min</span>
                                      <span className="text-white/20">•</span>
                                    </>
                                  )}
                                  <Eye size={11} />
                                  <span>{video.views?.toLocaleString() ?? 0} views</span>
                                </div>
                              </div>
                            </div>

                            {/* Status & Date */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right mt-2 sm:mt-0">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.class}`}>
                                  <StatusIcon size={11} />
                                  {video.status}
                                </span>
                                <p className="text-slate-500 text-xs mt-1">
                                  {new Date((video as any).createdAt || Date.now()).toLocaleDateString()}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1">
                                <button
                                  title="Preview"
                                  onClick={() => setPreviewVideo(video)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  title="Edit"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  title="Delete"
                                  onClick={() => setDeleteTarget(video)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modals ── */}

      {showModal && (
        <UploadModal
          courses={courses}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCourses}
        />
      )}

      {previewVideo && (
        <PreviewModal
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          videoTitle={deleteTarget.title}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
