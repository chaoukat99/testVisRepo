
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2, Paperclip, MoreVertical, Smile, Search, CheckCheck } from 'lucide-react';
import { api, STORAGE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
    id: string;
    sender_id: string;
    sender_type: 'company' | 'consultant';
    content: string;
    attachment_url?: string;
    attachment_type?: string;
    created_at: string;
}


interface ChatWindowProps {
    conversationId: string;
    receiverId?: string;
    title: string;
    subtitle?: string;
    onClose: () => void;
    currentUser: any;
    readOnly?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    conversationId: initialConvId,
    receiverId,
    title,
    subtitle,
    onClose,
    currentUser,
    readOnly = false
}) => {
    const [conversationId, setConversationId] = useState(initialConvId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (conversationId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async () => {
        if (!conversationId) return;
        try {
            const response = await api.getChatMessages(conversationId);
            if (response.success) {
                setMessages(response.messages);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await api.sendChatMessage({
                conversationId: conversationId || undefined,
                receiverId: !conversationId ? receiverId : undefined,
                content: newMessage.trim()
            });
            if (response.success) {
                setNewMessage('');
                if (response.conversationId && !conversationId) {
                    setConversationId(response.conversationId);
                }
                fetchMessages();
            }
        } catch (error) {
            console.error('Failed to send message', error);
        } finally {
            setSending(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            await handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert("File is too large. Max 10MB.");
                return;
            }

            // 1. Upload file
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await api.uploadChatAttachment(formData);

            if (uploadResponse.success && uploadResponse.url) {
                // 2. Send message with attachment
                await api.sendChatMessage({
                    conversationId: conversationId || undefined,
                    receiverId: !conversationId ? receiverId : undefined,
                    content: '', // Empty content for pure attachment messages, or we could add text
                    attachmentUrl: uploadResponse.url,
                    attachmentType: uploadResponse.type
                });

                fetchMessages();
            }
        } catch (error) {
            console.error('Failed to upload file', error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f0f2f5] overflow-hidden relative z-[10] transition-all duration-300 ease-out">

            {/* Header */}
            <div className="bg-[#f0f2f5] p-3 flex items-center justify-between border-b border-slate-200 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarFallback className="bg-slate-300 text-white text-sm font-bold">
                            {title.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h4 className="text-[15px] font-semibold text-slate-900 truncate max-w-[200px] leading-tight">{title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{subtitle || 'En ligne'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 px-2">
                    <Search className="size-5 cursor-pointer hover:text-slate-700" />
                    <MoreVertical className="size-5 cursor-pointer hover:text-slate-700" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#efeae2] relative space-y-2">
                {/* Background Pattern Overlay (Optional for WhatsApp feel) */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/678/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg')] bg-repeat" />

                <div className="relative z-10 w-full flex flex-col items-center">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4 mt-20">
                            <Loader2 className="size-8 text-[#00a884] animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-20 px-8 bg-white/50 backdrop-blur rounded-2xl border border-slate-200/50 max-w-sm mx-auto mt-20">
                            <p className="text-sm font-medium text-slate-500">Les messages sont chiffrés de bout en bout. Personne en dehors de cette discussion, pas même OpenIn, ne peut les lire.</p>
                        </div>
                    ) : (
                        <div className="w-full space-y-1">
                            {messages.map((msg, idx) => {
                                const isMe = readOnly
                                    ? msg.sender_type === 'company'
                                    : msg.sender_id === currentUser.id;

                                const showDateSeparator = idx === 0 ||
                                    new Date(messages[idx - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateSeparator && (
                                            <div className="flex justify-center py-4">
                                                <span className="bg-white px-3 py-1 rounded-lg text-[11px] font-bold text-slate-500 shadow-sm uppercase tracking-wider">
                                                    {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={cn("flex w-full mb-1 flex-col", isMe ? "items-end" : "items-start")}>
                                            {readOnly && (
                                                <span className={cn(
                                                    "text-[10px] font-bold mb-0.5 px-1 uppercase tracking-wider opacity-70",
                                                    isMe ? "text-green-600 mr-10" : "text-blue-600 ml-10"
                                                )}>
                                                    {msg.sender_type === 'company' ? 'Entreprise' : 'Consultant'}
                                                </span>
                                            )}
                                            <div className={cn(
                                                "max-w-[85%] px-3 py-1.5 text-[14.2px] shadow-sm relative",
                                                isMe
                                                    ? "bg-[#dcf8c6] text-slate-800 rounded-lg rounded-tr-none ml-10"
                                                    : "bg-white text-slate-800 rounded-lg rounded-tl-none mr-10"
                                            )}>

                                                {msg.attachment_url && (
                                                    <div className="mb-2">
                                                        {msg.attachment_type?.startsWith('image/') ? (
                                                            <a href={`${STORAGE_URL}${msg.attachment_url}`} target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={`${STORAGE_URL}${msg.attachment_url}`}
                                                                    alt="Attachment"
                                                                    className="max-w-full rounded-md max-h-[200px] object-cover"
                                                                />
                                                            </a>
                                                        ) : (
                                                            <a
                                                                href={`${STORAGE_URL}${msg.attachment_url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 bg-slate-100 p-2 rounded hover:bg-slate-200 transition-colors"
                                                            >
                                                                <Paperclip className="size-4 text-slate-500" />
                                                                <span className="text-sm underline text-blue-600 truncate max-w-[150px]">
                                                                    Voir la pièce jointe
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                {msg.content}
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-[10px] text-slate-500">
                                                        {format(new Date(msg.created_at), 'HH:mm')}
                                                    </span>
                                                    {(isMe && !readOnly) && <CheckCheck className="size-3 text-blue-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div ref={scrollRef} className="h-2 w-full" />
            </div>

            {/* Input Area */}
            {!readOnly && (
                <div className="p-3 bg-[#f0f2f5] flex items-center gap-3">
                    <Smile className="size-6 text-slate-500 cursor-pointer" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="focus:outline-none"
                    >
                        {uploading ? (
                            <Loader2 className="size-6 text-slate-500 animate-spin" />
                        ) : (
                            <Paperclip className="size-6 text-slate-500 cursor-pointer -rotate-45" />
                        )}
                    </button>

                    <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Tapez un message"
                            className="flex-1 bg-white border-none rounded-lg px-4 py-2.5 text-[15px] focus:ring-0 outline-none shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="p-2.5 bg-transparent text-slate-500 hover:text-slate-700 transition-all"
                        >
                            {sending ? <Loader2 className="size-6 animate-spin" /> : <Send className="size-6" />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
