import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles, Zap, Target } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "../lib/axiosInstance";
import StudioWrapper from "../components/ui/StudioWrapper";

const BlogTitles = () => {
  const blogCategories = [
    "Tech", "Business", "Health", "Life", "Edu", "Travel", "Food", "Viral"
  ];

  const [selectedCategory, setSelectedCategory] = useState("Tech");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate exactly 10 high-engagement, viral blog titles for the topic: "${input}" in the category: ${selectedCategory}. Return them in a clean Markdown numbered list.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setContent(data.content);
        toast.success("Hooks Generated!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const leftColumn = (
    <form onSubmit={onSubmitHandler} className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 block">
            Core Concept
          </label>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="The psychology of color in UI design..."
            className="w-full px-5 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 outline-none focus:ring-4 ring-purple-500/10 focus:border-purple-500/50 transition-all dark:text-white text-sm"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 block">
            Category Context
          </label>
          <div className="grid grid-cols-2 gap-2">
            {blogCategories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`px-3 py-2 border-2 rounded-lg transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                  selectedCategory === item
                    ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-500 text-purple-700 dark:text-purple-400 shadow-lg shadow-purple-500/5"
                    : "bg-transparent border-gray-50 dark:border-gray-800/50 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl hover:bg-purple-600 dark:hover:bg-purple-50 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
             <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? "Optimizing..." : "Formulate Hooks"}
        </div>
      </button>
    </form>
  );

  const rightColumn = (
    <div className="flex-1 p-8 sm:p-12 relative overflow-y-auto custom-scrollbar h-full">
      {!content && !loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-800 select-none opacity-40">
          <Target className="w-24 h-24 mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Seed Input</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-b-4 border-purple-600 animate-spin"></div>
                <div className="text-center">
                  <p className="text-purple-600 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Analyzing Engagement...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">Running viral compatibility tests</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <StudioWrapper 
      title="Hook Generator"
      subtitle="Viral Concept Synthesis"
      icon={Hash}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      accentColor="purple"
      footerText="Nero Hook Intelligence v3.0"
    />
  );
};

export default BlogTitles;
