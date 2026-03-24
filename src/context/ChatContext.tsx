
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Chat {
    id: string;
    receiverId?: string;
    title: string;
    subtitle?: string;
}

interface ChatContextType {
    activeChats: Chat[];
    openChat: (chat: Chat) => void;
    closeChat: (id: string) => void;
    isChatListOpen: boolean;
    toggleChatList: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeChats, setActiveChats] = useState<Chat[]>([]);
    const [isChatListOpen, setIsChatListOpen] = useState(false);

    const openChat = (chat: Chat) => {
        // Check if already open
        if (!activeChats.find(c => c.id === chat.id)) {
            // Limit to 3 active chats for UI sanity
            setActiveChats(prev => [...prev.slice(-2), chat]);
        }
        setIsChatListOpen(false); // Close list when opening a specific chat
    };

    const closeChat = (id: string) => {
        setActiveChats(prev => prev.filter(c => c.id !== id));
    };

    const toggleChatList = () => setIsChatListOpen(prev => !prev);

    return (
        <ChatContext.Provider value={{ activeChats, openChat, closeChat, isChatListOpen, toggleChatList }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
