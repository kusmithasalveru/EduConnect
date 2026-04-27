import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { useApp } from '../state/AppContext'
import type { UserRole } from '../state/types'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

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
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030014] text-foreground font-sans">
            {/* Unique Modern Grid & Aurora Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-blob"></div>
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[60%] bg-purple-500/20 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 p-6 lg:p-12">
                
                {/* Left Side: Branding / Value Prop */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 text-center lg:text-left space-y-6"
                >
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white">
                        Elevate your <br className="hidden lg:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-500 animate-pulse-soft">
                            learning journey
                        </span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                        Join the next-generation platform for students and top-tier tutors. Connect, learn, and grow with advanced AI insights and a community-driven ecosystem.
                    </p>

                    {/* Stats / Trust indicators */}
                    <div className="hidden lg:flex items-center gap-8 pt-8 opacity-80">
                        <div>
                            <p className="text-3xl font-bold text-foreground">10k+</p>
                            <p className="text-sm text-muted-foreground font-medium">Active Students</p>
                        </div>
                        <div className="w-px h-12 bg-border"></div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">500+</p>
                            <p className="text-sm text-muted-foreground font-medium">Expert Tutors</p>
                        </div>
                        <div className="w-px h-12 bg-border"></div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">98%</p>
                            <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Auth Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-md shrink-0"
                >
                    <div className="glass rounded-3xl p-8 shadow-2xl shadow-primary/10 border border-white/20 dark:border-white/10 relative overflow-hidden">
                        {/* Decorative top gradient line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-blue-500"></div>

                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                            <p className="text-sm text-muted-foreground">Enter your details to access your account</p>
                        </div>

                        <div className="flex p-1 mb-8 bg-muted/50 rounded-xl backdrop-blur-sm border border-border/50">
                            {(['signin', 'signup'] as const).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMode(m)}
                                    className={cn(
                                        "flex-1 py-2.5 rounded-lg font-semibold transition-all text-sm relative z-10",
                                        mode === m ? "text-foreground shadow-sm bg-background" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {m === 'signin' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground ml-1">
                                    {mode === 'signin' ? 'Email Address' : 'Username'}
                                </label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        value={usernameOrEmail}
                                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                                        placeholder={mode === 'signin' ? 'name@example.com' : 'Choose a username'}
                                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {mode === 'signup' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="space-y-1.5 overflow-hidden"
                                    >
                                        <label className="text-sm font-semibold text-foreground ml-1">Email Address</label>
                                        <div className="relative group">
                                            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground ml-1">Password</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground ml-1">I am a...</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    {roles.map((r) => (
                                        <option key={r} value={r} className="bg-background text-foreground">{r}</option>
                                    ))}
                                </select>
                            </div>

                            {mode === 'signin' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setForgotVisible(true)}
                                        className="text-sm font-medium text-primary hover:text-accent transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <AnimatePresence>
                                {forgotVisible && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-primary/90 flex justify-between items-center"
                                    >
                                        <span>Use any password for demo.</span>
                                        <button type="button" onClick={() => setForgotVisible(false)} className="font-bold hover:text-primary">Dismiss</button>
                                    </motion.div>
                                )}
                                
                                {authError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive"
                                    >
                                        {authError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className={cn(
                                    "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
                                    canSubmit
                                        ? "bg-foreground text-background hover:scale-[1.02] shadow-xl shadow-foreground/10"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} className={cn("transition-transform duration-300", canSubmit && "group-hover:translate-x-1")} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

