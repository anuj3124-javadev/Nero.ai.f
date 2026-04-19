import { Image, Sparkles, Wand2, Share2, Download, Aperture } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import StudioWrapper from "../../components/ui/StudioWrapper";

const ImageGenerator = () => {
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

  const handleDownload = async () => {
    if (!content) return;
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nero-creation-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Asset Downloaded!');
    } catch (error) {
      console.error("Download Error:", error);
      toast.error('Download failed.');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a high-resolution, professional image of ${input} in a ${selectedStyle}. Cinematic lighting, studio detail.`;
  
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
  
      if (data.success) {
        setContent(data.imageUrl); 
        toast.success("Image Manifested!");
        if (publish && window.refreshCommunity) {
          setTimeout(() => window.refreshCommunity(), 1000);
        }
      } else {
        toast.error(data.message || "Inference failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const leftColumn = (
    <form onSubmit={onSubmitHandler} className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 block">
            Semantic Prompt
          </label>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            value={input}
            className="w-full px-5 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 outline-none focus:ring-4 ring-emerald-500/10 focus:border-emerald-500/50 transition-all dark:text-white text-xs resize-none"
            placeholder="A cyberpunk bioluminescent forest..."
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 block">
            Aesthetic Vision
          </label>
          <div className="grid grid-cols-2 gap-2">
            {imageStyle.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setSelectedStyle(item)}
                className={`flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all duration-300 text-[9px] font-black uppercase tracking-widest ${
                  selectedStyle === item
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/5"
                    : "bg-transparent border-gray-50 dark:border-gray-800/50 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <Aperture className={`w-3 h-3 ${selectedStyle === item ? 'animate-spin' : ''}`} />
                {item.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/30 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-gray-200 leading-none">Public Gallery</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-60">Manifest to Community</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
              disabled={loading}
            />
            <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-700 peer-checked:bg-emerald-600 shadow-sm transition-all group-active:scale-90"></div>
          </label>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl hover:bg-emerald-600 dark:hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
             <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {loading ? "Manifesting..." : "Forge Creation"}
        </div>
      </button>
    </form>
  );

  const rightColumn = (
    <div className="flex-1 p-8 sm:p-12 relative flex items-center justify-center overflow-hidden h-full">
      {!content && !loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-700 select-none opacity-20">
          <Sparkles className="w-32 h-32 mb-8 animate-pulse" />
          <p className="text-[12px] font-black uppercase tracking-[0.5em]">Neural Blueprint Pending</p>
        </div>
      ) : content ? (
        <div className="relative group w-full h-full flex flex-col items-center justify-center gap-8">
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden p-4">
             <img
                src={content}
                alt="Generated asset"
                className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.03] animate-in zoom-in-90 duration-1000"
              />
          </div>
          
          <div className="flex items-center gap-4 animate-in slide-in-from-bottom-6 duration-700">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-700 px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              <Download className="w-4 h-4" /> Save Local
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
               <Share2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      ) : null}

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-b-4 border-emerald-600 animate-spin"></div>
                <div className="text-center">
                  <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Neural Rendering...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">Simulating hyper-realistic geometry</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <StudioWrapper 
      title="Visual Studio"
      subtitle="Generative Latent Diffusion"
      icon={Wand2}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      accentColor="emerald"
      footerText="Nero Imaging Pipeline v6.0"
    />
  );
};

export default ImageGenerator;
