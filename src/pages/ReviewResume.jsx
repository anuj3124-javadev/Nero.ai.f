import { FileText, Sparkles, UploadCloud, Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import StudioWrapper from "../components/ui/StudioWrapper";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Analysis Complete!");
      } else {
        toast.error(data.message || "Resume review failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const leftColumn = (
    <form onSubmit={onSubmitHandler} className="space-y-6 h-full flex flex-col">
      <div className="space-y-6 flex-1">
        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 block">
            Manuscript Upload
          </label>
          <div className="relative group cursor-pointer h-48 w-full">
            <input
              onChange={(e) => setInput(e.target.files[0])}
              accept="application/pdf"
              type="file"
              id="resume-upload"
              className="hidden"
              required
            />
            <label 
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center w-full h-full px-5 py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all bg-gray-50/20 dark:bg-gray-900/10 cursor-pointer group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/10"
            >
              {input ? (
                <div className="text-center animate-in zoom-in-95 duration-500">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
                     <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate max-w-[150px] mb-1">{input.name}</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm border border-gray-50 dark:border-gray-800">
                    <UploadCloud className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Select Resume (PDF)</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
           <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-relaxed font-bold">
             Note: Hierarchical semantic mapping active.
           </p>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl hover:bg-emerald-600 dark:hover:bg-emerald-50 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
             <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <Search className="w-4 h-4" />
          )}
          {loading ? "Scanning..." : "Execute Audit"}
        </div>
      </button>
    </form>
  );

  const rightColumn = (
    <div className="flex-1 p-8 sm:p-12 relative overflow-y-auto custom-scrollbar h-full">
      {!content && !loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-800 select-none opacity-40">
          <Sparkles className="w-24 h-24 mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Portfolio Seed</p>
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
                <div className="w-16 h-16 rounded-full border-b-4 border-emerald-600 animate-spin"></div>
                <div className="text-center">
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Scanning Experience...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">Mapping professional trajectories</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <StudioWrapper 
      title="Resume Expert"
      subtitle="Professional Optimization Audit"
      icon={FileText}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      accentColor="emerald"
      footerText="Nero Talent Intelligence v2.0"
    />
  );
};

export default ReviewResume;
