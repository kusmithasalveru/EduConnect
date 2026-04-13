import { Star, Users, Clock } from 'lucide-react'
import type { CourseEnrollmentStatus } from '../state/types'

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
            ? { text: 'Enrolled', className: 'bg-green-500' }
            : null

    const ctaLabel =
        enrollmentStatus === 'enrolled'
            ? 'Continue Learning'
            : enrollmentStatus === 'completed'
                ? 'Completed'
                : 'Enroll Now'

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={heroImage}
                    alt={title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/30 px-2 py-1 text-white text-xs backdrop-blur">
                    {thumbnail}
                </div>
                {badge && (
                    <div className={`absolute top-3 right-3 ${badge.className} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {badge.text}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{instructor}</p>
                {channelName && (
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
                            Community: #{channelName}
                        </span>
                    </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">({reviews} reviews)</span>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{duration} hours</span>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={() => {
                        if (enrollmentStatus === 'none') onEnroll?.(id)
                        else onOpenCourse?.(id)
                    }}
                    className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${isEnrolled
                            ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                            : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                        }`}
                >
                    {ctaLabel}
                </button>

                {onStartDiscussion && isEnrolled && (
                    <button
                        onClick={() => onStartDiscussion(id)}
                        className="w-full mt-2 py-2 border-2 border-accent-600 text-accent-600 dark:text-accent-400 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900 transition-colors font-semibold text-sm"
                    >
                        Start a Discussion
                    </button>
                )}
            </div>
        </div>
    )
}
