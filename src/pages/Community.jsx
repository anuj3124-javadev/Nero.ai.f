import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart, MessageSquare, Share2, Download, Info, Sparkles, Filter, Search, Zap } from 'lucide-react';
import axios from '../lib/axiosInstance';
import toast from 'react-hot-toast';

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.success) {
        setCreations(data.creations);
      }
    } catch (error) {
      console.error('Error loading community:', error);
      toast.error("Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (creationId) => {
    if (!user) return toast.error("Please sign in to interact.");
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/user/get-like-creation", 
        { id: creationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCreations(prev => prev.map(c => 
          (c.id === creationId || c._id === creationId) ? { ...c, likes: data.likes } : c
        ));
      }
    } catch (error) {
      toast.error("Action denied.");
    }
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `nero-collective-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Process failed.");
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Collective Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Live Global Feed</span>
           </div>
           <h1 className="text-4xl sm:text-5xl font-black dark:text-white tracking-tighter italic">
             Neural <span className="text-rose-600">Collective</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:border-rose-500/50 transition-all">
              <Filter className="w-4 h-4 text-rose-500" />
              <span className="text-[11px] font-black uppercase tracking-widest dark:text-gray-300">Sort: Resonance</span>
           </div>
           <button 
              onClick={() => window.location.href = '/ai/image-generator'}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-rose-600 dark:hover:bg-rose-50 transition-all active:scale-95"
           >
              New Manifestation
           </button>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 dark:via-gray-800 to-transparent mb-8" />

      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} className="aspect-[3/4] bg-white dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-800" />
          ))}
        </div>
      ) : creations.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center max-w-4xl mx-auto'>
          <h3 className="text-xl font-black dark:text-white tracking-tight mb-4 italic">The Sanctuary is Silent</h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto mb-8 leading-relaxed font-medium text-sm">Be the first to project your neuro-creative logic into the global cloud.</p>
          <button 
            onClick={() => window.location.href = '/ai/image-generator'}
            className="group flex items-center gap-3 bg-rose-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/20 hover:scale-105 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" /> Initialize Stream
          </button>
        </div>
      ) : (
        <div className='columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 pb-24'>
          {creations.map((item) => {
            const imageUrl = item.secure_url || item.content;
            const isLiked = item.likes?.includes(user?.id);
            
            return (
              <div 
                key={item.id || item._id} 
                className='break-inside-avoid relative group rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-1'
              >
                <img 
                  src={imageUrl} 
                  alt={item.prompt} 
                  className='w-full object-cover transition-transform duration-1000 group-hover:scale-110'
                />
                
                {/* Information Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8'>
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Neural Projection</span>
                  </div>
                  
                  <p className='text-white text-[13px] font-bold leading-relaxed mb-8 drop-shadow-md line-clamp-3'>
                    {item.prompt}
                  </p>
                  
                  <div className='flex items-center justify-between border-t border-white/10 pt-6'>
                    <div className='flex gap-3'>
                      <button 
                        onClick={() => handleLike(item.id || item._id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all backdrop-blur-md ${isLiked ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-[11px] font-black">{item.likes?.length || 0}</span>
                      </button>
                      
                      <div className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDownload(imageUrl)}
                      className="w-10 h-10 rounded-xl bg-white text-gray-950 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all transform hover:rotate-12 active:scale-90 shadow-xl"
                    >
                      <Download className="w-4 h-4 hover:animate-bounce" />
                    </button>
                  </div>
                </div>
                
                {/* Prompt Peek (Hidden on Overlay) */}
                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/40">
                       <Sparkles className="w-4 h-4" />
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
