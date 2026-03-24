
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
    Building2,
    Briefcase,
    Settings,
    LogOut,
    Bell,
    Search,
    PlusCircle,
    Users,
    Sparkles,
    MessageSquare,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";

export default function CompanyDashboardLayout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        {
            title: "Tableau de bord",
            url: "/company/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Rechercher Talents",
            url: "/company/search-talents",
            icon: Search,
        },
        {
            title: "Mes Missions",
            url: "/company/missions",
            icon: Briefcase,
        },
        {
            title: "Poster une mission",
            url: "/company/post-mission",
            icon: PlusCircle,
        },
        {
            title: "Conversations",
            url: "/company/conversations",
            icon: MessageSquare,
        },
        {
            title: "Talents Contactés",
            url: "/company/contacted",
            icon: Users,
        },
        {
            title: "Planifier Entretien AI",
            url: "/company/ai-interview",
            icon: Sparkles,
        },
        {
            title: "Profil Entreprise",
            url: "/company/profile",
            icon: Building2,
        },
        {
            title: "Paramètres",
            url: "/company/settings",
            icon: Settings,
        },
    ];
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/company-login');
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
                                OPENIN PARTNERS                            </span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu Entreprise</SidebarGroupLabel>
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
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">Espace Entreprise</h1>
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
