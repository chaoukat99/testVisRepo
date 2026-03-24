import { useState, useEffect } from "react";
import { api, STORAGE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Loader2, Search, MessageSquare, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function AdminConversations() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await api.getAllConversations();
            if (response.success && response.conversations) {
                setConversations(response.conversations);
            } else {
                // If API fails or returns empty (e.g. not implemented on backend), use mock data for demonstration if needed, 
                // OR just show empty state. For now, let's assume empty.
                console.log("No conversations found or API error");
                // Mock data for visual confirmation since backend might not have this endpoint
                // REMOVE MOCK DATA IN PROD
                /*
                setConversations([
                    {
                        id: "conv_1",
                        consultant: { prenom: "Jean", nom: "Dupont", photo_url: "" },
                        company: { name: "TechCorp" },
                        last_message: "Bonjour, êtes-vous disponible ?",
                        last_message_at: new Date().toISOString()
                    }
                ]);
                */
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const searchLower = searchQuery.toLowerCase();
        const consultantName = `${conv.consultant?.prenom || ''} ${conv.consultant?.nom || ''}`.toLowerCase();
        const companyName = (conv.company?.name || '').toLowerCase();
        return consultantName.includes(searchLower) || companyName.includes(searchLower);
    });

    const handleSelectConversation = (id: string) => {
        setSelectedConversation(id);
    };

    const getSelectedConversationDetails = () => {
        if (!selectedConversation) return null;
        return conversations.find(c => c.id === selectedConversation);
    };

    const selectedConv = getSelectedConversationDetails();

    return (
        <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
            {/* Sidebar List */}
            <Card className="w-1/3 flex flex-col h-full overflow-hidden border-border/50">
                <CardHeader className="py-4 px-4 border-b">
                    <CardTitle className="text-lg">Historique des Chats</CardTitle>
                    <CardDescription>
                        Discussions entre consultants et entreprises
                    </CardDescription>
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrer par nom ou entreprise..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground px-4">
                            Aucune conversation trouvée.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-start gap-3 ${selectedConversation === conv.id ? "bg-muted" : ""
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="flex -space-x-2">
                                            <Avatar className="border-2 border-background h-10 w-10">
                                                <AvatarImage src={conv.consultant?.photo_url ? `${STORAGE_URL}${conv.consultant.photo_url}` : ""} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    {conv.consultant?.prenom?.[0] || "C"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Avatar className="border-2 border-background h-10 w-10">
                                                <AvatarImage src={conv.company?.logo_url ? `${STORAGE_URL}${conv.company.logo_url}` : ""} />
                                                <AvatarFallback className="bg-orange-100 text-orange-600">
                                                    {conv.company?.name?.[0] || "E"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium truncate text-sm">
                                                {conv.consultant?.prenom} {conv.consultant?.nom}
                                                <span className="text-muted-foreground mx-1">↔</span>
                                                {conv.company?.name}
                                            </span>
                                            {conv.last_message_at && (
                                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                    {format(new Date(conv.last_message_at), 'dd/MM HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {conv.last_message || "Aucun message"}
                                        </p>
                                        {/* Optional: Show Mission Name if available */}
                                        {conv.mission_title && (
                                            <p className="text-xs text-primary/80 mt-1 truncate flex items-center gap-1">
                                                <Briefcase className="h-3 w-3" />
                                                {conv.mission_title}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Chat Window Area */}
            <Card className="flex-1 h-full overflow-hidden border-border/50 flex flex-col">
                {selectedConversation && selectedConv ? (
                    <div className="h-full flex flex-col">
                        {/* We reuse ChatWindow but we need to adapt props slightly. 
                            ChatWindow expects specific currentUser and titles.
                            Since we are admin, we are observing. We pass admin as currentUser, 
                            but we set readOnly=true.
                         */}
                        <ChatWindow
                            conversationId={selectedConversation}
                            title={`${selectedConv.consultant?.prenom} ${selectedConv.consultant?.nom} - ${selectedConv.company?.name}`}
                            subtitle={`Discussion ${selectedConv.mission_title ? `sur ${selectedConv.mission_title}` : ""}`}
                            onClose={() => setSelectedConversation(null)}
                            currentUser={currentUser}
                            readOnly={true}
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                        <MessageSquare className="h-16 w-16 opacity-20 mb-4" />
                        <p className="text-lg font-medium">Sélectionnez une conversation</p>
                        <p className="text-sm">Pour voir l'historique des échanges</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
