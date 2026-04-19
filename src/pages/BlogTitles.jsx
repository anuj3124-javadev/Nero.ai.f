import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "../lib/axiosInstance";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Title Studio</h2>
              <p className="text-gray-500 text-xs">Viral blog headlines.</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Keyword or Topic
              </label>
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder="The future of AI..."
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:ring-2 ring-purple-500 transition-all dark:text-white text-sm"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {blogCategories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setSelectedCategory(item)}
                    className={`px-3 py-1.5 border rounded-lg transition-all duration-200 text-[10px] font-bold uppercase tracking-wider ${
                      selectedCategory === item
                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-400"
                        : "bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Hash className="w-4 h-4" />
                )}
                {loading ? "Optimizing..." : "Generate Titles"}
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
                  <Hash className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="font-bold text-sm dark:text-gray-200 tracking-tight">AI Generated Results</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                Draft Mode
              </span>
            </div>

            <div className="flex-1 p-6 relative">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-30 select-none">
                  <Sparkles className="w-20 h-20 mb-4" />
                  <p className="text-sm font-medium">Headlines will appear here</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="reset-tw">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                        <p className="text-purple-500 font-bold text-sm animate-pulse italic">Thinking of viral ideas...</p>
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

export default BlogTitles;
