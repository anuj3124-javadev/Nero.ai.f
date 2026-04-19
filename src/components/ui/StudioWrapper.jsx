import React from 'react';
import { Sparkles } from 'lucide-react';

const StudioWrapper = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  leftColumn, 
  rightColumn, 
  accentColor = "indigo",
  footerText = "Neural Engine v2.0"
}) => {
  const colorMap = {
    indigo: "indigo-600",
    blue: "blue-600",
    rose: "rose-600",
    emerald: "emerald-600",
    amber: "amber-600",
    purple: "purple-600",
  };

  const accent = colorMap[accentColor] || "indigo-600";

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Column: Configuration Panels */}
        <div className="w-full xl:w-[400px] flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 h-auto xl:min-h-[calc(100vh-180px)] xl:flex xl:flex-col overflow-hidden relative">
            
            {/* Background Glow */}
            <div className={`absolute -top-20 -left-20 w-48 h-48 bg-${accentColor}-500/5 blur-[80px] rounded-full pointer-events-none`} />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-${accentColor}-50 dark:bg-${accentColor}-950/30 text-${accent} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight dark:text-white">{title}</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">Workspace</p>
              </div>
            </div>

            <div className="flex-1 relative z-10">
              {leftColumn}
            </div>

            {/* Subtle branding at bottom of panel */}
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50 hidden xl:block">
               <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                 <Sparkles className="w-3 h-3 text-amber-400" /> Authorized Nero Studio Lab
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output / Visualization Canvas */}
        <div className="flex-1 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 h-auto min-h-[400px] xl:h-[calc(100vh-180px)] flex flex-col overflow-hidden relative group">
             
             {/* Header of Canvas */}
             <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 cursor-default">Inference Status</span>
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                   <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </div>
             </div>

             <div className="flex-1 relative flex flex-col min-h-0">
                {rightColumn}
             </div>

             {/* Footer of Canvas */}
             <div className="px-6 py-3 border-t border-gray-50 dark:border-gray-800 bg-gray-50/10 dark:bg-gray-900/20 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 italic">{footerText}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioWrapper;
