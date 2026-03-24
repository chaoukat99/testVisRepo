
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { ChatWindow } from './ChatWindow';
import { ChatList } from './ChatList';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

export const ChatManager: React.FC = () => {
    const { activeChats, closeChat, openChat, isChatListOpen, toggleChatList } = useChat();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) return null;

    return (
        <>
            {/* Active Chat Windows */}
            <div className="fixed bottom-0 right-20 flex flex-row-reverse gap-4 items-end pointer-events-none z-[100]">
                {activeChats.map((chat) => (
                    <div key={chat.id} className="pointer-events-auto">
                        <ChatWindow
                            conversationId={chat.id}
                            receiverId={chat.receiverId}
                            title={chat.title}
                            subtitle={chat.subtitle}
                            onClose={() => closeChat(chat.id)}
                            currentUser={user}
                        />
                    </div>
                ))}
            </div>

            {/* Chat List Overlay */}
            {isChatListOpen && (
                <div className="fixed bottom-20 right-4 w-[350px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-[100]">
                    <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                        <h4 className="font-bold flex items-center gap-2">
                            <MessageSquare className="size-4" /> Vos Conversations
                        </h4>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 rounded-full" onClick={toggleChatList}>
                            <X className="size-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[440px]">
                        <ChatList onSelectConversation={(id, title, subtitle) => openChat({ id, title, subtitle })} currentUser={user} />
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={toggleChatList}
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center p-0 z-[100]"
            >
                <MessageSquare className="size-6" />
                {/* Unread badge placeholder */}
                {/* <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-white" /> */}
            </Button>
        </>
    );
};
