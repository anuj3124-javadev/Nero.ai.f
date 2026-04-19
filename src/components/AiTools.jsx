import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowUpRight } from "lucide-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div id="features" className="px-6 sm:px-20 xl:px-32 py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      {/* Decorative background element */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-gray-900 dark:text-white text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Intelligent Studio Ecosystem
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Consolidate your creative workflow with our specialized neural modules. 
            Engineered for precision, speed, and professional-grade results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AiToolsData.map((tool, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-[2rem] bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-500 cursor-pointer overflow-hidden"
              onClick={() => user && navigate(tool.path)}
            >
              <div className="relative h-full flex flex-col bg-white dark:bg-gray-900 rounded-[1.8rem] p-1">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg mb-6 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}
                >
                  <tool.Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Open Studio
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiTools;
