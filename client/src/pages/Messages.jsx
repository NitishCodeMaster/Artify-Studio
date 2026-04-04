import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { MessageSquare, Search, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import api from '../utils/api';
const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    autoConnect: true
});
const Messages = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api.get('/users/profile');
            setCurrentUser(res.data.user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get('/messages/conversations');
                setChats(res.data.conversations || []);
            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (activeChat && currentUser) {
            socket.emit("join_chat", activeChat._id);
            const handleReceive = (incomingMsg) => {
                if (incomingMsg.conversationId === activeChat._id) {
                    setMessages((prev) => {
                        if (prev.find(m => m._id === incomingMsg._id)) return prev;

                        return [...prev, {
                            ...incomingMsg,
                            sender: incomingMsg.sender === currentUser._id ? 'me' : 'other'
                        }];
                    });
                }
            };

            socket.on("receive_message", handleReceive);

            return () => {
                socket.off("receive_message", handleReceive);
            };
        }
    }, [activeChat, currentUser]);


    const handleSelectChat = async (chat) => {
        setActiveChat(chat);
        try {
            const res = await api.get(`/messages/${chat._id}`);
            setMessages(res.data.messages || []);
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const tempMsg = {
            _id: Date.now(),
            sender: 'me',
            text: newMessage,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage("");

        try {
            await api.post(`/messages/${activeChat._id}`, { text: tempMsg.text });
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col h-screen overflow-hidden">
            <Navbar />

            <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-28 pb-6 flex flex-col h-full">

                <button
                    onClick={() => navigate(-1)}
                    className="w-fit flex items-center gap-2 text-white/50 hover:text-amber-500 mb-4 font-medium transition-colors text-sm"
                >
                    <ArrowLeft size={16} /> Back to Discover
                </button>

                <div className="flex gap-6 flex-1 overflow-hidden">
                    <div className={`w-full md:w-80 bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col overflow-hidden transition-all ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-5 border-b border-white/5">
                            <h2 className="text-xl font-black flex items-center gap-2 mb-4"><MessageSquare size={20} className="text-amber-500" /> Messages</h2>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input type="text" placeholder="Search chats..." className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" /></div>
                            ) : chats.length > 0 ? (
                                chats.map(chat => (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleSelectChat(chat)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${activeChat?._id === chat._id ? 'bg-white/10 border-amber-500/30' : 'bg-white/5 hover:bg-white/10 border-white/5'}`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                            {chat.user?.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-sm text-white truncate">{chat.user?.name}</h4>
                                            <p className="text-xs text-white/50 truncate">{chat.lastMessage}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white/30 text-center text-sm py-10">No messages yet. Start connecting!</p>
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>

                        {!activeChat ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                                <MessageSquare size={60} className="text-white/20 mb-4" />
                                <p className="text-white/50 font-bold tracking-widest uppercase text-center px-4">Select a chat to start messaging</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex items-center gap-4 z-10">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden p-2 bg-white/5 rounded-full text-white/70 hover:text-amber-500">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                                        {activeChat.user?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{activeChat.user?.name}</h3>
                                        <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Online</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                    {messages.map((msg) => (
                                        <div key={msg._id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-3 px-5 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-amber-500 text-black rounded-br-sm font-medium shadow-md' : 'bg-white/10 text-white rounded-bl-sm border border-white/5'}`}>
                                                {msg.text}
                                                <p className={`text-[9px] mt-1 text-right ${msg.sender === 'me' ? 'text-black/60' : 'text-white/40'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a0a] border-t border-white/5">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={`Message ${activeChat.user?.name}...`}
                                            className="w-full bg-[#111] border border-white/10 rounded-full pl-6 pr-14 py-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black transition-all disabled:opacity-50 disabled:hover:bg-amber-500 shadow-md"
                                        >
                                            <Send size={18} className="ml-0.5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;