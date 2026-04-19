import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart, MessageSquare, Share2, Download, Info } from 'lucide-react';
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
      toast.error("Failed to load community gallery.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (creationId) => {
    if (!user) return toast.error("Please sign in to like art.");
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
      toast.error("Action failed.");
    }
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `nero-community-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Download failed.");
    }
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300'>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="w-8 h-8 text-primary" />
            <h1 className='text-3xl font-black dark:text-white tracking-tight uppercase italic'>Community Showcase</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Explore and be inspired by art created by the Nero AI family.</p>
        </header>

        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-square bg-white dark:bg-gray-900 rounded-3xl animate-pulse border dark:border-gray-800" />
            ))}
          </div>
        ) : creations.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 rounded-3xl p-20 text-center border dark:border-gray-800 border-dashed'>
            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold dark:text-white">The gallery is quiet...</h3>
            <p className="text-gray-500 mb-6">Be the first to share your imagination!</p>
            <button 
              onClick={() => window.location.href = '/ai/image-generator'}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Generate Art Now
            </button>
          </div>
        ) : (
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'>
            {creations.map((item) => {
              const imageUrl = item.secure_url || item.content;
              const isLiked = item.likes?.includes(user?.id);
              
              return (
                <div 
                  key={item.id || item._id} 
                  className='break-inside-avoid relative group rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500'
                >
                  <img 
                    src={imageUrl} 
                    alt={item.prompt} 
                    className='w-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5'>
                    <p className='text-white text-sm font-medium line-clamp-2 mb-4 drop-shadow-md'>{item.prompt}</p>
                    
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <button 
                          onClick={() => handleLike(item.id || item._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-bold">{item.likes?.length || 0}</span>
                        </button>
                        
                        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleDownload(imageUrl)}
                        className="p-2 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all transform hover:rotate-12"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
