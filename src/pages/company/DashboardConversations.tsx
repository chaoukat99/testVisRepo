
import React, { useState, useEffect } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageSquare, ShieldCheck, Zap, MoreHorizontal, User, Info, Calendar, Euro } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useNavigate, useSearchParams } from 'react-router-dom';

export default function DashboardConversations() {
    const [selectedChat, setSelectedChat] = useState<{ id: string, title: string, subtitle?: string } | null>(null);
    const [searchParams] = useSearchParams();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // We might need to fetch the conversation list first to get the title/subtitle 
    // if we want to open it immediately, but since ChatList will load them, 
    // maybe we can just wait for the user to click or pass partial data.
    // However, if we come from "Contacted", we only have the ID.

    // For now, let's just make sure the state is set if we have enough info.
    // In ChatList, when it loads, it can report the list.

    const handleSelectChat = (id: string, title: string, subtitle?: string) => {
        setSelectedChat({ id, title, subtitle });
    };

    useEffect(() => {
        const chatId = searchParams.get('chat');
        const title = searchParams.get('title');
        const subtitle = searchParams.get('subtitle');

        if (chatId && title) {
            handleSelectChat(chatId, title, subtitle || undefined);
        }
    }, [searchParams]);

    if (!user) return null;

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sidebar - Conversations List */}
            <div className="w-[400px] border-r border-slate-50 flex flex-col">
                <ChatList
                    onSelectConversation={handleSelectChat}
                    currentUser={user}
                    activeConversationId={selectedChat?.id}
                />
            </div>

            {/* Main Content - Active Chat */}
            <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
                {selectedChat ? (
                    <div className="flex-1 flex flex-col h-full">
                        <ChatWindow
                            conversationId={selectedChat.id}
                            title={selectedChat.title}
                            subtitle={selectedChat.subtitle}
                            onClose={() => setSelectedChat(null)}
                            currentUser={user}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-20 text-center bg-[#f0f2f5]">
                        <div className="relative">
                            <div className="size-48 bg-white rounded-full shadow-lg flex items-center justify-center relative">
                                <MessageSquare className="size-24 text-[#cbd5e1]" />
                            </div>
                        </div>
                        <div className="max-w-md space-y-2">
                            <h2 className="text-2xl font-light text-slate-600">OpenIn Web</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Envoyez et recevez des messages sans garder votre téléphone connecté.<br />
                                Utilisez OpenIn sur jusqu'à 4 appareils liés et 1 téléphone à la fois.
                            </p>
                        </div>
                        <div className="mt-20 border-t border-slate-200 pt-8">
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                <ShieldCheck className="size-4" /> Chiffré de bout en bout
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
