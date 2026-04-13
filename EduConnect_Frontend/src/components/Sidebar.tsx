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
        <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                    EduConnect
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn Together</p>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(path)
                                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Icon
                            size={20}
                            className={isActive(path) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-accent-600'}
                        />
                        <span className="font-medium">{label}</span>
                        {isActive(path) && <span className="ml-auto text-white">→</span>}
                    </Link>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-200 dark:border-slate-800 py-4 px-3 space-y-2">
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/profile')
                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                >
                    <User
                        size={20}
                        className={isActive('/profile') ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-accent-600'}
                    />
                    <span className="font-medium">Profile</span>
                </Link>

                <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/settings')
                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                >
                    <Settings
                        size={20}
                        className={isActive('/settings') ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-accent-600'}
                    />
                    <span className="font-medium">Settings</span>
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        actions.logout()
                        navigate('/login', { replace: true })
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                    <LogOut size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-accent-600" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* User Info Card */}
            <div className="border-t border-gray-200 dark:border-slate-800 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm">
                        {initials || 'JD'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {state.user?.username ?? 'John Doe'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{state.user?.role ?? 'Student'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
