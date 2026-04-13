import { Lock, CheckCircle } from 'lucide-react'
import { useApp } from '../state/AppContext'

type Reward = {
    level: number
    name: string
    description: string
    requiredPoints: number
}

const rewards: Reward[] = [
    {
        level: 1,
        name: 'Virtual EduConnect T‑Shirt',
        description: 'Personalized with your name + “EduConnect”',
        requiredPoints: 100,
    },
    {
        level: 2,
        name: 'EduConnect Cap',
        description: 'Cap with EduConnect branding',
        requiredPoints: 300,
    },
    {
        level: 3,
        name: 'EduConnect Bag',
        description: 'Bag with EduConnect branding',
        requiredPoints: 600,
    },
]

export default function EShop() {
    const { state } = useApp()
    const points = state.stats.communityPoints

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">E‑Shop</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Unlock rewards using your Community Points</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Community Points</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{points.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rewards.map((r) => {
                    const unlocked = points >= r.requiredPoints
                    return (
                        <div
                            key={r.level}
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Level {r.level}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{r.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.description}</p>
                                </div>
                                {unlocked ? (
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                        <CheckCircle size={18} />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${unlocked ? 'bg-green-500' : 'bg-accent-500'}`}
                                        style={{ width: `${Math.min(100, (points / r.requiredPoints) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    {unlocked
                                        ? 'Unlocked'
                                        : `${Math.max(0, r.requiredPoints - points)} points to unlock`}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

