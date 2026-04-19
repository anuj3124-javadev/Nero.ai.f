import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  CreditCard,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "DashBoard", Icon: House },
  { to: "/ai/chatbot", label: "AI Chatbot", Icon: MessageSquare },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/image-generator", label: "Image Studio", Icon: Sparkles },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex
    flex-col justify-between items-center max-sm:absolute top-14
    bottom-0 ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
    transition-all duration-300 z-10`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center dark:text-white">{user.fullName}</h1>
        <div className="px-6 mt-5 text-sm text-gray-600 dark:text-gray-400 font-medium overflow-y-auto w-full">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `relative group px-4 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/20"
                : "text-gray-500 hover:text-primary"
            }`}
            >
              {({ isActive }) => (
                <>
                  {/* Hover Highlight Animation */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary/5 rounded-xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                  )}
                  
                  <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}`} />
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-100 dark:border-slate-800 p-4 px-7 flex items-center
      justify-between bg-white dark:bg-slate-900">
        <div onClick={openUserProfile} className="flex gap-2 items-center cursor-pointer">
          <img src={user.imageUrl} className="w-8 rounded-full border border-gray-200 dark:border-slate-700" alt="" />
          <div>
            <h1 className="text-sm font-medium dark:text-white">{user.fullName}</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Free Account
            </p>
          </div>
        </div>
        <LogOut onClick={signOut} className="w-4.5 text-gray-400
        hover:text-primary transition-colors cursor-pointer"/>
      </div>
    </div>
  );
};

export default Sidebar;
