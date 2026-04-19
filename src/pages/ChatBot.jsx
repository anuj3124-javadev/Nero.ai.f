import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Plus, Trash2, Sparkles, History, X, ChevronRight, Search, Zap } from 'lucide-react';
import axios from '../lib/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from "react-markdown";

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Neural Stream initialized. I am Nero AI. Advanced context memory is active. How can I assist you today?' }
    ]);
    const [history, setHistory] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeThreadId, setActiveThreadId] = useState(null);
    const { getToken } = useAuth();
    const chatEndRef = useRef(null);
    const isInitialMount = useRef(true);

    const scrollToBottom = (behavior = 'smooth') => {
        chatEndRef.current?.scrollIntoView({ behavior });
    };

    const fetchHistory = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/ai/chat-history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setHistory(data.history);
                setAllMessages(data.allMessages);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            scrollToBottom('auto');
            isInitialMount.current = false;
        } else {
            scrollToBottom('smooth');
        }
    }, [messages]);

    const selectThread = (threadItem) => {
        const threadId = threadItem.thread_id;
        setActiveThreadId(threadId);
        
        let sessionMessages = [];
        if (threadId) {
            const threadMessages = allMessages.filter(msg => msg.thread_id === threadId).reverse();
            threadMessages.forEach(item => {
                sessionMessages.push({ role: 'user', content: item.prompt });
                sessionMessages.push({ role: 'assistant', content: item.content });
            });
        } else {
            for (let i = allMessages.length - 1; i >= 0; i--) {
                const item = allMessages[i];
                sessionMessages.push({ role: 'user', content: item.prompt });
                sessionMessages.push({ role: 'assistant', content: item.content });
                if (item.id === threadItem.id) break;
            }
        }

        setMessages([
            { role: 'assistant', content: 'Synchronizing neural state... Reconstructing context.' },
            ...sessionMessages
        ]);
        toast.success('Context Restored');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const token = await getToken();
            const { data } = await axios.post('/api/ai/chat', 
                { messages: newMessages, threadId: activeThreadId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
                setActiveThreadId(data.threadId);
                fetchHistory(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Synthesis failed. Check connectivity.');
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setMessages([{ role: 'assistant', content: 'New neural stream established. Ready for semantic processing.' }]);
        setActiveThreadId(null);
        toast.success('Session Initialized');
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row gap-8 items-start h-full">
                
                {/* Left Column: Recent Chats Sidebar Card */}
                <div className="w-full xl:w-[400px] flex-shrink-0">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 flex flex-col h-auto xl:h-[calc(100vh-180px)] max-h-[350px] xl:max-h-none relative overflow-hidden">
                        
                        {/* Background Glow */}
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 relative z-10 px-1">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shadow-sm">
                                <History className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight dark:text-white">Neural Bank</h2>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">History</p>
                            </div>
                        </div>

                        <button 
                            onClick={startNewChat}
                            className="w-full group relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-[0.98] mb-6 h-14 flex items-center justify-center gap-3 z-10"
                        >
                            <Plus className="w-4 h-4" /> New Session
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 relative z-10 pr-2">
                            {history.length > 0 ? history.map((item) => {
                                const isActive = activeThreadId === item.thread_id;
                                
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => selectThread(item)}
                                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative border-2 ${
                                            isActive
                                            ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-xl shadow-indigo-500/5"
                                            : "bg-transparent border-gray-50 dark:border-gray-800/50 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                                        }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-600 transition-colors'}`}>
                                            <MessageSquare className="w-3 h-3" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-[12px] font-bold line-clamp-1 ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {item.prompt}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-20 text-gray-400">
                                    <Zap className="w-12 h-12 mb-2" />
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">Empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Main Card */}
                <div className="flex-1 w-full flex flex-col h-auto min-h-[500px] xl:h-[calc(100vh-180px)]">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden relative">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xs font-black dark:text-gray-100 tracking-tight">Intelligence Studio</h3>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar scroll-smooth relative">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.02),transparent)] pointer-events-none" />

                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-500`}
                                >
                                    <div className={`flex gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                                            msg.role === 'user' 
                                            ? 'bg-gray-900 dark:bg-white' 
                                            : 'bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700'
                                        }`}>
                                            {msg.role === 'user' 
                                                ? <User className="w-4 h-4 text-white dark:text-gray-900" /> 
                                                : <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            }
                                        </div>

                                        <div className={`relative p-4 px-6 rounded-2xl shadow-sm leading-relaxed text-xs ${
                                            msg.role === 'user' 
                                            ? 'bg-gray-900 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-gray-800 dark:text-gray-200 border-2 border-gray-50 dark:border-gray-700 rounded-tl-none'
                                        }`}>
                                            <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none font-medium text-balance`}>
                                                <Markdown>{msg.content}</Markdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 px-8 rounded-2xl border-2 border-gray-50 dark:border-gray-700 rounded-tl-none flex items-center gap-2 shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-indigo-500/60 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-500/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-500/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Bar */}
                        <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/10">
                            <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
                                <div className="relative flex items-center bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 focus-within:border-indigo-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/5 transition-all p-1 pr-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={activeThreadId ? "Continue..." : "New message..."}
                                        className="flex-1 bg-transparent dark:text-white px-6 py-4 outline-none text-xs font-bold tracking-tight"
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                                            input.trim() && !loading
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-300 opacity-50'
                                        }`}
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
