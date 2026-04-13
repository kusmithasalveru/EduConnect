import { useState } from 'react'
import { Search } from 'lucide-react'
import { CourseCard } from '../components'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import type { Course } from '../state/types'

export default function Courses() {
    const { state, actions } = useApp()
    const navigate = useNavigate()
    const allCourses: Course[] = state.courses

    const getChannelName = (courseId: string, explicit?: string) => {
        const channel = explicit ? state.channels.find((c) => c.id === explicit) : undefined
        if (channel) return channel.name
        return state.channels.find((c) => c.id === `course_${courseId}`)?.name
    }

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular')

    const categories = [...new Set(allCourses.map((c) => c.category))].filter(Boolean) as string[]

    const filteredCourses = allCourses
        .filter((course) => {
            const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            const categoryMatch = !selectedCategory || course.category === selectedCategory
            return searchMatch && categoryMatch
        })
        .sort((a, b) => {
            if (sortBy === 'popular') return b.students - a.students
            if (sortBy === 'rating') return b.rating - a.rating
            return 0
        })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Explore Courses</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Discover and enroll in world-class courses</p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Courses</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by course name or instructor..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-8 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${!selectedCategory
                            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                >
                    All Courses
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Courses Grid */}
            <div>
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                                enrollmentStatus={course.enrollmentStatus}
                                channelName={getChannelName(course.id, course.channelId)}
                                onEnroll={(id) => {
                                    actions.startCourseEnrollment(id)
                                    navigate(`/chat?view=all&channel=course_${id}`)
                                }}
                                onOpenCourse={(id) => {
                                    navigate(`/courses/${id}`)
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">No courses found matching your search.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory(null)
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Courses', value: allCourses.length.toString() },
                    { label: 'Active Learners', value: '50K+' },
                    { label: 'Avg Rating', value: '4.8★' },
                    { label: 'Instructor Network', value: '200+' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-slate-700">
                        <p className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent mb-2">
                            {stat.value}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
