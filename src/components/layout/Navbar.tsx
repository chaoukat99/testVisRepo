import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/company-register", label: "Entreprises" },
  { href: "/consultant-register", label: "Consultants" },
  { href: "/search-consultants", label: "Recherche" },
  { href: "/post-mission", label: "Poster Mission" },
  { href: "/ai-matching-demo", label: "Espace IA" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-base font-medium transition-all duration-300",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button & Theme Switcher */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeSwitcher />
              <Link to="/ai-matching-demo" className="relative group">
                {/* Orbital particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`orbit-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: [
                        Math.cos((i * 120 * Math.PI) / 180) * 35,
                        Math.cos(((i * 120 + 360) * Math.PI) / 180) * 35,
                      ],
                      y: [
                        Math.sin((i * 120 * Math.PI) / 180) * 20,
                        Math.sin(((i * 120 + 360) * Math.PI) / 180) * 20,
                      ],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.4,
                    }}
                  />
                ))}

                {/* Holographic glow */}
                <motion.div
                  className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent, #ec4899, transparent, #8b5cf6, transparent, #3b82f6, transparent)",
                    filter: "blur(20px)",
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Main button container */}
                <motion.div
                  className="relative px-6 py-2.5 rounded-2xl overflow-hidden border border-fuchsia-400/30 bg-gradient-to-br from-slate-900/90 via-fuchsia-950/50 to-violet-950/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Hexagonal grid pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern
                          id="hexagons"
                          width="28"
                          height="49"
                          patternUnits="userSpaceOnUse"
                          patternTransform="scale(0.3)"
                        >
                          <path
                            d="M14 0L28 8v16l-14 8-14-8V8z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#hexagons)" />
                    </svg>
                  </div>

                  {/* Animated data streams */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #ec4899 50%, transparent 100%)",
                    }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Glitch effect bars */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`glitch-${i}`}
                        className="absolute h-px bg-fuchsia-400"
                        style={{
                          left: 0,
                          right: 0,
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          x: ["-100%", "100%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-400/60 rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-violet-400/60 rounded-br-lg" />

                  {/* Button content */}
                  <span className="relative flex items-center gap-2.5 text-sm font-bold tracking-wide">
                    {/* AI Icon with pulse */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-fuchsia-400" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-fuchsia-400/30"
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    </motion.div>

                    <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                      Essayer l'IA
                    </span>

                    {/* Animated arrow */}
                    <motion.svg
                      className="w-3 h-3 text-fuchsia-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </span>

                  {/* Bottom glow line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeSwitcher />
              <button
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                        location.pathname === link.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-2">
                    <Link
                      to="/ai-matching-demo"
                      onClick={() => setIsOpen(false)}
                      className="relative group block"
                    >
                      {/* Orbital particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`orbit-mobile-${i}`}
                          className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                          animate={{
                            x: [
                              Math.cos((i * 120 * Math.PI) / 180) * 35,
                              Math.cos(((i * 120 + 360) * Math.PI) / 180) * 35,
                            ],
                            y: [
                              Math.sin((i * 120 * Math.PI) / 180) * 20,
                              Math.sin(((i * 120 + 360) * Math.PI) / 180) * 20,
                            ],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.4,
                          }}
                        />
                      ))}

                      {/* Main button container */}
                      <motion.div
                        className="relative w-full px-6 py-3 rounded-2xl overflow-hidden border border-fuchsia-400/30 bg-gradient-to-br from-slate-900/90 via-fuchsia-950/50 to-violet-950/50 backdrop-blur-sm"
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Hexagonal grid pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern
                                id="hexagons-mobile"
                                width="28"
                                height="49"
                                patternUnits="userSpaceOnUse"
                                patternTransform="scale(0.3)"
                              >
                                <path
                                  d="M14 0L28 8v16l-14 8-14-8V8z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hexagons-mobile)" />
                          </svg>
                        </div>

                        {/* Animated data streams */}
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, #ec4899 50%, transparent 100%)",
                          }}
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-400/60 rounded-tl-lg" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-violet-400/60 rounded-br-lg" />

                        {/* Button content */}
                        <span className="relative flex items-center justify-center gap-2.5 text-sm font-bold tracking-wide">
                          {/* AI Icon with pulse */}
                          <motion.div
                            className="relative"
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Sparkles className="w-4 h-4 text-fuchsia-400" />
                            <motion.div
                              className="absolute inset-0 rounded-full bg-fuchsia-400/30"
                              animate={{
                                scale: [1, 2, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                          </motion.div>

                          <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                            Essayer l'IA
                          </span>

                          {/* Animated arrow */}
                          <motion.svg
                            className="w-3 h-3 text-fuchsia-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            animate={{
                              x: [0, 3, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </motion.svg>
                        </span>

                        {/* Bottom glow line */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}
