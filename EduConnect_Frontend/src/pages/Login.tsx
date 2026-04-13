import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { UserRole } from '../state/types'

type Mode = 'signin' | 'signup'

const roles: UserRole[] = ['Student', 'Tutor', 'Admin']

export default function Login() {
    const navigate = useNavigate()
    const { actions } = useApp()

    const [mode, setMode] = useState<Mode>('signin')
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<UserRole>('Student')
    const [showPassword, setShowPassword] = useState(false)
    const [forgotVisible, setForgotVisible] = useState(false)
    const [authError, setAuthError] = useState('')

    const canSubmit = useMemo(() => {
        if (mode === 'signup') return usernameOrEmail.trim().length > 1 && password.length > 1 && email.trim().includes('@')
        return usernameOrEmail.trim().includes('@') && password.length > 1
    }, [usernameOrEmail, password, mode, email])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) return
        setAuthError('')
        try {
            await actions.login({ usernameOrEmail: usernameOrEmail.trim(), password, role, mode, email: mode === 'signup' ? email.trim() : undefined })
            navigate('/', { replace: true })
        } catch (error: any) {
            setAuthError(error?.response?.data?.message ?? error?.message ?? 'Authentication failed')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
                    <h1 className="text-3xl font-bold">EduConnect</h1>
                    <p className="text-accent-100 mt-1">Sign in to continue learning</p>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-6">
                        {(['signin', 'signup'] as const).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMode(m)}
                                className={`flex-1 py-2 rounded-lg font-semibold transition-colors text-sm ${mode === m
                                        ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {m === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {mode === 'signin' ? 'Email' : 'Username'}
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    placeholder={mode === 'signin' ? 'Enter your email' : 'Choose a username'}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setForgotVisible(true)}
                                className="text-sm font-semibold text-accent-600 hover:text-accent-700"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {forgotVisible && (
                            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
                                Password reset is simulated in this demo. Use any password to {mode === 'signin' ? 'sign in' : 'sign up'}.
                                <button
                                    type="button"
                                    onClick={() => setForgotVisible(false)}
                                    className="ml-2 font-semibold text-accent-600 hover:text-accent-700"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {authError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${canSubmit
                                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                                    : 'bg-gray-200 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

