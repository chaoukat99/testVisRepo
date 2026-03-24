
import React, { useState, useEffect } from 'react';
import { api, STORAGE_URL } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Search, MoreVertical, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Conversation {
    id: string;
    prenom?: string;
    nom?: string;
    company_name?: string;
    last_message?: string;
    last_message_at: string;
    metier?: string;
    photo_profil_url?: string;
}

interface ChatListProps {
    onSelectConversation: (conversationId: string, title: string, subtitle?: string) => void;
    currentUser: any;
    activeConversationId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectConversation, currentUser, activeConversationId }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await api.getConversations();
            if (response.success) {
                setConversations(response.conversations || []);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const title = currentUser.role === 'company'
            ? `${conv.prenom} ${conv.nom}`
            : conv.company_name || 'Entreprise';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) return (
        <div className="flex flex-col h-full bg-white items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884]"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            {/* WhatsApp style header */}
            <div className="bg-[#f0f2f5] p-3 flex items-center justify-between shrink-0">
                <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={currentUser?.photo_profil_url ? `${STORAGE_URL}${currentUser.photo_profil_url}` : ""} />
                    <AvatarFallback className="bg-slate-300 text-white font-bold">{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-5 text-slate-500 px-2">
                    <MessageSquare className="size-5 cursor-pointer" />
                    <MoreVertical className="size-5 cursor-pointer" />
                </div>
            </div>

            <div className="p-2 bg-white shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher ou démarrer une discussion"
                        className="pl-12 rounded-lg border-none bg-[#f0f2f5] h-9 text-[13px] placeholder:text-slate-500 focus-visible:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <p className="text-[13px] text-slate-500">Aucune discussion trouvée.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredConversations.map((conv) => {
                            const title = currentUser.role === 'company'
                                ? `${conv.prenom} ${conv.nom}`
                                : conv.company_name || 'Entreprise';
                            const isActive = activeConversationId === conv.id;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => onSelectConversation(conv.id, title, conv.metier)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 transition-all duration-75 relative",
                                        isActive ? "bg-[#ebebeb]" : "hover:bg-[#f5f6f6]"
                                    )}
                                >
                                    <Avatar className="h-12 w-12 shrink-0 border-none">
                                        <AvatarImage src={conv.photo_profil_url ? `${STORAGE_URL}${conv.photo_profil_url}` : ""} />
                                        <AvatarFallback className="bg-slate-200 text-slate-500 font-bold uppercase">
                                            {title.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0 pr-2 py-1 h-full flex flex-col justify-center">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-[16px] font-normal text-slate-900 truncate tracking-tight">{title}</h4>
                                            <span className="text-[11px] text-slate-400">
                                                {format(new Date(conv.last_message_at), 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1 overflow-hidden mt-0.5">
                                            <p className="text-[13px] truncate text-slate-500 flex-1 text-left">
                                                {conv.last_message || 'Fichiers envoyés'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
