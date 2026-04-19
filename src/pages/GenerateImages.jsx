import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style"
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in ${selectedStyle}`;
  
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
  
      if (data.success) {
        setContent(data.imageUrl); 
        // If image was published, refresh the community page
        if (publish && window.refreshCommunity) {
          setTimeout(() => {
            window.refreshCommunity();
          }, 1000); // Small delay to ensure the image is saved
        }
      } else {
        toast.error(data.message || "Image generation failed.");
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
        <form
          onSubmit={onSubmitHandler}
          className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold dark:text-white">Image Studio</h1>
              <p className="text-gray-500 text-xs">AI Visual Generator</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Prompt Details
              </label>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                value={input}
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:ring-2 ring-green-500 transition-all dark:text-white text-sm resize-none"
                placeholder="A futuristic city in the style of cyberpunk..."
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-3 block">
                Visual Style
              </label>
              <div className="flex flex-wrap gap-2">
                {imageStyle.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setSelectedStyle(item)}
                    className={`text-[10px] uppercase tracking-widest font-bold px-3 py-2 border rounded-lg transition-all ${
                      selectedStyle === item
                        ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                        : "bg-transparent border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold dark:text-gray-200">Public Gallery</span>
                <span className="text-[10px] text-gray-500">Showcase your creation</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setPublish(e.target.checked)}
                  checked={publish}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Image className="w-4 h-4" />
                )}
                {loading ? "Simulating..." : "Generate Magic"}
              </div>
            </button>
          </div>
        </form>

        {/* Right Column: Result Area */}
        <div className="flex-1 w-full bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-1 flex flex-col min-h-[500px] xl:h-[calc(100vh-160px)]">
          <div className="p-5 border-b dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Image className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-bold text-sm dark:text-gray-200">Studio Output</h3>
            </div>
          </div>

          <div className="flex-1 p-8 relative flex items-center justify-center overflow-hidden">
            {!content ? (
              <div className="flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 select-none animate-in fade-in duration-700">
                <Sparkles className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Awaiting prompt</p>
              </div>
            ) : (
              <div className="relative group w-full h-full flex items-center justify-center p-4">
                 <img
                    src={content}
                    alt="Generated"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end justify-center p-6">
                     <span className="bg-white/90 dark:bg-gray-950/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Creation Saved</span>
                  </div>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                  <p className="text-green-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Neural Rendering...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
