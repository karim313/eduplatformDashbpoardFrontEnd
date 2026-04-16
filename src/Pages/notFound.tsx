import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0914] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2111D4] opacity-5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600 opacity-5 blur-3xl rounded-full pointer-events-none" />

      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-2xl bg-linear-to-br from-[#2111D4] to-indigo-500 shadow-xl shadow-[#2111D4]/30">
            <BookOpen size={28} className="text-white" />
          </div>
        </div>

        {/* 404 */}
        <h1
          className="text-[120px] font-black leading-none select-none mb-2"
          style={{
            background: 'linear-gradient(135deg, #2111D4 0%, #6d28d9 50%, rgba(255,255,255,0.1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:border-white/30"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#2111D4] hover:bg-[#1a0db0] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2111D4]/30 hover:shadow-[#2111D4]/50 hover:scale-105 active:scale-95"
          >
            <Home size={15} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
