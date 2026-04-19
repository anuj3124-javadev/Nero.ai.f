import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, Sparkles, LayoutDashboard } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import ThemeToggle from "./theme/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const navLinks = [
    { name: "Features", path: "/#features" },
    { name: "Community", path: "/ai/community" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-gray-100 dark:border-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 sm:px-12">
        
        {/* Logo */}
        <div 
          className='flex items-center gap-3 cursor-pointer group'
          onClick={()=>navigate("/")}
        >
          <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110'>
            N
          </div>
          <span className='font-bold text-xl tracking-tight dark:text-white flex items-center gap-1'>
            Nero<span className='text-indigo-600 dark:text-indigo-400'>AI</span>
            <Sparkles className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              className="text-[13px] font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={()=>navigate("/ai")}
                  className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <button 
                onClick={openSignIn}
                className="flex items-center gap-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-white dark:bg-gray-950 transition-all duration-500 ease-in-out ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full px-8 pt-32 space-y-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              onClick={() => setMobileMenu(false)}
              className="text-4xl font-bold dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors tracking-tighter"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
             {user ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <UserButton afterSignOutUrl="/" />
                   <div>
                     <p className="font-bold dark:text-white">{user.fullName}</p>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Standard Account</p>
                   </div>
                </div>
                <button 
                   onClick={()=>{setMobileMenu(false); navigate("/ai")}}
                   className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                >
                   <LayoutDashboard className="w-5 h-5" /> Go to Studio
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setMobileMenu(false);
                  openSignIn();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl text-lg font-black uppercase tracking-widest bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 shadow-2xl"
              >
                Sign In <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
