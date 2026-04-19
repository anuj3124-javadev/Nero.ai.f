import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import ThemeToggle from "./theme/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const navLinks = [
    { name: "Features", path: "/#features" },
    { name: "Pricing", path: "/#pricing" },
    { name: "Community", path: "/ai/community" },
  ];

  return (
    <div className="fixed z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 sm:px-12">
        
        {/* Logo */}
        <div 
          className='flex items-center gap-2 cursor-pointer group'
          onClick={()=>navigate("/")}
        >
          <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110'>
            N
          </div>
          <span className='font-bold text-xl tracking-tight dark:text-white'>Nero<span className='text-primary'>.ai</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:block">
            {user ? (
              <UserButton />
            ) : (
              <button 
                onClick={openSignIn}
                className="flex items-center gap-2 rounded-full text-sm font-bold bg-primary text-white px-8 py-3 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-white dark:bg-gray-950 transition-transform duration-500 ${mobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 pt-24 space-y-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              onClick={() => setMobileMenu(false)}
              className="text-2xl font-black dark:text-white hover:text-primary transition-colors italic uppercase"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-8 border-t dark:border-gray-800">
             {user ? (
              <div className="flex items-center gap-4">
                <UserButton />
                <span className="font-bold dark:text-white">{user.fullName}</span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setMobileMenu(false);
                  openSignIn();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl text-lg font-bold bg-primary text-white py-5 shadow-xl shadow-primary/20"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
