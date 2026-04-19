import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="px-6 sm:px-20 xl:px-32 relative flex flex-col w-full
    justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat
    min-h-screen transition-colors duration-300 dark:bg-[#0f172a] dark:bg-none overflow-hidden pt-20"
    >
      <div className="text-center mb-8">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl
            font-black mx-auto leading-[1.1] dark:text-white uppercase italic tracking-tighter"
        >
          Create amazing content <br /> with
          <span className="text-primary"> Nero AI</span>{" "}
        </h1>
        <p
          className="mt-6 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto
        text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium"
        >
          Supercharge your creativity with Nero AI's powerful suite of features.
          Write blogs, generate stunning art, and streamline your digital workflow.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
        <button
          onClick={() => navigate("/ai")}
          className="bg-primary text-white px-10 py-4 rounded-2xl
        hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl shadow-primary/20 font-bold text-lg flex items-center justify-center gap-2"
        >
          Start creating now <ArrowRight className="w-5 h-5" />
        </button>
        <button
          className="bg-white dark:bg-gray-800 dark:text-white px-10 py-4 rounded-2xl border
        border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 transition-all
        cursor-pointer font-bold text-lg"
        >
          Watch demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600 dark:text-gray-400">
        <img src={assets.user_group} alt="" className="h-8 grayscale dark:invert" />
        <span className="font-medium animate-pulse">Trusted by 15k+ users worldwide</span>
      </div>
    </div>
  );
};

export default Hero;
