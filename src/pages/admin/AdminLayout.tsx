
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
    Users,
    Briefcase,
    Settings,
    LogOut,
    Bell,
    ShieldAlert,
    FileText,
    Activity,
    User as UserIcon,
    Building2,
    Target,
    MessageSquareText,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardLayout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        {
            title: "Vue d'ensemble",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Consultants",
            url: "/admin/consultants",
            icon: UserIcon,
        },
        {
            title: "Entreprises",
            url: "/admin/companies",
            icon: Building2,
        },
        {
            title: "Inscriptions",
            url: "/admin/requests",
            icon: ShieldAlert,
        },
        {
            title: "Gestion Missions",
            url: "/admin/missions",
            icon: Briefcase,
        },


        {
            title: "Analytics",
            url: "/admin/analytics",
            icon: Activity,
        },
        {
            title: "Conversations",
            url: "/admin/conversations",
            icon: MessageSquareText,
        },
        {
            title: "Gestion de Compétence",
            url: "/admin/taxonomy",
            icon: Target,
        },
        {
            title: "Paramètres Globaux",
            url: "/admin/settings",
            icon: Settings,
        },
    ];

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <Sidebar collapsible="icon">
                    <SidebarHeader className="h-16 border-b border-sidebar-border/50 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-2 w-full">
                            <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive font-bold">
                                AD
                            </div>
                            <span className="font-semibold text-lg truncate group-data-[collapsible=icon]:hidden">
                                Admin Panel
                            </span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
                                        <LogOut className="size-4" />
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
                            <h1 className="text-lg font-semibold">Portail Administrateur</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-xs font-bold text-foreground">
                                    {JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Super Administrateur</span>
                            </div>
                            <div className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded font-bold border border-destructive/20">
                                MODE ADMIN
                            </div>
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
