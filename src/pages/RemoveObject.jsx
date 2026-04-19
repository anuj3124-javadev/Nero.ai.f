import { Scissors, Sparkles, Download, Image } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";

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
      link.download = `nero-obj-removed-${Date.now()}.png`;
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

      if (object.split(" ").length > 1) {
        setLoading(false);
        return toast.error("Please provide only single object name");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.imageUrl || data.content);
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20 font-inter">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8 h-auto xl:h-[calc(100vh-160px)] flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold dark:text-white">Heal Studio</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider opacity-60">AI Inpainting Engine</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                  Source Image
                </label>
                <div className="relative group cursor-pointer min-h-[140px]">
                  <input
                    onChange={(e) => setInput(e.target.files[0])}
                    accept="image/*"
                    type="file"
                    id="obj-upload"
                    className="hidden"
                    required
                  />
                  <label 
                    htmlFor="obj-upload"
                    className="flex flex-col items-center justify-center w-full h-full px-4 py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-gray-50/30 dark:bg-gray-900/30 cursor-pointer group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10"
                  >
                    {input ? (
                      <div className="text-center animate-in zoom-in-95 duration-300">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                           <Image className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-blue-600 truncate max-w-[200px]">{input.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">Image Cached</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs font-bold text-gray-500">Tap to upload photo</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                  Object to Erase
                </label>
                <textarea
                  onChange={(e) => setObject(e.target.value)}
                  value={object}
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white text-sm resize-none"
                  placeholder="e.g., 'the watch on my wrist'..."
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 mt-auto"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]">
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Scissors className="w-4 h-4" />
                )}
                {loading ? "Healing..." : "Remove Object"}
              </div>
            </button>
          </form>
        </div>

        {/* Right Column: Result Area */}
        <div className="flex-1 w-full flex flex-col h-auto min-h-[500px] xl:h-[calc(100vh-160px)]">
          <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm dark:text-gray-200">Processed Canvas</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Neural Stream</span>
                  </div>
                </div>
              </div>
              {content && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Download className="w-3 h-3" /> Save Result
                </button>
              )}
            </div>

            <div className="flex-1 p-8 relative flex items-center justify-center overflow-hidden">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-800 select-none opacity-40">
                  <Sparkles className="w-20 h-20 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Awaiting Instruction</p>
                </div>
              ) : (
                <div className="relative group w-full h-full flex items-center justify-center p-4">
                 <img
                    src={content}
                    alt="Processed"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] animate-in zoom-in-95 duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-white/90 dark:bg-gray-950/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg border dark:border-gray-800">Object Successfully Healed</span>
                  </div>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                        <p className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Healing Image Area...</p>
                    </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 text-center">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-50 italic">Generative Healing Intelligence v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
