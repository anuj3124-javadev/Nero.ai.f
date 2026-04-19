import { Edit, Sparkle, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from '../lib/axiosInstance'
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";


const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/api/ai/generate-article', {prompt,
         length: selectedLength.length},{
          headers:{Authorization: `Bearer ${await getToken()}` } 
         })

         if(data.success){
          setContent(data.content)
         }else{
          toast.error(data.message)
         }

    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  };
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Article Config</h2>
              <p className="text-gray-500 text-xs text-balance">Refine your AI content.</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Topic or Keyword
              </label>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder="The future of artificial intelligence in 2025..."
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white text-sm min-h-[100px] resize-none"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-3 block">
                Target Length
              </label>
              <div className="grid grid-cols-1 gap-2">
                {articleLength.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedLength(item)}
                    className={`text-left px-4 py-3 border rounded-xl transition-all duration-200 text-xs font-medium ${
                      selectedLength.text === item.text
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400"
                        : "bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Edit className="w-4 h-4" />
                )}
                {loading ? "Generating..." : "Generate Content"}
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
                  <Edit className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-sm dark:text-gray-200 tracking-tight">AI Output</h3>
              </div>
              {content && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                  {selectedLength.length} Words
                </span>
              )}
            </div>

            <div className="flex-1 p-6 relative">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-30 select-none">
                  <Sparkles className="w-20 h-20 mb-4" />
                  <p className="text-sm font-medium">Article content will appear here</p>
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
                        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                        <p className="text-blue-500 font-bold text-sm animate-pulse italic">Crafting your content...</p>
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

export default WriteArticle;
