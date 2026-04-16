import { Button } from "./button";
import { LayoutDashboard, GraduationCap, UsersRound, Settings2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const handleNavClick = () => {
        onClose?.();
    };

    return (
        <div className="flex flex-col h-full bg-[#0A0914] pt-8 px-4 overflow-y-auto">
            {/* Branding */}
            <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
                <div className="p-2 rounded-xl bg-linear-to-br from-[#2111D4] to-indigo-500 shadow-lg shadow-[#2111D4]/20 flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md whitespace-nowrap">
                    EduPlatform
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
                <Link to="/dashboard" onClick={handleNavClick}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-all group border-none text-sm"
                    >
                        <LayoutDashboard size={20} className="mr-3 text-slate-400 group-hover:text-[#2111D4] transition-colors shrink-0" />
                        <span className="truncate">Dashboard</span>
                    </Button>
                </Link>

                <Link to="/course-management" onClick={handleNavClick}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-all group border-none text-sm"
                    >
                        <GraduationCap size={20} className="mr-3 text-slate-400 group-hover:text-[#2111D4] transition-colors shrink-0" />
                        <span className="truncate">Courses</span>
                    </Button>
                </Link>

                <Link to="/instruction_profile" onClick={handleNavClick}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-all group border-none text-sm"
                    >
                        <UsersRound size={20} className="mr-3 text-slate-400 group-hover:text-[#2111D4] transition-colors shrink-0" />
                        <span className="truncate">Instructor Profile</span>
                    </Button>
                </Link>

                <Link to="/course-video-content" onClick={handleNavClick}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-all group border-none text-sm"
                    >
                        <Settings2 size={20} className="mr-3 text-slate-400 group-hover:text-[#2111D4] transition-colors shrink-0" />
                        <span className="truncate">Video Content</span>
                    </Button>
                </Link>
            </nav>
        </div>
    );
}