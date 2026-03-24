import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
    Building2,
    Users,
    Sparkles,
    Briefcase,
    LogIn,
    UserPlus,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/ui/Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const circularNavItems = [
    {
        href: "/company-solutions",
        tKey: "navbar.company",
        icon: Building2,
        color: "from-[#FACC15] via-[#EAB308] to-[#CA8A04]",
        shadowColor: "shadow-yellow-500/30"
    },
    {
        href: "/consultant-opportunities",
        tKey: "navbar.talents",
        icon: Users,
        color: "from-[#22C55E] via-[#16A34A] to-[#15803D]",
        shadowColor: "shadow-green-500/30"
    },
    {
        href: "/cabinet-conseil",
        tKey: "Cabinet\nde Conseil",
        icon: Briefcase,
        color: "from-[#14B8A6] via-[#0D9488] to-[#0F766E]",
        shadowColor: "shadow-teal-500/30"
    },
    {
        href: "/Ghaya-agence-ai",
        tKey: "GHAYA\nAgence Ai",
        icon: Sparkles,
        color: "from-[#EC4899] via-[#D946EF] to-[#A855F7]",
        shadowColor: "shadow-pink-500/30"
    },
];

export function CircularNavbar() {
    const location = useLocation();
    const { t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const pillBg = { background: "radial-gradient(circle at 50% 30%, #354759 0%, #192432 100%)" };

    return (
        <>
            <AnimatePresence>
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
                >
                    {/* ── Centered pill ── */}
                    <div className="mx-auto mt-2 max-w-fit px-2 sm:px-4 pointer-events-auto flex items-center justify-center">
                        <nav className="relative">
                            <div
                                className="backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] flex items-center ring-1 ring-white/5"
                                style={pillBg}
                            >
                                {/* Logo */}
                                <Link to="/" className="flex-shrink-0 self-center ml-4 pl-3 pr-2 mr-4 scale-[1.8] sm:scale-[2] sm:mr-6">
                                    <Logo size="sm" />
                                </Link>

                                {/* ── DESKTOP nav items (hidden on mobile) ── */}
                                <div className="hidden sm:flex items-center gap-4 sm:gap-6 p-2.5">
                                    {circularNavItems.map((item, index) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <div key={item.href} className="flex items-center">
                                                <Link to={item.href} id={`nav-${item.tKey}`}>
                                                    <motion.div
                                                        className="relative group"
                                                        whileHover={{ y: -12, scale: 1.2, rotate: 4 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    >
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="nav-glow"
                                                                style={{ padding: 10 }}
                                                                className={cn(
                                                                    "absolute inset-[-3px] rounded-full blur-lg opacity-40",
                                                                    `bg-gradient-to-br ${item.color}`
                                                                )}
                                                            />
                                                        )}
                                                        <div className={cn(
                                                            "relative w-[68px] h-[68px] rounded-full border-[1.5px] overflow-hidden flex flex-col transition-all duration-500",
                                                            isActive
                                                                ? "border-white/60 shadow-xl ring-2 ring-white/10 scale-105"
                                                                : "border-white/5 group-hover:border-white/25 shadow-md",
                                                            item.shadowColor
                                                        )}>
                                                            <div className={cn(
                                                                "h-[58%] w-full flex items-center justify-center relative",
                                                                `bg-gradient-to-br ${item.color}`
                                                            )}>
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
                                                                <motion.div
                                                                    animate={isActive ? { y: [0, -2, 0], scale: [1, 1.05, 1] } : {}}
                                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                                    className="relative z-10"
                                                                >
                                                                    <item.icon className="w-7 h-7 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)]" />
                                                                </motion.div>
                                                            </div>
                                                            <div className={cn(
                                                                "h-[45%] w-full flex items-center justify-center px-1 text-center border-t border-black/40 relative z-10",
                                                                "bg-[#1a262f] group-hover:bg-[#2c3d4a] transition-colors"
                                                            )}>
                                                                <div className="absolute inset-0 shadow-[inset_0_1.5px_6px_rgba(0,0,0,0.5)] pointer-events-none" />
                                                                <span className={cn(
                                                                    "text-[9.5px] font-bold tracking-tight leading-none transition-all uppercase whitespace-pre-line text-center",
                                                                    isActive ? "text-white" : "text-white/40 group-hover:text-white"
                                                                )}>
                                                                    {t(item.tKey)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="active-nav-indicator"
                                                                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.6)]" />
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                </Link>
                                                {index < circularNavItems.length - 1 && (
                                                    <div className="mx-1 flex items-center justify-center">
                                                        <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-l-[5.5px] border-l-white/20 border-b-[3.5px] border-b-transparent" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ── Controls (always visible) ── */}
                                <div className="flex items-center gap-2 sm:gap-4 px-3 sm:pl-4 sm:pr-2 border-l border-white/10 ml-1 sm:ml-2 py-2.5">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <LanguageSelector />
                                        <div className="w-px h-5 bg-white/10 hidden sm:block" />
                                        <ThemeSwitcher />
                                    </div>

                                    <div className="w-px h-6 bg-white/15 mx-1" />

                                    {/* Login Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="cursor-pointer">
                                                <div className="hidden sm:block">
                                                    <motion.button
                                                        whileHover={{ y: -2, scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15
                                                                   text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5
                                                                   transition-all duration-200 text-xs font-semibold tracking-wide"
                                                    >
                                                        <LogIn className="w-3.5 h-3.5" />
                                                        <span className="hidden lg:inline">{t("navbar.login") || "Login"}</span>
                                                    </motion.button>
                                                </div>
                                                <div className="sm:hidden">
                                                    <LogIn className="w-5 h-5 text-white/70" />
                                                </div>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-[#0f172a]/95 border-white/10 backdrop-blur-xl text-white">
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/company-login" className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-yellow-400" />
                                                    <span>{t('gsap_showcase.visual.company')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/consultant-login" className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-green-400" />
                                                    <span>{t('gsap_showcase.visual.talent')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/company-login" className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-teal-400" />
                                                    <span>{t('gsap_showcase.visual.cabinet')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Signup Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.button
                                                whileHover={{ y: -2, scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white
                                                           text-xs font-semibold tracking-wide shadow-md
                                                           transition-all duration-200 cursor-pointer"
                                                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">{t("navbar.signup") || "Sign Up"}</span>
                                            </motion.button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-[#0f172a]/95 border-white/10 backdrop-blur-xl text-white">
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/company-register" className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-yellow-400" />
                                                    <span>{t('gsap_showcase.visual.company')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/consultant-register" className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-green-400" />
                                                    <span>{t('gsap_showcase.visual.talent')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                <Link to="/cabinet-conseil" className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-teal-400" />
                                                    <span>{t('gsap_showcase.visual.cabinet')}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* ── Mobile hamburger (only on small screens) ── */}
                                    <button
                                        className="sm:hidden ml-1 p-1.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-all"
                                        onClick={() => setMobileOpen(v => !v)}
                                        aria-label="Toggle menu"
                                    >
                                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </motion.header>
            </AnimatePresence>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 right-0 z-45 sm:hidden pt-20 pb-6 px-4"
                            style={{ background: "radial-gradient(circle at 50% 0%, #354759 0%, #192432 100%)", zIndex: 45 }}
                        >
                            <div className="flex flex-col gap-3">
                                {circularNavItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200",
                                                isActive
                                                    ? "border-white/30 bg-white/10"
                                                    : "border-white/8 hover:bg-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                                `bg-gradient-to-br ${item.color}`
                                            )}>
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-bold uppercase tracking-wide whitespace-pre-line",
                                                isActive ? "text-white" : "text-white/60"
                                            )}>
                                                {t(item.tKey)}
                                            </span>
                                            {isActive && (
                                                <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.5)]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
