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
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">AI Image Generator</h2>
                        <p className="text-gray-500 text-sm">Create stunning visuals in seconds with Nero AI.</p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4 mb-10">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="An astronaut riding a horse in hyper-realistic style..."
                            className="flex-1 px-6 py-4 rounded-2xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 ring-indigo-500 transition-all dark:text-white"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Generating...' : (
                                <>Generate <Send className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setPublish(!publish)}>
                        <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${publish ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${publish ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 select-none">Publish to Community Gallery</span>
                    </div>
                </form>

                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
                        <div className="relative aspect-square rounded-3xl overflow-hidden border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-inner">
                            <img src={result} alt="AI Generated" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleDownload}
                                className="bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                            >
                                <Download className="w-6 h-6 text-primary" /> Download High-Res Image
                            </button>
                        </div>
                    </div>
                )}

                {!result && !loading && (
                    <div className="h-64 rounded-3xl border-2 border-dashed dark:border-gray-800 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>Generated image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
