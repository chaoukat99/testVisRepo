
import React, { useState } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardConversations() {
    const [selectedChat, setSelectedChat] = useState<{ id: string, title: string, subtitle?: string } | null>(null);
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleSelectChat = (id: string, title: string, subtitle?: string) => {
        setSelectedChat({ id, title, subtitle });
    };

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
                            <h2 className="text-2xl font-light text-slate-600">OpenIn Web (Consultant)</h2>
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
