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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Heal Studio</h2>
              <p className="text-gray-500 text-xs text-balance">Object removal & inpainting.</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                Source Image
              </label>
              <div className="relative group cursor-pointer">
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
                  className="flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-gray-50/50 dark:bg-gray-900/50 cursor-pointer"
                >
                  {input ? (
                    <div className="text-center">
                      <p className="text-xs font-bold text-blue-500">Selected</p>
                      <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[150px]">{input.name}</p>
                    </div>
                  ) : (
                    <>
                      <Image className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-xs font-medium text-gray-500 text-center">Click to upload JPG, PNG</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                What to remove?
              </label>
              <textarea
                onChange={(e) => setObject(e.target.value)}
                value={object}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white text-sm resize-none"
                placeholder="e.g., watch or spoon..."
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
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

        {/* Right Column: Result */}
        <div className="flex-1 w-full">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-1 flex flex-col min-h-[500px]">
            <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-bold text-sm dark:text-gray-200 tracking-tight">Processed Canvas</h3>
              </div>
              {content && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition-colors"
                >
                  <Download className="w-3 h-3" /> Save Result
                </button>
              )}
            </div>

            <div className="flex-1 p-6 relative flex items-center justify-center bg-gray-50/30 dark:bg-gray-950/30">
              {!content ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-30 select-none">
                  <Image className="w-20 h-20 mb-4" />
                  <p className="text-sm font-medium">Result will appear here</p>
                </div>
              ) : (
                <div className="w-full max-w-lg aspect-square relative group animate-in fade-in zoom-in duration-500">
                  <img src={content} alt="processed" className="w-full h-full object-contain drop-shadow-2xl" />
                  <div className="absolute inset-0 bg-black/4 w-full h-full pointer-events-none rounded-2xl" />
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                        <p className="text-blue-500 font-bold text-sm animate-pulse italic">Removing object...</p>
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

export default RemoveObject;
