import { Star, Calendar, DollarSign } from 'lucide-react'

interface TutorCardProps {
    id: string
    name: string
    subject: string
    rating: number
    reviews: number
    hourlyRate: number
    availability: string
    bio: string
    avatar: string
    tags: string[]
    onSelect?: (tutorId: string) => void
}

export default function TutorCard({
    id,
    name,
    subject,
    rating,
    reviews,
    hourlyRate,
    availability,
    bio,
    avatar,
    tags,
    onSelect,
}: TutorCardProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Header with Avatar */}
            <div className="bg-gradient-to-r from-accent-400 to-accent-600 h-24 relative">
                <div className="absolute left-4 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-br from-accent-300 to-accent-600 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {avatar}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pt-10">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{subject}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">({reviews} reviews)</p>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{bio}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign size={16} />
                        <span>${hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>{availability}</span>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={() => onSelect?.(id)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                >
                    Book Session
                </button>
            </div>
        </div>
    )
}
