import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play, ChevronDown, CheckCircle, Clock, Users, Star, Heart, Share2 } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { jsPDF } from 'jspdf'

export default function CourseView() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [expandedModule, setExpandedModule] = useState(0)
    const { state, actions } = useApp()

    const course = state.courses.find((c) => c.id === (courseId || '1')) ?? state.courses[0]
    const enrollmentStatus = course?.enrollmentStatus ?? 'none'
    const paymentStatus = course?.paymentStatus ?? 'none'
    const isEnrolled = enrollmentStatus === 'enrolled' || enrollmentStatus === 'completed'
    const isPaymentInProgress = paymentStatus === 'in_progress'
    const isCompleted = enrollmentStatus === 'completed'
    const courseDescription =
        'Master advanced patterns and best practices. Learn about hooks, context, performance optimization, and more.'

    const modules = [
        {
            id: 1,
            title: 'Getting Started with React Hooks',
            lessons: [
                { id: 1, title: 'Introduction to Hooks', duration: 15, completed: true },
                { id: 2, title: 'useState Hook Deep Dive', duration: 28, completed: true },
                { id: 3, title: 'useEffect and Side Effects', duration: 35, completed: false },
            ],
        },
        {
            id: 2,
            title: 'Advanced State Management',
            lessons: [
                { id: 4, title: 'useContext for State Sharing', duration: 22, completed: false },
                { id: 5, title: 'useReducer Patterns', duration: 30, completed: false },
                { id: 6, title: 'Custom Hooks Development', duration: 45, completed: false },
            ],
        },
        {
            id: 3,
            title: 'Performance Optimization',
            lessons: [
                { id: 7, title: 'Memoization Techniques', duration: 28, completed: false },
                { id: 8, title: 'Code Splitting and Lazy Loading', duration: 32, completed: false },
                { id: 9, title: 'Profiling and Debugging', duration: 25, completed: false },
            ],
        },
        {
            id: 4,
            title: 'Real-world Applications',
            lessons: [
                { id: 10, title: 'Building a Todo App', duration: 50, completed: false },
                { id: 11, title: 'E-commerce Cart System', duration: 55, completed: false },
                { id: 12, title: 'Final Project', duration: 120, completed: false },
            ],
        },
    ]

    const assignments = [
        {
            id: 1,
            title: 'Hook Implementation Challenge',
            description: 'Create a custom hook that manages form state',
            deadline: '2024-03-15',
            submitted: true,
            grade: 'A',
        },
        {
            id: 2,
            title: 'Performance Optimization Task',
            description: 'Optimize a provided React component',
            deadline: '2024-03-20',
            submitted: false,
            grade: null,
        },
    ]

    const discussions = [
        {
            id: 1,
            author: 'Alex Kumar',
            avatar: 'AK',
            title: 'How to prevent unnecessary re-renders?',
            replies: 8,
            helpful: 24,
        },
        {
            id: 2,
            author: 'Emma Wilson',
            avatar: 'EW',
            title: 'Best practices for useContext',
            replies: 12,
            helpful: 31,
        },
    ]

    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const completedLessons = modules.reduce((sum, m) => sum + m.lessons.filter((l) => l.completed).length, 0)
    const progress = (completedLessons / totalLessons) * 100
    const openYoutubeForTopic = (topic: string) => {
        const randomTerms = ['tutorial', 'full course', 'beginner friendly', 'practical']
        const random = randomTerms[Math.floor(Math.random() * randomTerms.length)]
        const query = encodeURIComponent(`${topic} ${course?.title ?? ''} ${random}`)
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener,noreferrer')
    }

    const issueDate = new Date().toLocaleDateString()
    const credentialId = useMemo(() => `EC-${Math.random().toString(16).slice(2, 10).toUpperCase()}`, [])
    const verificationLink = `https://educonnect.local/verify/${credentialId}`

    const downloadCertificate = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })
        const w = doc.internal.pageSize.getWidth()
        const h = doc.internal.pageSize.getHeight()

        // Border
        doc.setDrawColor(99, 102, 241) // accent
        doc.setLineWidth(2)
        doc.rect(36, 36, w - 72, h - 72)

        // Header
        doc.setFillColor(99, 102, 241)
        doc.rect(36, 36, w - 72, 72, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(18)
        doc.text('EduConnect', 56, 78)

        doc.setTextColor(17, 24, 39)
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.text('CERTIFICATE OF COMPLETION', w / 2, 160, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(14)
        doc.text('Presented to', w / 2, 210, { align: 'center' })

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(22)
        doc.text(state.profile?.fullName || state.user?.username || 'Learner', w / 2, 250, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(14)
        doc.text('For successfully completing certification requirements', w / 2, 295, { align: 'center' })

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.text(`Course: ${course?.title ?? 'EduConnect Certification'}`, w / 2, 340, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(12)
        doc.text(`Issued on: ${issueDate}`, 72, 420)
        doc.text(`Credential ID: ${credentialId}`, 72, 444)
        doc.text(`Verification: ${verificationLink}`, 72, 468)

        doc.setFontSize(10)
        doc.setTextColor(107, 114, 128)
        doc.text('This certificate is generated by EduConnect.', w / 2, h - 72, { align: 'center' })

        doc.save(`EduConnect-Certificate-${credentialId}.pdf`)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 animate-fade-in">
            {/* Video Player Section */}
            <div className="bg-black h-96 flex items-center justify-center relative">
                <div className="w-full h-full bg-gradient-to-br from-accent-600 to-accent-900 flex items-center justify-center">
                    <button
                        onClick={() => openYoutubeForTopic(course?.title ?? 'course')}
                        className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition-colors shadow-xl"
                    >
                        <Play size={40} className="text-accent-600 ml-1" fill="currentColor" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-8">
                        {/* Course Info */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">By {course.instructor}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                        <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <button className="p-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                        <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    <span>{course.rating}/5 ({course.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    <span>{course.students.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{course.duration} hours</span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">{courseDescription}</p>
                        </div>

                        {/* Progress */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Progress</h3>
                                <span className="text-2xl font-bold text-accent-600">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                {completedLessons} of {totalLessons} lessons completed
                            </p>
                        </div>

                        {/* Modules */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Modules</h2>
                            <div className="space-y-3">
                                {modules.map((module, idx) => (
                                    <div key={module.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                                        <button
                                            onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <div className="text-left flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{module.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{module.lessons.length} lessons</p>
                                            </div>
                                            <ChevronDown
                                                size={20}
                                                className={`transition-transform ${expandedModule === idx ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {expandedModule === idx && (
                                            <div className="border-t border-gray-200 dark:border-slate-700">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson.id} className="px-6 py-3 border-t border-gray-200 dark:border-slate-700 first:border-t-0 flex items-center gap-3">
                                                        {lesson.completed ? (
                                                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                                        ) : (
                                                            <Play size={18} className="text-gray-400 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-900 dark:text-white">{lesson.title}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => openYoutubeForTopic(lesson.title)}
                                                            className="px-2 py-1 rounded-md text-xs font-semibold bg-accent-50 text-accent-700 hover:bg-accent-100 dark:bg-accent-900/40 dark:text-accent-300"
                                                        >
                                                            Video
                                                        </button>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">{lesson.duration}m</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignments */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h2>
                                <button
                                    onClick={() => navigate('/assignments')}
                                    className="text-sm font-semibold text-accent-600 hover:text-accent-700"
                                >
                                    Open Quiz Section
                                </button>
                            </div>
                            <div className="space-y-4">
                                {assignments.map((assignment) => (
                                    <div key={assignment.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.description}</p>
                                            </div>
                                            {assignment.submitted && (
                                                <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                                                    Grade: {assignment.grade}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Due: {assignment.deadline}</span>
                                            <button
                                                onClick={() => navigate('/assignments')}
                                                className="text-accent-600 hover:text-accent-700 font-semibold"
                                            >
                                                {assignment.submitted ? 'View Submission' : 'Submit Assignment'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discussion Forum */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discussion Forum</h2>
                            <div className="space-y-4">
                                {discussions.map((discussion) => (
                                    <div key={discussion.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {discussion.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{discussion.author}</p>
                                                        <h3 className="text-gray-900 dark:text-white font-medium mt-1">{discussion.title}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{discussion.replies} replies</span>
                                                    <span>👍 {discussion.helpful} helpful</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => {
                                    actions.setActiveChannelId('queries')
                                    navigate('/chat?view=all&channel=queries')
                                }}
                                className="mt-6 w-full py-3 border-2 border-accent-600 text-accent-600 rounded-lg font-semibold hover:bg-accent-50 dark:hover:bg-accent-900 transition-colors"
                            >
                                Start a Discussion
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-1">
                        {/* Course Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 sticky top-24">
                            <div className="h-32 bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-6xl">
                                {course?.thumbnail ?? '📘'}
                            </div>
                            <div className="p-6">
                                {isPaymentInProgress && (
                                    <div className="mb-4 px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg text-center font-semibold">
                                        Enrollment - In Progress
                                    </div>
                                )}

                                {isEnrolled && !isPaymentInProgress ? (
                                    <div className="space-y-2 mb-4">
                                        <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center font-semibold">
                                            ✓ Enrolled
                                        </div>
                                        {!isCompleted && (
                                            <button
                                                onClick={() => actions.completeCourse(course.id)}
                                                className="w-full py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                                            >
                                                Mark Course Completed
                                            </button>
                                        )}
                                        {isCompleted && (
                                            <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-center font-semibold">
                                                Completed
                                            </div>
                                        )}
                                    </div>
                                ) : isEnrolled && isPaymentInProgress ? (
                                    <button
                                        onClick={() => actions.completeCoursePayment(course.id)}
                                        className="w-full mb-4 py-3 bg-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Complete Payment
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => actions.startCourseEnrollment(course.id)}
                                        className="w-full mb-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Enroll Now
                                    </button>
                                )}

                                <div className="space-y-4 border-t border-gray-200 dark:border-slate-700 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{course?.instructor}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{course?.duration} hours</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Skill Level</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">Intermediate</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={isCompleted ? downloadCertificate : undefined}
                                    className={`w-full mt-6 py-2 border border-gray-300 dark:border-slate-700 rounded-lg transition-colors font-semibold text-sm ${
                                        isCompleted 
                                            ? 'text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/30 border-accent-200 cursor-pointer' 
                                            : 'text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                    title={isCompleted ? "Download Certificate" : "Complete course to download certificate"}
                                >
                                    Download Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
