import { Scissors, Sparkles, Download, ImageIcon, Wand2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import StudioWrapper from "../components/ui/StudioWrapper";

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
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
      link.download = `nero-healed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      console.error("Download Error:", error);
      toast.error('Failed to download image.');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.split(" ").length > 3) {
        setLoading(false);
        return toast.error("Describe the object in 1-3 words max.");
      }
      
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.imageUrl || data.content);
        toast.success("Area Healed!");
      } else {
        toast.error(data.message || "Image healing failed.");
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
            Visual Source Upload
          </label>
          <div className="relative group cursor-pointer h-40 w-full">
            <input
              onChange={(e) => setInput(e.target.files[0])}
              accept="image/*"
              type="file"
              id="healer-upload"
              className="hidden"
              required
            />
            <label 
              htmlFor="healer-upload"
              className="flex flex-col items-center justify-center w-full h-full px-5 py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all bg-gray-50/20 dark:bg-gray-900/10 cursor-pointer group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10"
            >
              {input ? (
                <div className="text-center animate-in zoom-in-95 duration-500">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/10">
                     <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 truncate max-w-[150px] mb-1">{input.name}</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm border border-gray-50 dark:border-gray-800">
                    <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Select Target Image</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2 block">
            Target Entity to Erase
          </label>
          <div className="relative">
            <input
              onChange={(e) => setObject(e.target.value)}
              value={object}
              type="text"
              placeholder="e.g., 'the coffee cup'..."
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
             <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {loading ? "Healing..." : "Heal Canvas"}
        </div>
      </button>
    </form>
  );

  const rightColumn = (
    <div className="flex-1 p-8 sm:p-12 relative flex items-center justify-center overflow-hidden h-full">
      {!content && !loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-800 select-none opacity-40">
          <Sparkles className="w-24 h-24 mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Instruction</p>
        </div>
      ) : content ? (
        <div className="relative group w-full h-full flex flex-col items-center justify-center gap-8">
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden p-4">
             <img
                src={content}
                alt="Healed"
                className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-[1.01] animate-in zoom-in-95 duration-1000"
              />
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 animate-in slide-in-from-bottom-4 duration-700"
          >
            <Download className="w-4 h-4" /> Finalize Asset
          </button>
        </div>
      ) : null}

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-b-4 border-blue-600 animate-spin"></div>
                <div className="text-center">
                  <p className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Healing Texture Map...</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">Running selective generative fill</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <StudioWrapper 
      title="Heal Studio"
      subtitle="Generative Texture Inpainting"
      icon={Scissors}
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      accentColor="blue"
      footerText="Nero Generative Healing v3.0"
    />
  );
};

export default RemoveObject;
