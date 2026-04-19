import { Edit, Sparkles, Hash, FileText } from "lucide-react";
import React, { useState } from "react";
import axios from '../lib/axiosInstance'
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import StudioWrapper from "../components/ui/StudioWrapper";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Concise (500-800 words)" },
    { length: 1200, text: "Standard (800-1200 words)" },
    { length: 1600, text: "Detailed (1200-1600 words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write a professional, SEO-optimized article about "${input}" with a target length of approximately ${selectedLength.text}. Use clear headings and structured paragraphs.`;

      const { data } = await axios.post('/api/ai/generate-article', 
        { prompt, length: selectedLength.length }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Manuscript Compiled!");
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
            Subject Matter
          </label>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="The integration of AI in modern surgical procedures..."
            className="w-full px-5 py-4 rounded-[1.5rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500/50 transition-all dark:text-white text-sm min-h-[120px] resize-none"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 block">
            Target Complexity
          </label>
          <div className="space-y-2">
            {articleLength.map((item, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`w-full flex items-center justify-between px-5 py-3 border-2 rounded-xl transition-all duration-300 ${
                  selectedLength.text === item.text
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-lg shadow-indigo-500/5"
                    : "bg-transparent border-gray-50 dark:border-gray-800/50 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-3.5 h-3.5 ${selectedLength.text === item.text ? 'text-indigo-500' : 'text-gray-300'}`} />
                  <span className="text-[12px] font-bold">{item.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <Hash className="w-4 h-4" />
          )}
          {loading ? "Compiling..." : "Generate Manuscript"}
        </div>
      </button>
    </form>
  );

  const rightColumn = (
    <div className="flex-1 p-8 sm:p-12 relative overflow-y-auto custom-scrollbar h-full">
      {!content && !loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-800 select-none opacity-40">
          <Sparkles className="w-24 h-24 mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">Initialize Transmission</p>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-6 duration-1000 leading-relaxed text-balance">
          <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-b-4 border-indigo-600 animate-spin"></div>
                <div className="text-center">
                  <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Neural Drafting...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">Architecting semantic structures</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <StudioWrapper 
      title="Writing Studio"
      subtitle="Semantic Content Synthesis"
      icon={Edit}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      accentColor="indigo"
      footerText="Nero Writing Intelligence v4.0"
    />
  );
};

export default WriteArticle;
