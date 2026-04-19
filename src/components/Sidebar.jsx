import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/chatbot", label: "AI Chatbot", Icon: MessageSquare },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/image-generator", label: "Image Generator", Icon: Sparkles },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed lg:relative inset-y-0 left-0 w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800/60 z-[50] transition-transform duration-500 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800/50">
        <div 
          className='flex items-center gap-2 cursor-pointer group'
          onClick={()=>navigate("/")}
        >
          <div className='w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20'>
            N
          </div>
          <span className='font-bold text-lg tracking-tighter dark:text-white'>Nero<span className='text-indigo-600'>AI</span></span>
        </div>
        <button 
           onClick={() => setSidebarOpen(false)}
           className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-600 mb-4">Core Ecosystem</p>
        
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/ai"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative ${
              isActive
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110`} />
            <span className="text-sm tracking-tight">{label}</span>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
               <ChevronRight className="w-3 h-3" />
            </div>
          </NavLink>
        ))}
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all group">
          <div onClick={openUserProfile} className="flex gap-3 items-center cursor-pointer">
            <img 
              src={user.imageUrl} 
              className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" 
              alt="Avatar" 
            />
            <div className="min-w-0">
              <h1 className="text-sm font-bold dark:text-white truncate max-w-[120px]">{user.firstName || 'User'}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Free Account</p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

// Internal Helper Icon
const ChevronRight = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Sidebar;
