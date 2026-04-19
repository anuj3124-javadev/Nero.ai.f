import React, { useEffect, useState } from "react";
import { Sparkles, Clock, History, LayoutGrid, Activity, Zap, Box, ArrowUpRight, X, Download, Copy, ExternalLink, Calendar, FileText, ChevronRight } from "lucide-react";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Sub-component for the Activity Modal
const ActivityModal = ({ activity, isOpen, onClose }) => {
  if (!activity || !isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activity.content);
    toast.success("Result copied to clipboard!");
  };

  const handleDownload = async () => {
    const url = activity.secure_url || activity.content;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `nero-${activity.type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Asset downloaded!");
    } catch (e) {
      toast.error("Download failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black dark:text-white tracking-tight italic uppercase">{activity.type} Details</h2>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recorded on {new Date(activity.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Metadata & Prompt */}
            <div className="lg:col-span-5 space-y-8">
              <section>
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 block">Operation Script (Prompt)</label>
                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 relative group">
                  <p className="text-sm font-bold dark:text-gray-300 leading-relaxed italic line-clamp-[10]">{activity.prompt}</p>
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-40 transition-opacity">
                     <FileText className="w-8 h-8" />
                  </div>
                </div>
              </section>

              <section className="p-6 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800/50 bg-indigo-500/0">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-2">Technical Metadata</h4>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-400">Stream ID</span>
                      <span className="dark:text-white">{String(activity.id || 'N/A').slice(0,12)}...</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-400">Resolution</span>
                      <span className="text-emerald-500">Enhanced V3</span>
                   </div>
                </div>
              </section>
            </div>

            {/* Right: Result Visualization */}
            <div className="lg:col-span-7">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 block">Synthesized Output</label>
               <div className="relative rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 min-h-[300px] flex flex-col">
                  {activity.type === "image" || activity.type === "remove-background" || activity.type === "remove-object" ? (
                    <div className="flex-1 flex flex-col p-4">
                      <img 
                        src={activity.secure_url || activity.content} 
                        className="w-full h-full object-contain rounded-2xl shadow-2xl" 
                        alt="Output" 
                      />
                      <div className="mt-4 flex justify-center">
                        <button onClick={handleDownload} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                          <Download className="w-3 h-3" /> Save Local Asset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-8 flex flex-col">
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-sm dark:prose-invert max-w-none font-medium leading-relaxed italic text-gray-700 dark:text-gray-300">
                        <Markdown>{activity.content}</Markdown>
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                         <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-xl">
                            <Copy className="w-3 h-3" /> Copy Manifest
                         </button>
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/30 text-center border-t border-gray-100 dark:border-gray-800">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 opacity-40 italic">Nero Archival Record | Selective Persistence Active</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const creationsRes = await axios.get("/api/user/get-user-creations", { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (creationsRes.data.success) {
        setCreations(creationsRes.data.creations);
      }
    } catch (error) {
      console.error(error);
      toast.error("Telemetry failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const openActivityDetail = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <ActivityModal 
        activity={selectedActivity} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Live Workspace Status</span>
           </div>
           <h1 className="text-4xl sm:text-5xl font-black dark:text-white tracking-tighter italic">
             Command <span className="text-indigo-600">Center</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-5 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-widest dark:text-gray-300">Fast-Track Active</span>
           </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        <div className="group relative p-5 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 overflow-hidden transition-all hover:translate-y-[-2px]">
           <div className="relative z-10">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Total Pieces</p>
              <h2 className="text-3xl font-black italic tracking-tighter">{creations.length}</h2>
           </div>
           <Sparkles className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 rotate-12" />
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all hover:translate-y-[-2px]">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-1">Status</p>
            <h2 className="text-2xl font-black dark:text-white tracking-tighter italic">Optimized</h2>
          </div>
          <Zap className="w-6 h-6 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all hover:translate-y-[-2px]">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-1">Latency</p>
            <h2 className="text-2xl font-black dark:text-white tracking-tighter italic">42ms</h2>
          </div>
          <Clock className="w-6 h-6 text-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Box className="w-5 h-5 text-indigo-600" />
          <h2 className="font-black text-xl dark:text-white tracking-tight italic">Recent Activity</h2>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-[4/5] bg-white dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-800" />
          ))}
        </div>
      ) : creations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <p className="text-gray-400 font-bold tracking-tight text-sm">Registry is currently void.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-24">
          {creations.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openActivityDetail(item)}
              className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-500 cursor-pointer"
            >
              <div className="p-3 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-950/20">
                 <span className="text-[8px] font-black uppercase tracking-[0.1em] text-indigo-600 dark:text-indigo-400 truncate pr-2">
                   {item.type}
                 </span>
                 <ArrowUpRight className="w-2.5 h-2.5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              
              <div className="p-3 flex flex-col flex-1">
                <div className="flex-1 aspect-square relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 mb-2">
                  {item.type === "image" || item.type === "remove-background" || item.type === "remove-object" ? (
                    <img 
                      src={item.secure_url || item.content} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="Output" 
                    />
                  ) : (
                    <div className="p-2 h-full text-[9px] overflow-hidden text-gray-500 dark:text-gray-400 leading-tight font-medium">
                       <Markdown>{item.content}</Markdown>
                    </div>
                  )}
                </div>
                <h3 className="text-[10px] font-bold dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.prompt}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
