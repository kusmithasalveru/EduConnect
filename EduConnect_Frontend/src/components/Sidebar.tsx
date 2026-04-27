import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Trophy,
    ShoppingBag,
    User,
    Settings,
    LogOut,
} from 'lucide-react'
import { useApp } from '../state/AppContext'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/chat', label: 'Community', icon: MessageSquare },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/eshop', label: 'E-Shop', icon: ShoppingBag },
]

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { state, actions } = useApp()

    const isActive = (path: string) => location.pathname === path
    const initials = (state.user?.username ?? 'JD')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('')

    return (
        <div className="w-64 flex flex-col bg-transparent">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-lg leading-none">E</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            EduConnect
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">Learn Together</p>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => {
                    const active = isActive(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={cn(
                                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {active && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon
                                size={18}
                                className={cn("relative z-10 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
                            />
                            <span className="relative z-10">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 space-y-1">
                <Link
                    to="/profile"
                    className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                        isActive('/profile') ? "text-primary font-semibold bg-primary/10 dark:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <User size={18} className={isActive('/profile') ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                    <span>Profile</span>
                </Link>

                <Link
                    to="/settings"
                    className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                        isActive('/settings') ? "text-primary font-semibold bg-primary/10 dark:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <Settings size={18} className={isActive('/settings') ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                    <span>Settings</span>
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        actions.logout()
                        navigate('/login', { replace: true })
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut size={18} className="text-muted-foreground group-hover:text-destructive transition-colors" />
                    <span>Logout</span>
                </button>
            </div>

            {/* User Info Card */}
            <div className="p-4 mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/50 shadow-sm backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {initials || 'JD'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                            {state.user?.username ?? 'John Doe'}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">{state.user?.role ?? 'Student'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
