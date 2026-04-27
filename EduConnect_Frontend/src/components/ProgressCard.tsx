import { cn } from '../lib/utils'

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
        <div className="group relative bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden">
            {/* Subtle glow effect behind card on hover */}
            <div className={cn("absolute -inset-2 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl z-0", color)}></div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{title}</p>
                        <p className="text-3xl font-extrabold text-foreground mt-1.5 flex items-baseline gap-1">
                            {current} <span className="text-sm font-medium text-muted-foreground">/ {maximum}</span>
                        </p>
                    </div>
                    <div className={cn("p-3.5 rounded-xl shadow-inner", color)}>
                        {icon}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm relative", color)}
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Shimmer effect on progress bar */}
                        <div className="absolute top-0 inset-x-0 h-full bg-white/20 blur-[2px] animate-pulse-soft"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{percentage.toFixed(0)}% completed</span>
                </div>
            </div>
        </div>
    )
}
