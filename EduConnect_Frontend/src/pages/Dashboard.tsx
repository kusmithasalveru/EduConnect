import { Zap, Clock, BookOpen, TrendingUp, Flame, Target, Sparkles } from 'lucide-react'
import { ProgressCard, CourseCard } from '../components'
import { useApp } from '../state/AppContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { tutors } from '../data/tutors'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const { state, actions } = useApp()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600)
        return () => clearTimeout(timer)
    }, [])

    const progressCards = [
        {
            title: 'Learning Streak',
            current: state.stats.learningStreak,
            maximum: 30,
            icon: <Zap className="text-white" size={24} />,
            color: 'bg-gradient-to-r from-orange-400 to-orange-600',
        },
        {
            title: 'Courses Completed',
            current: state.stats.coursesCompleted,
            maximum: 20,
            icon: <BookOpen className="text-white" size={24} />,
            color: 'bg-gradient-to-r from-blue-400 to-blue-600',
        },
        {
            title: 'Tutor Sessions',
            current: state.stats.tutorSessions,
            maximum: 30,
            icon: <Clock className="text-white" size={24} />,
            color: 'bg-gradient-to-r from-green-400 to-green-600',
        },
        {
            title: 'Community Points',
            current: state.stats.communityPoints,
            maximum: 1000,
            icon: <TrendingUp className="text-white" size={24} />,
            color: 'bg-gradient-to-r from-purple-400 to-purple-600',
        },
    ]

    const continueLearning = state.courses.filter((c) => c.enrollmentStatus === 'enrolled' || c.enrollmentStatus === 'completed')
    const continueLearningCards = continueLearning.length > 0 ? continueLearning : state.courses
    const upcomingSessions = state.sessions.filter((s) => s.status === 'upcoming')

    const searchResults = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return { courses: [], tutors: [], channels: [] }
        const courses = state.courses.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)).slice(0, 6)
        const tutorMatches = tutors.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 6)
        const channels = state.channels.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0, 6)
        return { courses, tutors: tutorMatches, channels }
    }, [search, state.courses, state.channels])

    const weeklyProgress = [40, 58, 66, 72, 55, 80, 88]

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 space-y-6">
                    <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-accent-600/90 to-indigo-600/90 backdrop-blur border border-white/20 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Welcome back, {state.profile?.fullName ?? state.user?.username ?? 'Learner'}!</h1>
                                <p className="text-accent-100 text-lg">Build momentum with focused learning blocks and track every win.</p>
                                <div className="flex gap-3 mt-5">
                                    <button onClick={() => navigate('/courses')} className="px-5 py-2.5 rounded-lg bg-white text-accent-700 font-semibold hover:shadow-md transition-all">Explore Courses</button>
                                    <button onClick={() => navigate('/chat')} className="px-5 py-2.5 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10 transition-all">Open Community</button>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/15 p-5 backdrop-blur">
                                <p className="text-sm text-accent-100 mb-3">Weekly Progress</p>
                                <div className="space-y-2">
                                    {weeklyProgress.map((value, idx) => (
                                        <div key={idx} className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: idx * 0.08 }} className="h-full rounded-full bg-white/90" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {progressCards.map((card) => (
                            <div key={card.title} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl border border-white/40 dark:border-slate-700 p-1 hover:shadow-lg transition-all">
                                <ProgressCard title={card.title} current={card.current} maximum={card.maximum} icon={card.icon} color={card.color} />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-white/40 dark:border-slate-700 p-5 shadow-sm">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily streak</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Flame className="text-orange-500" /> {state.stats.learningStreak} days</p>
                    </div>
                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-white/40 dark:border-slate-700 p-5 shadow-sm">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Learning progress</p>
                        <div className="h-3 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-accent-500 to-indigo-500 rounded-full" style={{ width: '76%' }} />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-accent-600 dark:text-accent-400">76% toward weekly goal</p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 text-white shadow-lg">
                        <p className="text-sm opacity-90">Motivation</p>
                        <p className="font-bold text-lg mt-1">Small daily progress compounds into big results.</p>
                    </div>
                </motion.aside>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl p-6 border border-white/40 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search</h2>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses, tutors, and channels..."
                            className="w-full px-4 py-3 bg-white/90 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                        {search.trim() && (
                            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="bg-gray-50/80 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Courses</p>
                                    {searchResults.courses.map((c) => (
                                        <button key={c.id} onClick={() => navigate(`/courses/${c.id}`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-gray-50/80 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Tutors</p>
                                    {searchResults.tutors.map((t) => (
                                        <button key={t.id} onClick={() => navigate('/tutors')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{t.name}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-gray-50/80 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Channels</p>
                                    {searchResults.channels.map((c) => (
                                        <button key={c.id} onClick={() => navigate(`/chat?view=all&channel=${c.id}`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">#{c.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
                            <a href="/courses" className="text-accent-600 hover:text-accent-700 font-semibold text-sm">View All →</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(isLoading ? [1, 2] : continueLearningCards.slice(0, 2)).map((course: any, index) =>
                                isLoading ? (
                                    <div key={index} className="h-64 rounded-xl bg-white/70 dark:bg-slate-800 animate-pulse border border-gray-200 dark:border-slate-700" />
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
                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl p-5 border border-white/40 dark:border-slate-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Your Teachers</h3>
                        <div className="space-y-3">
                            {tutors.slice(0, 4).map((teacher) => (
                                <div key={teacher.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 transition-all">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                                        {teacher.name.split(' ').map((namePart) => namePart[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{teacher.name}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{teacher.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl p-5 border border-white/40 dark:border-slate-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-3 text-sm">
                            <p className="flex items-center justify-between text-gray-700 dark:text-gray-300"><span className="flex items-center gap-2"><Target size={14} /> Goals hit</span> <strong>6 / 7</strong></p>
                            <p className="flex items-center justify-between text-gray-700 dark:text-gray-300"><span className="flex items-center gap-2"><Sparkles size={14} /> Community points</span> <strong>{state.stats.communityPoints}</strong></p>
                            <p className="flex items-center justify-between text-gray-700 dark:text-gray-300"><span className="flex items-center gap-2"><Clock size={14} /> Upcoming sessions</span> <strong>{upcomingSessions.length}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
