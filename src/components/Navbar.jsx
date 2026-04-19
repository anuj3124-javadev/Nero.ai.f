import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import ThemeToggle from "./theme/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div
      className="fixed z-5 w-full backdrop:blur-2xl flex justify-between
    items-center py-3 px-4 sm:px-20 xl:px-32"
    >
      <div 
        className='flex items-center gap-2 cursor-pointer group'
        onClick={()=>navigate("/")}
      >
        <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110'>
          N
        </div>
        <span className='font-bold text-xl tracking-tight dark:text-white'>Nero<span className='text-primary'>.ai</span></span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <UserButton />
        ) : (
          <button onClick={openSignIn}
            className="flex items-center gap-2 rounded-full text-sm
          cursor-pointer bg-primary text-white px-10 py-2.5"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
