import React, { useEffect, useState } from "react";
import { Gem, Sparkles, Clock, History, LayoutGrid, List } from "lucide-react";
import axios from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      
      // Fetch creations
      const creationsRes = await axios.get("/api/user/get-user-creations", { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (creationsRes.data.success) {
        setCreations(creationsRes.data.creations);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black dark:text-white mb-8 tracking-tight uppercase italic flex items-center gap-3">
          <LayoutGrid className="text-primary w-8 h-8" /> User Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Total Creations Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Creations</p>
              <h2 className="text-3xl font-black dark:text-white mt-1">{creations.length}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>


          
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Platform Status</p>
              <h2 className="text-3xl font-black text-green-500 mt-1 uppercase italic">Active</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            <h2 className="font-bold text-xl dark:text-white uppercase tracking-tight">Recent Activity</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/3] bg-white dark:bg-gray-900 rounded-3xl animate-pulse border dark:border-gray-800" />
            ))}
          </div>
        ) : creations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 border-dashed">
            <p className="text-gray-500">You haven't created anything yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {creations.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                   <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-widest">
                    {item.type}
                   </span>
                   <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                   </span>
                </div>
                
                <div className="p-6">
                  <p className="text-sm font-bold dark:text-white line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                    {item.prompt}
                  </p>
                  
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                    {item.type === "image" || item.type === "remove-background" || item.type === "remove-object" ? (
                      <img 
                        src={item.secure_url || item.content} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt="Creation" 
                      />
                    ) : (
                      <div className="p-4 h-full text-[10px] overflow-hidden text-gray-500 dark:text-gray-400 italic">
                         <Markdown>{item.content}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
