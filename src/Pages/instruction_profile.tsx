import { useState, useEffect } from 'react';
import { instructorService, coursesService } from '../Services/services';
import type { Course } from '../Services/services';
import {
  User,
  Mail,
  Phone,
  Globe,
  Star,
  BookOpen,
  Users,
  Award,
  GraduationCap,
  TrendingUp,
  Linkedin,
  Twitter,
  Youtube,
  CheckCircle,
  Clock,
  Edit3,
} from 'lucide-react';


export default function Instruction_profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'reviews'>('overview');
  const tabs: Array<'overview' | 'courses' | 'reviews'> = ['overview', 'courses', 'reviews'];
  const [stats, setStats] = useState({ students: 0, courses: 0, reviews: 0 });
  const [adminData, setAdminData] = useState({ name: 'Admin', email: 'admin@eduplatform.com' });
  const [realCourses, setRealCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Fetch users info for admin profile data
    instructorService.getUsers().then(res => {
      const data = res.data as any;
      const userList = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
      
      let enrollmentSum = 0;
      let foundAdmin: { name: string; email: string } | null = null;

      userList.forEach((u: any) => {
        enrollmentSum += u.enrollmentCount || 0;
        if (u.role === 'admin' && !foundAdmin) {
          foundAdmin = {
            name: typeof u.name === 'string' ? u.name : 'Admin',
            email: typeof u.email === 'string' ? u.email : 'admin@eduplatform.com'
          };
        }
      });

      if (foundAdmin) {
        setAdminData({ name: (foundAdmin as { name: string; email: string }).name, email: (foundAdmin as { name: string; email: string }).email });
      }

      setStats(prev => ({
        ...prev,
        students: enrollmentSum
      }));
    }).catch(console.error);

    // Fetch real courses list
    coursesService.getAll().then(res => {
      const data = res.data as any;
      const courseList = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
      setRealCourses(courseList);
      setStats(prev => ({ ...prev, courses: courseList.length }));
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User size={24} className="text-[#2111D4]" />
            Instructor Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1">View and manage instructor details</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2111D4] hover:bg-[#1a0db0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2111D4]/30 hover:scale-105 active:scale-95">
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column - Profile Card */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Main Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#2111D4] opacity-10 blur-3xl rounded-full" />
            </div>

            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl mx-auto bg-linear-to-br from-[#2111D4] to-indigo-500 p-0.5 shadow-xl shadow-[#2111D4]/30">
                <div className="w-full h-full rounded-[14px] bg-[#0d0c20] flex items-center justify-center">
                  <User size={40} className="text-slate-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0A0914] rounded-full" />
            </div>

            <h2 className="text-lg font-bold text-white">{adminData.name}</h2>
            <p className="text-sm text-slate-400 mt-1 capitalize">Platform Administrator</p>

            {/* Rating Row */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-1 text-amber-400 font-bold text-sm">4.9</span>
              <span className="text-slate-500 text-xs">({stats.reviews})</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-white/10">
              {[
                { label: 'Enrollments', value: stats.students.toLocaleString(), icon: Users },
                { label: 'Courses', value: stats.courses, icon: BookOpen },
                { label: 'Rating', value: '4.9', icon: Star },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center">
                    <p className="text-base font-bold text-white flex items-center gap-1">
                      <Icon size={14} className="text-indigo-400" />
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white mb-3">Contact Information</h3>
            {[
              { icon: Mail, label: adminData.email },
              { icon: Phone, label: '+20 100 234 5678' },
              { icon: Globe, label: 'eduplatform.com' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 text-sm text-slate-400 group">
                  <div className="p-2 rounded-lg bg-[#2111D4]/15 group-hover:bg-[#2111D4]/25 transition-colors">
                    <Icon size={14} className="text-[#2111D4]" />
                  </div>
                  <span className="group-hover:text-slate-200 transition-colors">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Socials */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Social Media</h3>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, color: '#0a66c2', label: 'LinkedIn' },
                { icon: Twitter, color: '#1d9bf0', label: 'Twitter' },
                { icon: Youtube, color: '#ff0000', label: 'YouTube' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    title={s.label}
                    className="flex-1 flex items-center justify-center p-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all group"
                    style={{ color: s.color }}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expertise */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'TailwindCSS'].map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2111D4]/20 text-indigo-300 border border-[#2111D4]/30 hover:bg-[#2111D4]/30 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Bio Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-[#2111D4]" />
              <h3 className="text-sm font-semibold text-white">About</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Platform administrator managing educational content and user experiences. Dedicated to providing quality online learning experiences.</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
              <CheckCircle size={13} className="text-emerald-400" />
              <span>Verified Administrator</span>
              <span className="text-slate-600">•</span>
              <Clock size={12} />
              <span>Joined January 2022</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="flex border-b border-white/10 bg-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-[#2111D4] bg-[#2111D4]/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Completion Rate', value: '94%', icon: TrendingUp, color: '#10b981' },
                    { label: 'Avg. Response Time', value: '< 2 hours', icon: Clock, color: '#2111D4' },
                    { label: 'Total Enrollments', value: '2,840', icon: Users, color: '#6d28d9' },
                    { label: 'Total Certificates', value: '1,120', icon: GraduationCap, color: '#b45309' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={15} style={{ color: item.color }} />
                          <span className="text-xs text-slate-400">{item.label}</span>
                        </div>
                        <p className="text-xl font-bold text-white">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="space-y-3">
                  {realCourses.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                      <BookOpen size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No courses available yet</p>
                    </div>
                  ) : (
                    realCourses.map((course, i) => (
                      <div key={course._id || i} className="flex items-center gap-4 p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-[#2111D4]/20 flex items-center justify-center shrink-0">
                          <BookOpen size={16} className="text-[#2111D4]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">{course.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Users size={10} /> {course.enrollments || 0}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                              <Star size={10} className="fill-amber-400" /> {course.rating || 0}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
                          (course.status || 'Active') === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                        }`}>
                          {course.status || 'Active'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-10 text-slate-500">
                  <Star size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No reviews available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
