import { useState } from 'react'
import { Trophy, TrendingUp, Zap } from 'lucide-react'
import { useApp } from '../state/AppContext'

interface LeaderboardEntry {
    rank: number
    name: string
    avatar: string
    points: number
    coursesCompleted: number
    streak: number
    level: number
}

export default function Leaderboard() {
    const { state, actions } = useApp()
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all-time'>('week')
    const [category, setCategory] = useState<'points' | 'courses' | 'streak'>('points')

    const bookedPayments = state.courses.filter((c) => c.paymentStatus === 'in_progress')

    const leaderboardData: Record<string, LeaderboardEntry[]> = {
        'week-points': [
            { rank: 1, name: 'Sarah Chen', avatar: 'SC', points: 2850, coursesCompleted: 8, streak: 7, level: 12 },
            { rank: 2, name: 'Alex Kumar', avatar: 'AK', points: 2420, coursesCompleted: 6, streak: 5, level: 11 },
            { rank: 3, name: 'Emma Wilson', avatar: 'EW', points: 2180, coursesCompleted: 5, streak: 8, level: 10 },
            { rank: 4, name: 'David Park', avatar: 'DP', points: 1950, coursesCompleted: 4, streak: 3, level: 9 },
            { rank: 5, name: 'Maria Garcia', avatar: 'MG', points: 1720, coursesCompleted: 3, streak: 6, level: 8 },
            { rank: 6, name: 'John Martinez', avatar: 'JM', points: 1480, coursesCompleted: 2, streak: 4, level: 7 },
            { rank: 7, name: 'You', avatar: 'JD', points: 1250, coursesCompleted: 2, streak: 3, level: 6 },
            { rank: 8, name: 'Lisa Wong', avatar: 'LW', points: 980, coursesCompleted: 1, streak: 2, level: 5 },
        ],
        'month-points': [
            { rank: 1, name: 'Sarah Chen', avatar: 'SC', points: 8450, coursesCompleted: 12, streak: 28, level: 15 },
            { rank: 2, name: 'Alex Kumar', avatar: 'AK', points: 7920, coursesCompleted: 10, streak: 22, level: 14 },
            { rank: 3, name: 'Emma Wilson', avatar: 'EW', points: 7480, coursesCompleted: 9, streak: 25, level: 13 },
            { rank: 4, name: 'David Park', avatar: 'DP', points: 6850, coursesCompleted: 8, streak: 18, level: 12 },
            { rank: 5, name: 'You', avatar: 'JD', points: 5420, coursesCompleted: 5, streak: 12, level: 9 },
            { rank: 6, name: 'Maria Garcia', avatar: 'MG', points: 4850, coursesCompleted: 4, streak: 10, level: 8 },
            { rank: 7, name: 'John Martinez', avatar: 'JM', points: 3920, coursesCompleted: 3, streak: 8, level: 7 },
            { rank: 8, name: 'Lisa Wong', avatar: 'LW', points: 2680, coursesCompleted: 2, streak: 5, level: 6 },
        ],
        'all-time-points': [
            { rank: 1, name: 'Sarah Chen', avatar: 'SC', points: 45200, coursesCompleted: 28, streak: 45, level: 25 },
            { rank: 2, name: 'Alex Kumar', avatar: 'AK', points: 42100, coursesCompleted: 25, streak: 38, level: 23 },
            { rank: 3, name: 'Emma Wilson', avatar: 'EW', points: 38900, coursesCompleted: 22, streak: 40, level: 22 },
            { rank: 4, name: 'David Park', avatar: 'DP', points: 35600, coursesCompleted: 20, streak: 32, level: 20 },
            { rank: 5, name: 'You', avatar: 'JD', points: 18450, coursesCompleted: 10, streak: 15, level: 12 },
            { rank: 6, name: 'Maria Garcia', avatar: 'MG', points: 16200, coursesCompleted: 8, streak: 12, level: 10 },
            { rank: 7, name: 'John Martinez', avatar: 'JM', points: 13800, coursesCompleted: 6, streak: 9, level: 8 },
            { rank: 8, name: 'Lisa Wong', avatar: 'LW', points: 9450, coursesCompleted: 4, streak: 6, level: 6 },
        ],
    }

    const leaderboardKey = `${timeframe}-${category}`
    const currentLeaderboard = leaderboardData[leaderboardKey.replace(/-points$/, '-points')] || leaderboardData['week-points']

    const getRankMedal = (rank: number) => {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Trophy className="text-yellow-500" size={40} />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">See how you rank against other learners</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Timeframe */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Timeframe</label>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as any)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all-time">All Time</option>
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                        <option value="points">Community Points</option>
                        <option value="courses">Courses Completed</option>
                        <option value="streak">Learning Streak</option>
                    </select>
                </div>

                {/* Stats Box */}
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-sm opacity-90">Your Current Rank</p>
                        <p className="text-3xl font-bold">#7</p>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="mb-8 grid grid-cols-3 gap-4">
                {currentLeaderboard.slice(0, 3).map((entry) => (
                    <div
                        key={entry.rank}
                        className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 ${entry.rank === 1
                                ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 col-span-1 row-span-1 order-2'
                                : entry.rank === 2
                                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 col-span-1 row-span-1 order-1'
                                    : 'bg-gradient-to-br from-orange-300 to-orange-500 col-span-1 row-span-1 order-3'
                            }`}
                    >
                        <div className="p-6 text-center text-white">
                            <p className="text-5xl font-bold mb-2">{getRankMedal(entry.rank)}</p>
                            <p className="text-3xl font-bold mb-2">#{entry.rank}</p>
                            <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center font-bold text-xl mx-auto mb-2">
                                {entry.avatar}
                            </div>
                            <h3 className="font-bold text-lg">{entry.name}</h3>
                            <p className="text-sm opacity-90 mt-1">{entry.points.toLocaleString()} pts</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Rank</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">User</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Points</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Courses</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Streak</th>
                            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {currentLeaderboard.map((entry, idx) => (
                            <tr
                                key={entry.rank}
                                className={`transition-colors ${entry.name === 'You'
                                        ? 'bg-accent-50 dark:bg-accent-900 border-l-4 border-accent-600'
                                        : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getRankMedal(entry.rank) || `#${entry.rank}`}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm">
                                            {entry.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{entry.name}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Level {entry.level}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="font-bold text-gray-900 dark:text-white">{entry.points.toLocaleString()}</p>
                                        {idx < 3 && <TrendingUp className="text-green-600 dark:text-green-400" size={16} />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <p className="font-semibold text-gray-900 dark:text-white">{entry.coursesCompleted}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Zap className="text-orange-500" size={16} />
                                        <p className="font-semibold text-gray-900 dark:text-white">{entry.streak}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-block px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm font-semibold">
                                        {entry.level}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Booked Payments (moved from Dashboard) */}
            <div className="mt-10 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Booked Payments</h2>
                {bookedPayments.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No payments currently in progress.</p>
                ) : (
                    <div className="space-y-3">
                        {bookedPayments.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{c.instructor}</p>
                                </div>
                                <button
                                    onClick={() => actions.completeCoursePayment(c.id)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                                >
                                    Complete Payment
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Achievements */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                        { emoji: '🎯', label: 'First Step', desc: 'Complete 1 course' },
                        { emoji: '🔥', label: 'Day 7', desc: '7-day streak' },
                        { emoji: '⭐', label: 'Top Scorer', desc: '1000+ points' },
                        { emoji: '🏆', label: 'Top 10', desc: 'Reach top 10' },
                        { emoji: '📚', label: 'Bookworm', desc: 'Complete 5 courses' },
                        { emoji: '🚀', label: 'Supersonic', desc: 'Level 10' },
                    ].map((achievement, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                            <p className="text-3xl mb-2">{achievement.emoji}</p>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{achievement.label}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
