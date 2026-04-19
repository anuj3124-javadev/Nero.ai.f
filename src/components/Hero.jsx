import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Wand2, ShieldCheck } from "lucide-react";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate pt-14 dark:bg-gray-950 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background Gradients */}
      <div 
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
        aria-hidden="true"
      >
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
      </div>

      <div className="w-full px-6 lg:px-12 py-24 sm:py-32 flex flex-col items-center">
        
        {/* Floating Badge */}
        <div className="mb-10 flex justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] leading-6 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-400/20 bg-indigo-50/50 dark:bg-indigo-400/5 backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Next Generation AI Interface
          </div>
        </div>

        <div className="text-center w-full max-w-[90rem]">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 italic tracking-tighter">
            Unleash Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
               Creative Intellect
            </span>
          </h1>
          
          <p className="mt-12 text-lg font-medium leading-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto sm:text-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
             Experience the official Nero AI ecosystem. From neural conversations to studio-grade visual healing—supercharge your workflow with professional-grade intelligence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button
              onClick={() => navigate("/ai")}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gray-900 dark:bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-white dark:text-gray-900 shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-95"
            >
              Start Creating <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
               className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Wand2 className="w-4 h-4" /> Watch the demo
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Pattern */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div 
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
      </div>
    </div>
  );
};

export default Hero;
