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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Resume Expert</h2>
              <p className="text-gray-500 text-xs">AI resume optimization.</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Upload Resume (PDF)
              </label>
              <div className="relative group cursor-pointer">
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
                  className="flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all bg-gray-50/50 dark:bg-gray-900/50 cursor-pointer"
                >
                  {input ? (
                    <div className="text-center">
                      <p className="text-xs font-bold text-emerald-500">Selected</p>
                      <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[150px]">{input.name}</p>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-xs font-medium text-gray-500 text-center">Click to upload PDF</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {loading ? "Analyzing..." : "Review Resume"}
              </div>
            </button>
          </form>
        </div>

        {/* Right Column: Result */}
        <div className="flex-1 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-1 flex flex-col min-h-[500px]">
            <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-bold text-sm dark:text-gray-200 tracking-tight">AI Expert Analysis</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                Final Report
              </span>
            </div>

            <div className="flex-1 p-6 relative">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-30 select-none">
                  <Sparkles className="w-20 h-20 mb-4" />
                  <p className="text-sm font-medium">Analysis will appear here</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 leading-relaxed">
                  <Markdown>{content}</Markdown>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                        <p className="text-emerald-500 font-bold text-sm animate-pulse italic">Scanning resume details...</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
