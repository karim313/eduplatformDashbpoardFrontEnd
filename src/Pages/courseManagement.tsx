import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Star,
  Users,
  Clock,
  Filter,
  ChevronDown,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  X,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { coursesService } from '../Services/services';
import type { Course } from '../Services/services';

const categoryColors: Record<string, string> = {
  Frontend: '#2111D4',
  Backend: '#0e7490',
  Design: '#b45309',
  Data: '#6d28d9',
  DevOps: '#065f46',
  Mobile: '#9d174d',
};

const statusStyle: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400',
  Draft: 'bg-slate-500/15 text-slate-400',
  Review: 'bg-amber-500/15 text-amber-400',
};

export default function CourseManagement() {
  const { user, token, isAuthenticated } = useAuth();
  
  const adminName = user?.name || 'Unknown';

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    price: 0,
    status: 'Active'
  });

  // Log current authenticated user info
  useEffect(() => {
    if (user && token) {
      console.log('Current authenticated user:', user);
    }
  }, [user, token, isAuthenticated]);
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      setIsSubmitting(true);
      const payload = {
        ...newCourse,
        instructor: user
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
            }
          : undefined,
      };
      await coursesService.create(payload);
      setIsModalOpen(false);
      setNewCourse({ title: '', description: '', category: 'Frontend', price: 0, status: 'Active' });
      fetchCourses();
    } catch (error: any) {
      console.error('Failed to create course', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to create course. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await coursesService.getAll();
      const data = res.data as any;
      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data && Array.isArray(data.data)) {
        setCourses(data.data);
      } else if (data && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await coursesService.delete(id);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  const filters = ['All', 'Active', 'Draft', 'Review'];

  const filtered = courses.filter((c) => {
    const instructorName = c.instructor?.name || adminName;
    const titleMatch = c.title?.toLowerCase().includes(search.toLowerCase());
    const instMatch = instructorName.toLowerCase().includes(search.toLowerCase());
    const matchSearch = titleMatch || instMatch;
    // We assume backend might not have 'status' string per se, fallback to checking if it matches Or 'All'
    // To adapt to mock design, let's treat any course without status as 'Active'
    const status = (c as any).status || 'Active';
    const matchFilter = activeFilter === 'All' || status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap size={26} className="text-[#2111D4]" />
            Course Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">{courses.length} courses in total • {courses.filter(c => c.status === 'Active').length} active</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#2111D4] hover:bg-[#1a0db0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2111D4]/30 hover:shadow-[#2111D4]/50 hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add New Course
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Courses', value: courses.length, color: '#2111D4' },
          { label: 'Active', value: courses.filter(c => ((c as any).status || 'Active') === 'Active').length, color: '#10b981' },
          { label: 'In Review', value: courses.filter(c => (c as any).status === 'Review').length, color: '#f59e0b' },
          { label: 'Drafts', value: courses.filter(c => (c as any).status === 'Draft').length, color: '#64748b' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ background: s.color }} />
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex bg-white/5 border border-white/10 text-slate-300 rounded-xl px-3 py-2.5 items-center flex-1 focus-within:ring-1 focus-within:ring-[#2111D4]/60 focus-within:border-[#2111D4]/60 transition-all group">
          <Search size={16} className="text-slate-500 group-focus-within:text-[#2111D4] mr-2 shrink-0 transition-colors" />
          <input
            type="text"
            placeholder="Search by title or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-500 text-slate-200"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#2111D4] text-white shadow-md shadow-[#2111D4]/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 border border-white/10 bg-white/5 text-slate-300 text-sm px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all shrink-0">
          <Filter size={14} />
          More Filters
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10 bg-white/5">
                <th className="text-left px-5 py-3.5 font-medium">Course</th>
                <th className="text-left px-5 py-3.5 font-medium">Category</th>
                <th className="text-left px-5 py-3.5 font-medium">Instructor</th>
                <th className="text-left px-5 py-3.5 font-medium">Students</th>
                <th className="text-left px-5 py-3.5 font-medium">Rating</th>
                <th className="text-left px-5 py-3.5 font-medium">Duration</th>
                <th className="text-left px-5 py-3.5 font-medium">Price</th>
                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                <th className="text-center px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-500">
                    <Loader2 size={40} className="mx-auto mb-3 opacity-30 animate-spin" />
                    <p>Loading courses...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-500">
                    <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No courses found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((course) => {
                  const catColor = categoryColors[course.category || 'Frontend'] ?? '#2111D4';
                  const cStatus = (course as any).status || 'Active';
                  return (
                    <tr key={course._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group relative">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${catColor}22` }}
                          >
                            <GraduationCap size={16} style={{ color: catColor }} />
                          </div>
                          <span className="text-white font-medium group-hover:text-indigo-300 transition-colors line-clamp-1">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2 py-1 rounded-md text-xs font-semibold"
                          style={{ background: `${catColor}20`, color: catColor }}
                        >
                          {course.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-center">{user?.name?.split(' ')[0] || adminName}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Users size={13} className="text-slate-500" />
                          {(course.enrollments || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-amber-400 font-semibold text-xs">{course.rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Clock size={12} />
                          {course.videos?.length || 0} Videos
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-300 font-semibold">${course.price || 0}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[cStatus] || statusStyle['Active']}`}>
                          {cStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button title="View" className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                            <Eye size={14} />
                          </button>
                          <button title="Edit" className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(course._id)} title="Delete" className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 text-xs text-slate-500">
          <span>Showing {filtered.length} of {courses.length} courses</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  p === 1 ? 'bg-[#2111D4] text-white' : 'text-slate-400 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0c20] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Create New Course</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Course Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2111D4] focus:border-[#2111D4] outline-none transition-all"
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2111D4] outline-none transition-all appearance-none"
                    value={newCourse.category}
                    onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                  >
                    {Object.keys(categoryColors).map(cat => (
                      <option key={cat} value={cat} className="bg-[#0d0c20]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Price ($)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2111D4] outline-none transition-all"
                    value={newCourse.price}
                    onChange={e => {
                      const value = e.target.value;
                      setNewCourse({
                        ...newCourse,
                        price: value === '' ? 0 : Number(value),
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2111D4] outline-none transition-all resize-none"
                  placeholder="Describe what students will learn..."
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#2111D4] text-white text-sm font-semibold hover:bg-[#1a0db0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Create Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
