import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Plus, Trash2, Sparkles, History, X, ChevronLeft, Trash } from 'lucide-react';
import axios from '../lib/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from "react-markdown";

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am Nero AI. How can I assist you today?' }
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
                setHistory(data.history); // The latest message of each thread
                setAllMessages(data.allMessages); // Every single message for reconstruction
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
        
        // Find all messages belonging to this thread (or legacy item)
        let sessionMessages = [];
        if (threadId) {
            // Filter all messages that share this thread_id
            const threadMessages = allMessages.filter(msg => msg.thread_id === threadId).reverse();
            threadMessages.forEach(item => {
                sessionMessages.push({ role: 'user', content: item.prompt });
                sessionMessages.push({ role: 'assistant', content: item.content });
            });
        } else {
            // Legacy handling: reconstruct history up to this specific item
            for (let i = allMessages.length - 1; i >= 0; i--) {
                const item = allMessages[i];
                sessionMessages.push({ role: 'user', content: item.prompt });
                sessionMessages.push({ role: 'assistant', content: item.content });
                if (item.id === threadItem.id) break;
            }
        }

        setMessages([
            { role: 'assistant', content: 'Resuming your conversation...' },
            ...sessionMessages
        ]);
        toast.success('Conversation resumed');
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
                setActiveThreadId(data.threadId); // Store the threadId (useful if it was a new chat)
                fetchHistory(); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to get a response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setMessages([{ role: 'assistant', content: 'New session started. How can I help you now?' }]);
        setActiveThreadId(null);
        toast.success('New chat started');
    };

    const clearAllHistory = async () => {
        if (!window.confirm("Are you sure you want to clear your entire chat history?")) return;
        try {
            const token = await getToken();
            const { data } = await axios.delete('/api/ai/chat-history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setHistory([]);
                setAllMessages([]);
                startNewChat();
                toast.success('History cleared');
            }
        } catch (error) {
            toast.error('Failed to clear history');
        }
    };

    const deleteHistoryItem = async (id, e) => {
        e.stopPropagation();
        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/ai/chat-item/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                fetchHistory();
                toast.success('Message deleted');
            }
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20">
            <div className="flex flex-col xl:flex-row gap-8 items-start h-full">
                
                {/* Left Column: Recent Chats Sidebar Card */}
                <div className="w-full xl:w-[350px] flex-shrink-0 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 p-6 sm:p-8 flex flex-col h-auto xl:h-[calc(100vh-160px)] max-h-[400px] xl:max-h-none">
                    <div className="flex items-center gap-3 mb-8 px-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Recent Chats</h2>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold opacity-60">Resume Session</p>
                        </div>
                    </div>

                    <button 
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mb-6"
                    >
                        <Plus className="w-4 h-4" /> New Conversation
                    </button>

                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History</h3>
                        {history.length > 100 && (
                             <button 
                                onClick={clearAllHistory}
                                className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {history.length > 0 ? history.map((item) => {
                            const isSelected = activeThreadId === item.thread_id || (!activeThreadId && !item.thread_id && false); // Simplified check
                            
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => selectThread(item)}
                                    className={`p-4 rounded-xl group cursor-pointer relative transition-all border ${
                                        activeThreadId && activeThreadId === item.thread_id
                                        ? 'bg-primary/5 border-primary shadow-sm' 
                                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-100 dark:hover:border-gray-800'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 pr-8">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${activeThreadId === item.thread_id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                             <MessageSquare className="w-3 h-3" />
                                        </div>
                                        <p className={`text-xs line-clamp-2 leading-relaxed font-medium ${activeThreadId === item.thread_id ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {item.prompt}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pl-9">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <button 
                                            onClick={(e) => deleteHistoryItem(item.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                                        >
                                            <Trash className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-10">
                                <History className="w-12 h-12 mb-2" />
                                <p className="text-xs font-bold uppercase">Empty</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Chat Main Card */}
                <div className="flex-1 w-full bg-white dark:bg-gray-950 rounded-3xl shadow-sm border dark:border-gray-800 flex flex-col h-auto min-h-[500px] xl:h-[calc(100vh-160px)]">
                    
                    {/* Header */}
                    <div className="p-5 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary rotate-12" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm dark:text-gray-200">Nero Studio</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${activeThreadId ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {activeThreadId ? 'Resumed Thread' : 'New Neural Stream'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar scroll-smooth">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                            >
                                <div className={`flex gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                                        msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-primary to-indigo-700' 
                                        : 'bg-white dark:bg-gray-900 border dark:border-gray-800'
                                    }`}>
                                        {msg.role === 'user' 
                                            ? <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> 
                                            : <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                        }
                                    </div>

                                    <div className={`relative p-5 rounded-3xl shadow-sm leading-relaxed text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-gray-900 dark:text-gray-200 border dark:border-gray-800 rounded-tl-none'
                                    }`}>
                                        <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none font-medium text-balance`}>
                                            <Markdown>{msg.content}</Markdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-800 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border dark:border-gray-800 rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="p-6 border-t dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
                            <div className="relative flex items-center bg-white dark:bg-gray-950 border-2 dark:border-gray-800 focus-within:border-primary/50 rounded-2xl overflow-hidden shadow-sm transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={activeThreadId ? "Continue this thread..." : "Start a new conversation..."}
                                    className="flex-1 bg-transparent dark:text-white px-6 py-5 outline-none text-sm font-medium"
                                    disabled={loading}
                                />
                                <div className="px-4">
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                                            input.trim() && !loading
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                                        }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-[0.2em] opacity-50">Context memory enabled</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
