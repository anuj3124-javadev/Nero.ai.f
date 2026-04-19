import React, { useState } from 'react';
import axios from '../../lib/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Send, Download } from 'lucide-react';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [publish, setPublish] = useState(true);
    const [result, setResult] = useState(null);
    const { getToken } = useAuth();

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt) return toast.error('Please enter a prompt.');

        setLoading(true);
        try {
            const token = await getToken();
            console.log("Frontend Auth Token Retrieved:", token ? "YES" : "NO");
            
            const { data } = await axios.post('/api/image/generate', 
                { prompt, publish },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setResult(data.imageUrl);
                toast.success('Image generated!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Generation failed.');
        }
        setLoading(false);
    };

    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nero-ai-art-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Download started!');
        } catch (error) {
            console.error("Download Error:", error);
            toast.error('Failed to download image. Try right-clicking to save.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* Left Column: Form */}
                <div className="w-full xl:w-[400px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Image Studio</h2>
                            <p className="text-gray-500 text-xs">AI-powered creativity.</p>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold dark:text-gray-300 mb-2 block">
                                Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="An astronaut riding a horse in hyper-realistic style..."
                                className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 ring-indigo-500 transition-all dark:text-white text-sm min-h-[120px] resize-none"
                                disabled={loading}
                            />
                        </div>

                        <div 
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 cursor-pointer group"
                            onClick={() => setPublish(!publish)}
                        >
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Public Gallery</span>
                            <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${publish ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${publish ? 'translate-x-4' : ''}`} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span> Generating...</>
                            ) : (
                                <>Generate Magic <Send className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Column: Result */}
                <div className="flex-1 w-full min-h-[400px]">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-4 min-h-[500px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="ml-2 text-xs font-medium text-gray-400 border-l pl-3 dark:border-gray-700">Canvas</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-950/50 rounded-2xl relative overflow-hidden">
                            
                            {/* Loading Skeleton */}
                            {loading && !result && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-full max-w-md aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-4">
                                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                        <p className="text-sm font-medium text-gray-500 animate-pulse">AI is dreaming up your image...</p>
                                    </div>
                                </div>
                            )}

                            {/* Result Rendering */}
                            {result ? (
                                <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                    <div className="relative group w-full max-w-lg aspect-square mb-6">
                                        <img 
                                            src={result} 
                                            alt="AI Generated" 
                                            className="w-full h-full object-contain rounded-2xl shadow-2xl" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                            <button 
                                                onClick={handleDownload}
                                                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                                                title="Download Image"
                                            >
                                                <Download className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleDownload}
                                        className="sm:hidden w-full bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 mb-4"
                                    >
                                        <Download className="w-5 h-5 text-primary" /> Download
                                    </button>
                                </div>
                            ) : !loading && (
                                <div className="flex flex-col items-center text-gray-400 opacity-40">
                                    <ImageIcon className="w-20 h-20 mb-4" />
                                    <p className="font-medium">Your creation will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
