import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, Loader2, ArrowLeft, Trash2, Wifi, Circle, Store, Briefcase, GraduationCap, ExternalLink, Sparkles } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Swal from 'sweetalert2';
import { socket } from '../socket';
import { toast } from 'react-hot-toast';
import CommissionModal from '../components/CommissionModal';

const Messages = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [typingStatus, setTypingStatus] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const openedConversationRef = useRef(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/profile');
                setCurrentUser(res.data.user || res.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const requestedConversationId = location.state?.conversationId;
        if (!requestedConversationId || openedConversationRef.current || chats.length === 0) {
            return;
        }

        const requestedChat = chats.find(chat => chat._id === requestedConversationId);
        if (requestedChat) {
            openedConversationRef.current = true;
            handleSelectChat(requestedChat);
        }
    }, [chats, location.state]);

    useEffect(() => {
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) return;

        const handleConnect = () => {
            setIsConnected(true);
            socket.emit("register_user", userId);
            socket.emit("get_online_users");
        };

        const handleDisconnect = () => setIsConnected(false);

        const handleOnlineList = (list) => {
            setOnlineUserIds(list || []);
        };

        const handleConversationUpdated = (conversation) => {
            setChats((prev) => {
                const withoutCurrent = prev.filter(chat => chat._id !== conversation._id);
                return [conversation, ...withoutCurrent];
            });

            setActiveChat((prev) => prev?._id === conversation._id ? { ...prev, ...conversation } : prev);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("online_users_list", handleOnlineList);
        socket.on("conversation_updated", handleConversationUpdated);

        socket.connect();
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("online_users_list", handleOnlineList);
            socket.off("conversation_updated", handleConversationUpdated);
        };
    }, [currentUser]);

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
    }, [messages, typingStatus]);

    useEffect(() => {
        if (activeChat && currentUser) {
            const chatId = activeChat._id;
            socket.emit("join_chat", chatId);

            const handleReceive = (incomingMsg) => {
                if (incomingMsg.conversationId === chatId) {
                    setMessages((prev) => {
                        if (prev.find(m => m._id === incomingMsg._id)) return prev;
                        return [...prev, {
                            _id: incomingMsg._id,
                            text: incomingMsg.text,
                            createdAt: incomingMsg.createdAt,
                            sender: incomingMsg.sender?.toString() === (currentUser._id || currentUser.id)?.toString() ? 'me' : 'other'
                        }];
                    });
                } else {
                    toast(`📩 New message from ${incomingMsg.senderName || 'contact'}`, { duration: 2500 });
                }
            };

            const handleDisplayTyping = ({ chatId: tid, userName }) => {
                if (tid === chatId) {
                    setTypingStatus(prev => ({ ...prev, [tid]: `${userName || 'Contact'} is typing...` }));
                }
            };

            const handleHideTyping = ({ chatId: tid }) => {
                if (tid === chatId) {
                    setTypingStatus(prev => {
                        const updated = { ...prev };
                        delete updated[tid];
                        return updated;
                    });
                }
            };

            const handleDelete = (deletedId) => {
                setMessages((prev) => prev.filter(m => m._id !== deletedId));
            };

            socket.on("receive_message", handleReceive);
            socket.on("display_typing", handleDisplayTyping);
            socket.on("hide_typing", handleHideTyping);
            socket.on("message_deleted", handleDelete);

            return () => {
                socket.emit("leave_chat", chatId);
                socket.off("receive_message", handleReceive);
                socket.off("display_typing", handleDisplayTyping);
                socket.off("hide_typing", handleHideTyping);
                socket.off("message_deleted", handleDelete);
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

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        if (!activeChat || !currentUser) return;

        const chatId = activeChat._id;
        const userId = currentUser._id || currentUser.id;
        const userName = currentUser.name;

        socket.emit("typing", { chatId, userId, userName });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { chatId, userId });
        }, 1800);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const messageText = newMessage.trim();
        const chatId = activeChat._id;
        const userId = currentUser._id || currentUser.id;

        socket.emit("stop_typing", { chatId, userId });
        setNewMessage("");

        try {
            const res = await api.post(`/messages/${chatId}`, { text: messageText });
            const savedMessage = res.data.message;

            setMessages((prev) => {
                if (!savedMessage || prev.find(m => m._id === savedMessage._id)) return prev;
                return [...prev, {
                    _id: savedMessage._id,
                    sender: 'me',
                    text: savedMessage.text,
                    createdAt: savedMessage.createdAt
                }];
            });
        } catch (error) {
            console.error("Failed to send message", error);
            setNewMessage(messageText);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, Delete',
            background: '#0a0a0a',
            color: '#fff',
            customClass: { popup: 'rounded-3xl border border-white/10' }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/messages/delete/${messageId}`);
                setMessages((prev) => prev.filter(m => m._id !== messageId));
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const filteredChats = chats.filter(chat => {
        const name = chat.user?.name || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col h-screen overflow-hidden">
            <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-20 pb-6 flex flex-col h-full">

                <button
                    onClick={() => navigate(-1)}
                    className="w-fit flex items-center gap-2 text-white/50 hover:text-amber-500 mb-4 font-medium transition-colors text-sm"
                >
                    <ArrowLeft size={16} /> Back to Discover
                </button>

                <div className="flex gap-6 flex-1 overflow-hidden">
                    {/* Left Sidebar: Conversations List */}
                    <div className={`w-full md:w-80 bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col overflow-hidden transition-all ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-5 border-b border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <MessageSquare size={20} className="text-amber-500" /> Real-time Chat
                                </h2>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/30 flex items-center gap-1">
                                    <Circle size={6} className="fill-green-400 animate-ping" /> Live
                                </span>
                            </div>

                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" /></div>
                            ) : filteredChats.length > 0 ? (
                                filteredChats.map(chat => {
                                    const otherUserId = chat.user?._id || chat.user?.id;
                                    const isUserOnline = onlineUserIds.includes(otherUserId?.toString());
                                    const role = chat.user?.role || 'Creator';
                                    const isSeller = role.toLowerCase().includes('seller') || role.toLowerCase().includes('artisan') || chat.user?.sellerProfile?.storeName;
                                    const isMentor = role.toLowerCase().includes('mentor') || role.toLowerCase().includes('instructor');

                                    return (
                                        <div
                                            key={chat._id}
                                            onClick={() => handleSelectChat(chat)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all relative ${
                                                activeChat?._id === chat._id
                                                    ? 'bg-white/10 border-amber-500/40 shadow-lg'
                                                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                                            }`}
                                        >
                                            {/* Avatar with Live Online Badge */}
                                            <div className="relative shrink-0">
                                                {chat.user?.profilePic ? (
                                                    <img src={chat.user.profilePic} alt={chat.user.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
                                                        {chat.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a] ${isUserOnline ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-zinc-600'}`} />
                                            </div>

                                            <div className="flex-1 overflow-hidden space-y-0.5">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-white truncate">{chat.user?.name}</h4>
                                                    {isSeller ? (
                                                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Seller</span>
                                                    ) : isMentor ? (
                                                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">Mentor</span>
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-white/50 truncate">{chat.lastMessage}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-white/30 text-center text-xs py-10">No chats found.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Active Chat Room */}
                    <div className={`flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>

                        {!activeChat ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none space-y-2">
                                <MessageSquare size={60} className="text-white/20" />
                                <p className="text-white/50 font-bold tracking-widest uppercase text-center px-4 text-xs">
                                    Select a conversation to start Buyer ↔ Seller or Student ↔ Mentor chat
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Active Chat Top Bar */}
                                <div className="p-4 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between gap-4 z-10">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <button onClick={() => setActiveChat(null)} className="md:hidden p-2 bg-white/5 rounded-full text-white/70 hover:text-amber-500">
                                            <ArrowLeft size={18} />
                                        </button>

                                        <div className="relative shrink-0">
                                            {activeChat.user?.profilePic ? (
                                                <img src={activeChat.user.profilePic} alt={activeChat.user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                                                    {activeChat.user?.name?.charAt(0)}
                                                </div>
                                            )}
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${onlineUserIds.includes(activeChat.user?._id?.toString() || activeChat.user?.id?.toString()) ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white text-sm truncate flex items-center gap-2">
                                                <span>{activeChat.user?.name}</span>
                                            </h3>
                                            <p className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 ${onlineUserIds.includes(activeChat.user?._id?.toString() || activeChat.user?.id?.toString()) ? 'text-emerald-400' : 'text-white/40'}`}>
                                                <Circle size={6} className={`fill-current ${onlineUserIds.includes(activeChat.user?._id?.toString() || activeChat.user?.id?.toString()) ? 'animate-ping' : ''}`} />
                                                {onlineUserIds.includes(activeChat.user?._id?.toString() || activeChat.user?.id?.toString()) ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Shortcuts Header */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => setIsCommissionModalOpen(true)}
                                            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                                            title="Request Custom Commission"
                                        >
                                            <Briefcase size={13} />
                                            <span className="hidden sm:inline">Commission</span>
                                        </button>

                                        <Link
                                            to={`/profile/${activeChat.user?._id || activeChat.user?.id}`}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                                            title="View Profile / Store"
                                        >
                                            <Store size={13} />
                                            <span className="hidden sm:inline">Store</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Messages Stream */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                    {messages.map((msg) => (
                                        <div key={msg._id} className={`flex group ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className="flex items-center gap-2 max-w-[80%]">
                                                {msg.sender === 'me' && (
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-500 transition-all shrink-0"
                                                        title="Delete message"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}

                                                <div className={`p-3.5 px-5 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                                                    msg.sender === 'me'
                                                        ? 'bg-amber-500 text-black font-semibold rounded-br-sm shadow-md'
                                                        : 'bg-white/10 text-white rounded-bl-sm border border-white/10'
                                                }`}>
                                                    {msg.text}
                                                    <p className={`text-[9px] mt-1 text-right font-medium ${msg.sender === 'me' ? 'text-black/60' : 'text-white/40'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Animated Typing Indicator */}
                                    {typingStatus[activeChat._id] && (
                                        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold italic animate-pulse px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
                                            <Sparkles size={13} />
                                            <span>{typingStatus[activeChat._id]}</span>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Box */}
                                <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a0a] border-t border-white/5">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={handleInputChange}
                                            placeholder={`Message ${activeChat.user?.name}...`}
                                            className="w-full bg-[#111] border border-white/10 rounded-full pl-6 pr-14 py-3.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black transition-all disabled:opacity-50 disabled:hover:bg-amber-500 shadow-md"
                                        >
                                            <Send size={16} className="ml-0.5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Commission Modal */}
            {activeChat && (
                <CommissionModal
                    isOpen={isCommissionModalOpen}
                    onClose={() => setIsCommissionModalOpen(false)}
                    artist={activeChat.user}
                />
            )}
        </div>
    );
};

export default Messages;
