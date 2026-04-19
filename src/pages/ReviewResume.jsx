import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

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
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Resume review failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20 font-inter">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8 h-auto xl:h-[calc(100vh-160px)] flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Resume Expert</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider opacity-60">AI Optimization</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6 flex-1 flex flex-col">
            <div className="flex-1">
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Upload Resume (PDF)
              </label>
              <div className="relative group cursor-pointer h-full min-h-[160px]">
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
                  className="flex flex-col items-center justify-center w-full h-full px-4 py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all bg-gray-50/30 dark:bg-gray-900/30 cursor-pointer group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/10"
                >
                  {input ? (
                    <div className="text-center animate-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                         <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <p className="text-sm font-bold text-emerald-600 truncate max-w-[200px]">{input.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">Ready to scan</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">Tap to upload PDF</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Expert Scan Mode</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {loading ? "Scanning..." : "Begin Review"}
              </div>
            </button>
          </form>
        </div>

        {/* Right Column: Result */}
        <div className="flex-1 w-full flex flex-col h-auto min-h-[500px] xl:h-[calc(100vh-160px)]">
          <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm dark:text-gray-200">Expert Analysis</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Awaiting File</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 relative overflow-y-auto custom-scrollbar">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-800 select-none opacity-40">
                  <Sparkles className="w-20 h-20 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Neural Report Pending</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 leading-relaxed font-medium text-balance">
                  <Markdown>{content}</Markdown>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                        <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Analyzing Experience...</p>
                    </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 text-center">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-50 italic">Professional Resume Intelligence v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
