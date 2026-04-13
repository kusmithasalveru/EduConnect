interface ProgressCardProps {
    title: string
    current: number
    maximum: number
    icon: React.ReactNode
    color: string
}

export default function ProgressCard({ title, current, maximum, icon, color }: ProgressCardProps) {
    const percentage = (current / maximum) * 100

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {current}/{maximum}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{percentage.toFixed(0)}% completed</span>
                <span className="text-xs text-gray-500 dark:text-gray-400" />
            </div>
        </div>
    )
}
