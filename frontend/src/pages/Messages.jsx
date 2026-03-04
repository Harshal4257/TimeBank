import React, { useState, useEffect } from 'react';
import { Search, Send, User, MessageSquare } from 'lucide-react';
import API from '../services/api';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('user')) || { id: localStorage.getItem('userId') };

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await API.get('/messages');
            setMessages(res.data);

            // Group messages into chats
            const grouped = {};
            res.data.forEach(msg => {
                const otherUser = msg.sender._id === (currentUser._id || currentUser.id) ? msg.receiver : msg.sender;
                if (!grouped[otherUser._id]) {
                    grouped[otherUser._id] = {
                        user: otherUser,
                        lastMessage: msg.content,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        messages: []
                    };
                }
                grouped[otherUser._id].messages.push(msg);
            });

            setChats(Object.values(grouped));
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChatId) return;

        try {
            await API.post('/messages', {
                receiver: selectedChatId,
                content: messageInput
            });
            setMessageInput('');
            fetchMessages(); // Refresh
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const activeChat = chats.find(c => c.user._id === selectedChatId);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#E6EEF2] p-6 lg:p-10">
            <div className="max-w-6xl mx-auto h-[700px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex border border-white">

                {/* Sidebar: Chat List */}
                <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-white">
                    <div className="p-8 border-b border-slate-50">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Inboxes</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chats.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <MessageSquare className="mx-auto mb-4 opacity-20" size={40} />
                                <p className="text-sm font-bold italic">No messages yet</p>
                            </div>
                        ) : chats.map(chat => (
                            <button
                                key={chat.user._id}
                                onClick={() => setSelectedChatId(chat.user._id)}
                                className={`w-full p-6 flex items-center gap-4 hover:bg-slate-50 transition-all border-b border-slate-50 ${selectedChatId === chat.user._id ? 'bg-emerald-50 shadow-inner' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg">
                                        {chat.user.name ? chat.user.name.charAt(0) : '?'}
                                    </div>
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{chat.user.name || 'User'}</h4>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="hidden md:flex flex-1 flex-col bg-slate-50/20 relative">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">
                                        {activeChat.user.name ? activeChat.user.name.charAt(0) : '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{activeChat.user.name || 'User'}</h3>
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <p className="text-[10px] font-semibold uppercase leading-none">Active Conversation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {activeChat.messages.slice().reverse().map(msg => {
                                    const isMe = msg.sender._id === (currentUser._id || currentUser.id);
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] group`}>
                                                <div className={`p-5 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${isMe
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
                            </div>

                            {/* Message Input */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <form className="flex gap-3" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Write a message..."
                                        className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800 placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 group"
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
