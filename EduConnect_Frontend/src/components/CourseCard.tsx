import { Star, Users, Clock, Play } from 'lucide-react'
import type { CourseEnrollmentStatus } from '../state/types'
import { cn } from '../lib/utils'

interface CourseCardProps {
    id: string
    title: string
    instructor: string
    rating: number
    reviews: number
    students: number
    duration: string
    thumbnail: string
    imageUrl?: string
    enrollmentStatus?: CourseEnrollmentStatus
    channelName?: string
    onStartDiscussion?: (courseId: string) => void
    onEnroll?: (courseId: string) => void
    onOpenCourse?: (courseId: string) => void
}

export default function CourseCard({
    id,
    title,
    instructor,
    rating,
    reviews,
    students,
    duration,
    thumbnail,
    imageUrl,
    enrollmentStatus = 'none',
    channelName,
    onStartDiscussion,
    onEnroll,
    onOpenCourse,
}: CourseCardProps) {
    const isEnrolled = enrollmentStatus === 'enrolled' || enrollmentStatus === 'completed'
    const fallbackImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
    const heroImage = imageUrl ?? fallbackImage

    const badge =
        enrollmentStatus === 'enrolled' || enrollmentStatus === 'completed'
            ? { text: 'Enrolled', className: 'bg-green-500/90 text-white backdrop-blur-md border border-green-400/50' }
            : null

    const ctaLabel =
        enrollmentStatus === 'enrolled'
            ? 'Continue Learning'
            : enrollmentStatus === 'completed'
                ? 'Completed'
                : 'Enroll Now'

    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={heroImage}
                    alt={title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 rounded-xl bg-black/40 px-2.5 py-1 text-white text-xs font-semibold backdrop-blur-md border border-white/10">
                    {thumbnail}
                </div>
                {badge && (
                    <div className={`absolute top-4 right-4 ${badge.className} px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {badge.text}
                    </div>
                )}
                
                {/* Play Button Overlay (Visible on Hover) */}
                {isEnrolled && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={() => onOpenCourse?.(id)}
                            className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center pl-1 backdrop-blur-md shadow-xl transform hover:scale-110 transition-transform"
                        >
                            <Play size={24} className="fill-white" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground font-medium mb-3">{instructor}</p>
                
                {channelName && (
                    <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Community: #{channelName}
                        </span>
                    </div>
                )}

                <div className="mt-auto">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-600 dark:text-yellow-400">
                            <Star size={14} className="fill-current" />
                            <span className="font-bold text-xs">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">({reviews} reviews)</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>{students.toLocaleString()}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border"></div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{duration}h</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                if (enrollmentStatus === 'none') onEnroll?.(id)
                                else onOpenCourse?.(id)
                            }}
                            className={cn(
                                "w-full py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center",
                                isEnrolled
                                    ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                                    : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                            )}
                        >
                            {ctaLabel}
                        </button>

                        {onStartDiscussion && isEnrolled && (
                            <button
                                onClick={() => onStartDiscussion(id)}
                                className="w-full py-2.5 bg-background border-2 border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors font-bold text-sm"
                            >
                                Start Discussion
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
