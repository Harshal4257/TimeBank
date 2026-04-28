import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';

const Messages = () => {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const location = useLocation();

    // ✅ AuthContext stores the user ID under the 'userId' key in localStorage
    const currentUserId = localStorage.getItem('userId') || '';

    useEffect(() => {
        fetchMessages();
    }, []);

    // Auto-scroll to bottom whenever active chat or messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChatId, chats]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get('/messages');
            const data = Array.isArray(res.data) ? res.data : [];

            // Group messages into conversations keyed by the OTHER person's ID
            const grouped = {};
            data.forEach(msg => {
                const senderId = msg.sender?._id?.toString();
                const isFromMe = senderId === currentUserId;
                const otherUser = isFromMe ? msg.receiver : msg.sender;
                const otherId = otherUser?._id?.toString();

                if (!otherId) return; // skip malformed messages

                if (!grouped[otherId]) {
                    grouped[otherId] = { user: otherUser, messages: [] };
                }
                grouped[otherId].messages.push(msg);
            });

            // Sort each conversation's messages oldest → newest
            Object.values(grouped).forEach(chat => {
                chat.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                const last = chat.messages[chat.messages.length - 1];
                chat.lastMessage = last?.content || '';
                chat.time = last
                    ? new Date(last.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '';
            });

            // Sort sidebar list: most recent conversation first
            const chatList = Object.values(grouped).sort((a, b) => {
                const tA = new Date(a.messages[a.messages.length - 1]?.createdAt || 0);
                const tB = new Date(b.messages[b.messages.length - 1]?.createdAt || 0);
                return tB - tA;
            });

            setChats(chatList);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChatId) return;
        try {
            await API.post('/messages', { receiver: selectedChatId, content: messageInput });
            setMessageInput('');
            fetchMessages();
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message. Please try again.');
        }
    };

    const activeChat = chats.find(c => c.user?._id?.toString() === selectedChatId);

    const filteredChats = searchQuery.trim()
        ? chats.filter(c => c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : chats;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#E6EEF2] p-6 lg:p-10">
            <div className="max-w-6xl mx-auto h-[700px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex border border-white">

                {/* ── Sidebar: Chat List ── */}
                <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-white">
                    <div className="p-8 border-b border-slate-50">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Inboxes</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {error ? (
                            <div className="p-6 text-center">
                                <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
                                <button onClick={fetchMessages} className="text-xs text-emerald-600 font-bold underline">
                                    Retry
                                </button>
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <MessageSquare className="mx-auto mb-4 opacity-20" size={40} />
                                <p className="text-sm font-bold italic">
                                    {searchQuery ? 'No matching conversations' : 'No messages yet'}
                                </p>
                            </div>
                        ) : filteredChats.map(chat => (
                            <button
                                key={chat.user._id}
                                onClick={() => setSelectedChatId(chat.user._id.toString())}
                                className={`w-full p-6 flex items-center gap-4 hover:bg-slate-50 transition-all border-b border-slate-50 ${
                                    selectedChatId === chat.user._id.toString() ? 'bg-emerald-50 shadow-inner' : ''
                                }`}
                            >
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg shrink-0">
                                    {chat.user.name ? chat.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{chat.user.name || 'User'}</h4>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0 ml-1">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Main Chat Area ── */}
                <div className="hidden md:flex flex-1 flex-col bg-slate-50/20 relative">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">
                                    {activeChat.user.name ? activeChat.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{activeChat.user.name || 'User'}</h3>
                                    <div className="flex items-center gap-1.5 text-emerald-500">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-semibold uppercase leading-none">Active Conversation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {activeChat.messages.map(msg => {
                                    const isMe = msg.sender?._id?.toString() === currentUserId;
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-[75%]">
                                                <div className={`p-5 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                                                    isMe
                                                        ? 'bg-slate-900 text-white rounded-tr-none'
                                                        : msg.isSystemMessage
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 italic rounded-tl-none'
                                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                                }`}>
                                                    <p>{msg.content}</p>
                                                </div>
                                                <p className={`text-[9px] mt-2 font-semibold uppercase text-slate-400 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <form className="flex gap-3" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        placeholder="Write a message..."
                                        className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800 placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xl shadow-emerald-100 group"
                                    >
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-white">
                            <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner">
                                <MessageSquare size={54} className="opacity-20 translate-y-1" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Conversations</h3>
                            <p className="text-sm font-semibold text-slate-400 italic">Select an inbox to display message history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
