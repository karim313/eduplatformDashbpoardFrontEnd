import { Search, Bell, UserCircle, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

interface NavbarProps {
    onSidebarToggle?: () => void;
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
    const { user, logout } = useAuth();
    return (
        <header className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 bg-[#0A0914]/80 backdrop-blur-md z-30 gap-4">
            {/* Mobile Menu Button */}
            <button 
                onClick={onSidebarToggle}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Toggle sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="hidden sm:flex bg-white/5 border border-white/10 text-slate-300 rounded-xl px-3 py-2 items-center flex-1 max-w-sm focus-within:ring-2 focus-within:ring-[#2111D4]/50 focus-within:border-[#2111D4] transition-all group">
                <Search size={18} className="text-slate-500 group-focus-within:text-[#2111D4] mr-2 transition-colors shrink-0" />
                <input
                    type="text"
                    placeholder="Search courses, users..."
                    className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-500 text-slate-200"
                />
            </div>

            {/* Right Side Items */}
            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                <button className="text-slate-400 hover:text-white transition-colors relative shrink-0">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 bg-[#2111D4] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg shadow-[#2111D4]/40">
                        2
                    </span>
                </button>

                {/* Admin Info */}
                <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-3 sm:pl-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-semibold text-white tracking-wide line-clamp-1">{user?.name || 'Admin Name'}</span>
                        <span className="text-xs text-slate-400 capitalize">{user?.role || 'Super Admin'}</span>
                    </div>

                    <div className="h-10 w-10 p-[2px] rounded-full bg-linear-to-br from-[#2111D4] to-indigo-500 shadow-lg shadow-[#2111D4]/20 flex items-center justify-center shrink-0">
                        <div className="h-full w-full bg-[#0A0914] rounded-full flex items-center justify-center text-slate-300">
                            <UserCircle size={24} />
                        </div>
                    </div>
                    
                    <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors shrink-0" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>

                {/* Mobile User Menu */}
                <div className="sm:hidden flex items-center gap-2">
                    <div className="h-9 w-9 p-[2px] rounded-full bg-linear-to-br from-[#2111D4] to-indigo-500 shadow-lg shadow-[#2111D4]/20 flex items-center justify-center">
                        <div className="h-full w-full bg-[#0A0914] rounded-full flex items-center justify-center text-slate-300">
                            <UserCircle size={20} />
                        </div>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}