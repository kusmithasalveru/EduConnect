import { Zap, Clock, BookOpen, TrendingUp, Flame, Target, Sparkles, Search as SearchIcon, ArrowRight } from 'lucide-react'
import { ProgressCard, CourseCard } from '../components'
import { useApp } from '../state/AppContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { tutors } from '../data/tutors'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
    const { state, actions } = useApp()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    const progressCards = [
        {
            title: 'Learning Streak',
            current: state.stats.learningStreak,
            maximum: 30,
            icon: <Zap className="text-white" size={24} />,
            color: 'bg-gradient-to-br from-orange-400 to-rose-500',
        },
        {
            title: 'Courses Done',
            current: state.stats.coursesCompleted,
            maximum: 20,
            icon: <BookOpen className="text-white" size={24} />,
            color: 'bg-gradient-to-br from-blue-400 to-indigo-600',
        },
        {
            title: 'Tutor Sessions',
            current: state.stats.tutorSessions,
            maximum: 30,
            icon: <Clock className="text-white" size={24} />,
            color: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        },
        {
            title: 'Community Pts',
            current: state.stats.communityPoints,
            maximum: 1000,
            icon: <TrendingUp className="text-white" size={24} />,
            color: 'bg-gradient-to-br from-violet-400 to-purple-600',
        },
    ]

    const continueLearning = state.courses.filter((c) => c.enrollmentStatus === 'enrolled' || c.enrollmentStatus === 'completed')
    const continueLearningCards = continueLearning.length > 0 ? continueLearning : state.courses
    const upcomingSessions = state.sessions.filter((s) => s.status === 'upcoming')

    const searchResults = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return { courses: [], tutors: [], channels: [] }
        const courses = state.courses.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)).slice(0, 4)
        const tutorMatches = tutors.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 4)
        const channels = state.channels.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0, 4)
        return { courses, tutors: tutorMatches, channels }
    }, [search, state.courses, state.channels])

    const weeklyData = [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 58 },
        { name: 'Wed', value: 66 },
        { name: 'Thu', value: 72 },
        { name: 'Fri', value: 55 },
        { name: 'Sat', value: 80 },
        { name: 'Sun', value: 88 }
    ]

    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Main Hero & Progress */}
                <div className="xl:col-span-2 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative rounded-3xl p-8 overflow-hidden bg-primary shadow-2xl shadow-primary/20 border border-primary/20"
                    >
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-blue-600 opacity-90"></div>
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[80px] rounded-full transform rotate-12 pointer-events-none"></div>
                        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-black/10 blur-[80px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                            <div className="lg:col-span-3">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-5 backdrop-blur-md shadow-sm"
                                >
                                    <Sparkles size={14} className="text-yellow-300" />
                                    <span>Weekly Goal: 80% Completed</span>
                                </motion.div>
                                
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                                    Welcome back, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">
                                        {state.profile?.fullName ?? state.user?.username ?? 'Learner'}!
                                    </span>
                                </h1>
                                <p className="text-white/80 text-lg lg:text-xl font-medium max-w-lg mb-8 leading-relaxed">
                                    You're on a <strong className="text-white">{state.stats.learningStreak} day streak</strong>. Keep up the momentum with focused learning blocks today.
                                </p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => navigate('/courses')} className="px-6 py-3.5 rounded-xl bg-white text-primary font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                        Continue Learning <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2 rounded-2xl bg-black/20 border border-white/10 p-5 backdrop-blur-md shadow-inner h-full flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm font-semibold text-white/90">Activity Overview</p>
                                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] text-white font-bold uppercase tracking-wider">This Week</span>
                                </div>
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {progressCards.map((card, idx) => (
                            <motion.div 
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                            >
                                <ProgressCard {...card} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar Stats */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6"
                >
                    {/* Search Component */}
                    <div className="glass rounded-2xl p-6 relative overflow-visible z-20">
                        <h2 className="text-xl font-bold text-foreground mb-4">Quick Search</h2>
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Courses, tutors, channels..."
                                className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground shadow-inner"
                            />
                        </div>
                        
                        <AnimatePresence>
                            {search.trim() && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-[calc(100%+8px)] left-0 right-0 glass rounded-2xl p-4 border border-border/50 shadow-2xl max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col gap-4"
                                >
                                    {searchResults.courses.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Courses</p>
                                            {searchResults.courses.map((c) => (
                                                <button key={c.id} onClick={() => navigate(`/courses/${c.id}`)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/80 transition-colors">
                                                    <p className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.tutors.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Tutors</p>
                                            {searchResults.tutors.map((t) => (
                                                <button key={t.id} onClick={() => navigate('/tutors')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/80 transition-colors">
                                                    <p className="text-sm font-semibold text-foreground line-clamp-1">{t.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.channels.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Channels</p>
                                            {searchResults.channels.map((c) => (
                                                <button key={c.id} onClick={() => navigate(`/chat?view=all&channel=${c.id}`)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted/80 transition-colors">
                                                    <p className="text-sm font-semibold text-foreground line-clamp-1">#{c.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {Object.values(searchResults).every(arr => arr.length === 0) && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No results found.</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="glass rounded-2xl p-6 group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daily Streak</p>
                                <p className="text-4xl font-extrabold text-foreground mt-2 flex items-center gap-3">
                                    <span className="relative flex h-10 w-10">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></span>
                                      <span className="relative inline-flex rounded-full h-10 w-10 bg-orange-100 dark:bg-orange-900/30 items-center justify-center">
                                          <Flame className="text-orange-500" size={24} />
                                      </span>
                                    </span>
                                    {state.stats.learningStreak} <span className="text-xl text-muted-foreground font-medium">Days</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '76%' }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full relative"
                            >
                                <div className="absolute top-0 inset-x-0 h-full bg-white/30 blur-[2px] animate-pulse-soft"></div>
                            </motion.div>
                        </div>
                        <p className="mt-3 text-sm font-bold text-orange-600 dark:text-orange-400">76% toward weekly goal</p>
                    </div>

                    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 blur-2xl rounded-full group-hover:bg-white/20 transition-colors duration-500"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Quote of the Day</p>
                            <p className="font-extrabold text-xl leading-tight">"Small daily progress compounds into massive results."</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-foreground">Continue Learning</h2>
                            <button onClick={() => navigate('/courses')} className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1 transition-colors">
                                View All <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(isLoading ? [1, 2] : continueLearningCards.slice(0, 2)).map((course: any, index) =>
                                isLoading ? (
                                    <div key={index} className="h-[380px] rounded-2xl bg-muted animate-pulse border border-border/50" />
                                ) : (
                                    <CourseCard
                                        key={course.id}
                                        {...course}
                                        enrollmentStatus={course.enrollmentStatus}
                                        channelName={course.channelId ? state.channels.find((c) => c.id === course.channelId)?.name : undefined}
                                        onStartDiscussion={() => {
                                            actions.setActiveChannelId('queries')
                                            navigate('/chat?view=all&channel=queries')
                                        }}
                                        onOpenCourse={(id) => {
                                            navigate(`/courses/${id}`)
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-foreground mb-5">Your Top Instructors</h3>
                        <div className="space-y-4">
                            {tutors.slice(0, 4).map((teacher) => (
                                <div key={teacher.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border/50 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                                        {teacher.name.split(' ').map((namePart) => namePart[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{teacher.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{teacher.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/tutors')} className="w-full mt-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            Find More Tutors
                        </button>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-foreground mb-5">Quick Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Target size={18} /></div>
                                    <span className="text-sm font-semibold text-foreground">Goals hit</span>
                                </div>
                                <strong className="text-sm font-bold">6 / 7</strong>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Sparkles size={18} /></div>
                                    <span className="text-sm font-semibold text-foreground">Community Pts</span>
                                </div>
                                <strong className="text-sm font-bold">{state.stats.communityPoints}</strong>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Clock size={18} /></div>
                                    <span className="text-sm font-semibold text-foreground">Upcoming Sessions</span>
                                </div>
                                <strong className="text-sm font-bold">{upcomingSessions.length}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
