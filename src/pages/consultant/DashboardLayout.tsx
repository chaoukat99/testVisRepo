
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    User,
    Briefcase,
    Settings,
    LogOut,
    Bell,
    Search,
    MessageSquare,
    Sparkles,
} from "lucide-react";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ConsultantDashboardLayout() {
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        {
            title: "Tableau de bord",
            url: "/consultant/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Mon Profil",
            url: "/consultant/profile",
            icon: User,
        },
        {
            title: "Recherche de missions",
            url: "/consultant/search-missions",
            icon: Search,
        },
        {
            title: "Mes Missions",
            url: "/consultant/missions",
            icon: Briefcase,
        },
        {
            title: "Paramètres",
            url: "/consultant/settings",
            icon: Settings,
        },
        {
            title: "Messages",
            url: "/consultant/conversations",
            icon: MessageSquare,
        },
        {
            title: "Analyseur CV (ATS)",
            url: "/consultant/ats-checker",
            icon: Sparkles,
        },
    ];

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/consultant-login');
    };

    // Get profile type label
    const getProfileTypeLabel = () => {
        if (!user?.profile_type) return "Consultant";
        return user.profile_type;
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <Sidebar collapsible="icon">
                    <SidebarHeader className="h-16 border-b border-sidebar-border/50 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-2 w-full">
                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                AI
                            </div>
                            <span className="font-semibold text-lg truncate group-data-[collapsible=icon]:hidden">
                                OPEN IN 
                            </span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu {getProfileTypeLabel()}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive(item.url)}
                                                tooltip={item.title}
                                            >
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-sidebar-border/50 p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Déconnexion">
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full flex items-center gap-2"
                                    >
                                        <LogOut />
                                        <span>Déconnexion</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>

                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex-1 flex items-center gap-3">
                            <h1 className="text-lg font-semibold">Espace {getProfileTypeLabel()}</h1>
                            {user?.profile_type && (
                                <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 font-bold text-xs">
                                    {user.profile_type}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-accent transition-colors relative">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>
                            <ThemeSwitcher />
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-y-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
