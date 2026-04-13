import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

export interface TutorPaymentModalTutor {
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
}

export default function TutorPaymentModal({
    tutor,
    isOpen,
    onClose,
    onMakePayment,
}: {
    tutor: TutorPaymentModalTutor | null
    isOpen: boolean
    onClose: () => void
    onMakePayment: (tutor: TutorPaymentModalTutor) => Promise<void> | void
}) {
    const [isPaying, setIsPaying] = useState(false)

    const title = useMemo(() => (tutor ? `Live Tutor Session with ${tutor.name}` : 'Live Tutor Session'), [tutor])

    if (!isOpen || !tutor) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" onClick={onClose} className="absolute inset-0 bg-black/40" aria-label="Close modal" />

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tutor Profile</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{title}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl p-6 text-white">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-4">
                                {tutor.avatar}
                            </div>
                            <p className="text-xl font-bold">{tutor.name}</p>
                            <p className="text-accent-100 text-sm mt-1">{tutor.subject}</p>
                            <p className="text-accent-100 text-xs mt-4">Availability</p>
                            <p className="text-sm font-semibold">{tutor.availability}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">About</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tutor.bio}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                    {tutor.rating.toFixed(1)} <span className="text-xs text-gray-600 dark:text-gray-400">({tutor.reviews})</span>
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Rate</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">${tutor.hourlyRate}/hr</p>
                            </div>
                            <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Session Type</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">Live</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tutor.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={isPaying}
                            onClick={async () => {
                                if (isPaying) return
                                setIsPaying(true)
                                try {
                                    await onMakePayment(tutor)
                                } finally {
                                    setIsPaying(false)
                                }
                            }}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${isPaying
                                    ? 'bg-gray-200 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {isPaying ? 'Redirecting to gateway...' : 'Make Payment'}
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

