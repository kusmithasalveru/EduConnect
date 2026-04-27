import { useMemo, useState } from 'react'
import { Search, Bell, Moon, Sun } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface NavbarProps {
    toggleTheme: () => void
    isDark: boolean
}

export default function Navbar({ toggleTheme, isDark }: NavbarProps) {
    const { state, actions } = useApp()
    const [isOpen, setIsOpen] = useState(false)

    const unreadCount = useMemo(() => state.notifications.filter((n) => !n.read).length, [state.notifications])
    const initials = useMemo(() => {
        const u = state.user?.username ?? 'JD'
        return (
            u
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join('') || 'JD'
        )
    }, [state.user?.username])

    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 px-6 py-4 flex items-center justify-between shadow-sm">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses, tutors, or topics..."
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/50 dark:bg-muted/20 border border-transparent focus:border-primary/50 focus:bg-background rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder-muted-foreground transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsOpen((v) => !v)
                            actions.markAllNotificationsRead()
                        }}
                        className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all active:scale-95"
                    >
                    <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-80 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-20"
                            >
                                <div className="px-5 py-4 border-b border-border/50 bg-muted/20">
                                    <p className="font-semibold text-foreground">Notifications</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Only upcoming sessions and tutor reminders
                                    </p>
                                </div>

                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {state.notifications.length === 0 ? (
                                        <div className="px-5 py-8 text-sm text-center text-muted-foreground">No notifications right now.</div>
                                    ) : (
                                        state.notifications.slice(0, 12).map((n) => (
                                            <div
                                                key={n.id}
                                                className="px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                                            >
                                                <p className="text-sm font-medium text-foreground">{n.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-5 py-3 text-sm font-semibold text-primary hover:bg-muted/50 transition-colors border-t border-border/50"
                                >
                                    Mark all as read
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all active:scale-95"
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* User Status */}
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Welcome back!</p>
                        <p className="text-xs text-muted-foreground">{state.user?.role ?? 'Student'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-background group-hover:ring-primary/30 transition-all">
                        {initials}
                    </div>
                </div>
            </div>
        </nav>
    )
}
