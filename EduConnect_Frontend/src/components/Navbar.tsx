import { useMemo, useState } from 'react'
import { Search, Bell, Moon, Sun } from 'lucide-react'
import { useApp } from '../state/AppContext'

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
        <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses, tutors, or topics..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 placeholder-gray-500 dark:placeholder-gray-400"
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
                        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                    <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-20">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800">
                                <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Only upcoming sessions and tutor reminders
                                </p>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {state.notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-sm text-gray-600 dark:text-gray-400">No notifications.</div>
                                ) : (
                                    state.notifications.slice(0, 12).map((n) => (
                                        <div
                                            key={n.id}
                                            className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 last:border-0"
                                        >
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{n.body}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full px-4 py-3 text-sm font-semibold text-accent-600 hover:bg-gray-50 dark:hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 dark:bg-slate-700" />

                {/* User Status */}
                <div className="flex items-center gap-3 pl-4">
                    <div className="text-right">
                        <p className="text-sm font-medium">Welcome back!</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{state.user?.role ?? 'Student'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                </div>
            </div>
        </nav>
    )
}
