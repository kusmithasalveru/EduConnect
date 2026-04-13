import { useMemo } from 'react'

function hashString(input: string) {
    let h = 0
    for (let i = 0; i < input.length; i++) {
        h = (h << 5) - h + input.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

function levelToClass(level: number) {
    if (level <= 0) return 'bg-gray-200 dark:bg-slate-800'
    if (level === 1) return 'bg-accent-200 dark:bg-accent-900'
    if (level === 2) return 'bg-accent-300 dark:bg-accent-800'
    if (level === 3) return 'bg-accent-500 dark:bg-accent-600'
    return 'bg-accent-600 dark:bg-accent-500'
}

export default function HeatMap({
    seed,
    days = 30,
    title = 'Learning Heatmap',
    subtitle = 'Last 30 days activity',
}: {
    seed: string
    days?: number
    title?: string
    subtitle?: string
}) {
    const cells = useMemo(() => {
        const base = hashString(seed || 'educonnect')
        const arr: { dateIso: string; level: number }[] = []
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const v = (base + i * 1103515245) % 97
            const level = v < 45 ? 0 : v < 65 ? 1 : v < 80 ? 2 : v < 92 ? 3 : 4
            arr.push({ dateIso: d.toISOString().slice(0, 10), level })
        }
        return arr
    }, [seed, days])

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>Low</span>
                    <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((lvl) => (
                            <span key={lvl} className={`w-3 h-3 rounded ${levelToClass(lvl)}`} />
                        ))}
                    </div>
                    <span>High</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {cells.map((c) => (
                    <div
                        key={c.dateIso}
                        title={`${c.dateIso}`}
                        className={`w-4 h-4 rounded ${levelToClass(c.level)}`}
                    />
                ))}
            </div>
        </div>
    )
}

