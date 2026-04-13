import { useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { TutorCard } from '../components'
import TutorPaymentModal from '../components/TutorPaymentModal'
import { useApp } from '../state/AppContext'
import { tutors as allTutors } from '../data/tutors'
import { useNavigate } from 'react-router-dom'

export default function Tutors() {
    const { actions } = useApp()
    const navigate = useNavigate()
    const tutors = allTutors

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState([0, 100])
    const [minRating, setMinRating] = useState(4.0)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const subjects = [...new Set(tutors.map((t) => t.subject))]

    const selectedTutor = useMemo(
        () => tutors.find((t) => t.id === selectedTutorId) ?? null,
        [tutors, selectedTutorId],
    )

    const filteredTutors = tutors.filter((tutor) => {
        const subjectMatch = !selectedSubject || tutor.subject === selectedSubject
        const priceMatch = tutor.hourlyRate >= priceRange[0] && tutor.hourlyRate <= priceRange[1]
        const ratingMatch = tutor.rating >= minRating
        const searchMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || tutor.subject.toLowerCase().includes(searchTerm.toLowerCase())
        return subjectMatch && priceMatch && ratingMatch && searchMatch
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Find Your Tutor</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Connect with experienced tutors to accelerate your learning</p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or subject..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                    </div>
                </div>

                {/* Filter Button */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filters</label>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Advanced Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Results</label>
                    <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{filteredTutors.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters Sidebar and Tutors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 h-fit sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filters</h3>

                    {/* Subject Filter */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Subject</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${!selectedSubject
                                        ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                All Subjects
                            </button>
                            {subjects.map((subject) => (
                                <button
                                    key={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedSubject === subject
                                            ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price per Hour</p>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ${priceRange[0]} - ${priceRange[1]}/hr
                            </p>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</p>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                        >
                            <option value={0}>Any Rating</option>
                            <option value={4.0}>4.0+</option>
                            <option value={4.5}>4.5+</option>
                            <option value={4.7}>4.7+</option>
                            <option value={4.9}>4.9+</option>
                        </select>
                    </div>
                </div>

                {/* Tutors Grid */}
                <div className="lg:col-span-3">
                    {filteredTutors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTutors.map((tutor) => (
                                <TutorCard
                                    key={tutor.id}
                                    {...tutor}
                                    onSelect={(id) => {
                                        setSelectedTutorId(id)
                                        setIsModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center">
                            <p className="text-lg text-gray-600 dark:text-gray-400">No tutors found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSelectedSubject(null)
                                    setPriceRange([0, 100])
                                    setMinRating(0)
                                    setSearchTerm('')
                                }}
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TutorPaymentModal
                tutor={selectedTutor}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onMakePayment={async (tutor) => {
                    const start = new Date()
                    start.setHours(start.getHours() + 2)
                    start.setMinutes(0, 0, 0)
                    actions.startTutorSessionPayment({
                        tutorName: tutor.name,
                        courseType: tutor.subject,
                        title: `Live Tutor Session: ${tutor.subject}`,
                        startTimeIso: start.toISOString(),
                        durationMinutes: 60,
                    })
                    setIsModalOpen(false)
                    navigate('/payment')
                }}
            />
        </div>
    )
}
