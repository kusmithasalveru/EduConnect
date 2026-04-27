import { useMemo, useRef, useState } from 'react'
import { Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'

interface Assignment {
    id: string
    course: string
    title: string
    description: string
    dueDate: string
    status: 'submitted' | 'pending' | 'overdue'
    submitted?: boolean
    grade?: string
    submissionDate?: string
    submissionFileName?: string
    submissionFileDataUrl?: string
    submissionFileType?: string
}

interface QuizQuestion {
    id: string
    question: string
    options: string[]
    correctIndex: number
}

interface Quiz {
    id: string
    topic: string
    title: string
    questions: QuizQuestion[]
}

export default function Assignments() {
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'all'>('pending')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadTargetId, setUploadTargetId] = useState<string | null>(null)
    const [dragOverId, setDragOverId] = useState<string | null>(null)
    const [viewingId, setViewingId] = useState<string | null>(null)
    const [uploadError, setUploadError] = useState('')
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
    const [quizScore, setQuizScore] = useState<number | null>(null)

    const [assignments, setAssignments] = useState<Assignment[]>([
        {
            id: '1',
            course: 'React Advanced Patterns',
            title: 'Hook Implementation Challenge',
            description: 'Create a custom hook that manages form state with validation',
            dueDate: '2024-03-15',
            status: 'submitted',
            submitted: true,
            grade: 'A',
            submissionDate: '2024-03-14',
        },
        {
            id: '2',
            course: 'React Advanced Patterns',
            title: 'Performance Optimization Task',
            description: 'Optimize a provided React component using memoization',
            dueDate: '2024-03-20',
            status: 'pending',
        },
        {
            id: '3',
            course: 'Data Science Fundamentals',
            title: 'Data Cleaning Project',
            description: 'Clean and preprocess a real-world dataset',
            dueDate: '2024-03-18',
            status: 'pending',
        },
        {
            id: '4',
            course: 'Web Design Masterclass',
            title: 'UI Design Mockup',
            description: 'Create a high-fidelity mockup for a mobile app',
            dueDate: '2024-03-10',
            status: 'overdue',
        },
        {
            id: '5',
            course: 'Advanced TypeScript',
            title: 'Type Definition Exercise',
            description: 'Write complex TypeScript type definitions',
            dueDate: '2024-03-25',
            status: 'pending',
        },
        {
            id: '6',
            course: 'React Advanced Patterns',
            title: 'Context API Implementation',
            description: 'Build a state management system using Context API',
            dueDate: '2024-03-13',
            status: 'submitted',
            submitted: true,
            grade: 'A+',
            submissionDate: '2024-03-12',
        },
    ])

    const filteredAssignments = assignments.filter((a) => {
        if (activeTab === 'pending') return a.status === 'pending' || a.status === 'overdue'
        if (activeTab === 'submitted') return a.status === 'submitted'
        return true
    })

    const pendingCount = useMemo(() => assignments.filter((a) => a.status === 'pending').length, [assignments])
    const submittedCount = useMemo(() => assignments.filter((a) => a.status === 'submitted').length, [assignments])
    const overdueCount = useMemo(() => assignments.filter((a) => a.status === 'overdue').length, [assignments])
    const quizzes: Quiz[] = [
        {
            id: 'q1',
            topic: 'React',
            title: 'React Basics Quiz',
            questions: [
                { id: 'q1-1', question: 'Which hook is used for local state?', options: ['useMemo', 'useState', 'useRef', 'useEffect'], correctIndex: 1 },
                { id: 'q1-2', question: 'JSX stands for?', options: ['JavaScript XML', 'Java Syntax eXtension', 'JSON XML', 'JavaScript Exchange'], correctIndex: 0 },
            ],
        },
        {
            id: 'q2',
            topic: 'TypeScript',
            title: 'TypeScript Quick Check',
            questions: [
                { id: 'q2-1', question: 'TypeScript is a superset of?', options: ['Java', 'Python', 'JavaScript', 'C#'], correctIndex: 2 },
                { id: 'q2-2', question: 'Which keyword defines interface?', options: ['type', 'class', 'interface', 'implements'], correctIndex: 2 },
            ],
        },
    ]

    const activeQuiz = quizzes.find((q) => q.id === activeQuizId) ?? null

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            case 'pending':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            case 'overdue':
                return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            default:
                return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted':
                return <CheckCircle size={16} />
            case 'pending':
                return <Clock size={16} />
            case 'overdue':
                return <AlertCircle size={16} />
            default:
                return null
        }
    }

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate)
        const today = new Date()
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    const applySubmission = async (assignmentId: string, file: File) => {
        // Removed PDF restriction to allow any file type since users might upload images/docs
        setUploadError('')
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsDataURL(file)
        })

        setAssignments((prev) =>
            prev.map((a) => {
                if (a.id !== assignmentId) return a
                return {
                    ...a,
                    status: 'submitted',
                    submitted: true,
                    submissionDate: new Date().toISOString().slice(0, 10),
                    submissionFileName: file.name,
                    submissionFileType: file.type,
                    submissionFileDataUrl: dataUrl,
                }
            }),
        )
    }

    const deleteSubmission = (assignmentId: string) => {
        setAssignments((prev) =>
            prev.map((a) => {
                if (a.id !== assignmentId) return a
                return {
                    ...a,
                    status: a.status === 'overdue' ? 'overdue' : 'pending',
                    submitted: false,
                    grade: undefined,
                    submissionDate: undefined,
                    submissionFileName: undefined,
                    submissionFileDataUrl: undefined,
                    submissionFileType: undefined,
                }
            }),
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Assignments</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Track and manage your course assignments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                        {pendingCount}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Submitted</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        {submittedCount}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                        {overdueCount}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Grade</p>
                    <p className="text-3xl font-bold text-accent-600 dark:text-accent-400 mt-2">A-</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-slate-800">
                {['pending', 'submitted', 'all'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-3 font-semibold transition-colors border-b-2 ${activeTab === tab
                                ? 'text-accent-600 dark:text-accent-400 border-accent-600 dark:border-accent-400'
                                : 'text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:border-slate-700'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            onDragOver={(e) => {
                                e.preventDefault()
                                if (!assignment.submitted) setDragOverId(assignment.id)
                            }}
                            onDragLeave={() => setDragOverId(null)}
                            onDrop={(e) => {
                                e.preventDefault()
                                setDragOverId(null)
                                if (assignment.submitted) return
                                const file = e.dataTransfer.files?.[0]
                                if (file) void applySubmission(assignment.id, file)
                            }}
                            className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow relative ${dragOverId === assignment.id ? 'ring-2 ring-accent-500' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900 dark:to-accent-800">
                                        <FileText className="text-accent-600 dark:text-accent-400" size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{assignment.course}</p>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                                    {getStatusIcon(assignment.status)}
                                    <span>{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar size={16} className="text-gray-400" />
                                        <p className="font-semibold text-gray-900 dark:text-white">{assignment.dueDate}</p>
                                    </div>
                                    <p className={`text-xs font-medium mt-1 ${getDaysUntilDue(assignment.dueDate) < 0 ? 'text-red-600 dark:text-red-400' : getDaysUntilDue(assignment.dueDate) < 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {getDaysUntilDue(assignment.dueDate) > 0 ? `${getDaysUntilDue(assignment.dueDate)} days left` : 'Overdue'}
                                    </p>
                                </div>
                                {assignment.submitted && assignment.submissionDate && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                                        <p className="font-semibold text-gray-900 dark:text-white mt-1">{assignment.submissionDate}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">On time ✓</p>
                                    </div>
                                )}
                                {assignment.grade && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
                                        <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 mt-1">{assignment.grade}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {assignment.submitted ? (
                                    <>
                                        <button
                                            onClick={() => setViewingId(assignment.id)}
                                            className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
                                        >
                                            View Submission
                                        </button>
                                        <button
                                            onClick={() => deleteSubmission(assignment.id)}
                                            className="flex-1 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-semibold text-sm border border-red-200 dark:border-red-800"
                                        >
                                            Delete Submission
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                // We must set the ID BEFORE triggering click
                                                // So that when the onChange event fires, it has access to the target
                                                setUploadTargetId(assignment.id)
                                                // Use a slight timeout to ensure state is set if needed, though React 18 usually batches
                                                setTimeout(() => fileInputRef.current?.click(), 10)
                                            }}
                                            className="flex-1 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
                                        >
                                            Upload Submission
                                        </button>
                                        <button
                                            disabled
                                            className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 rounded-lg cursor-not-allowed font-semibold text-sm"
                                        >
                                            Delete Submission
                                        </button>
                                    </>
                                )}
                            </div>

                            {!assignment.submitted && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                                    Tip: Drag & drop a file anywhere on this card to upload.
                                </p>
                            )}

                            {assignment.submitted && assignment.submissionFileName && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-green-600 dark:text-green-400 font-medium">
                                    Uploaded: <span className="font-semibold">{assignment.submissionFileName}</span> ✓
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-400">No assignments found.</p>
                    </div>
                )}
            </div>

            {uploadError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {uploadError}
                </div>
            )}

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.topic}</p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{quiz.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{quiz.questions.length} questions</p>
                            <button
                                onClick={() => {
                                    setActiveQuizId(quiz.id)
                                    setQuizAnswers({})
                                    setQuizScore(null)
                                }}
                                className="mt-4 w-full py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="*/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    // If state update was too slow, we can fall back to checking if file exists
                    // Actually, if we use setTimeout on the click, state will be set.
                    if (!file) return
                    
                    if (uploadTargetId) {
                        void applySubmission(uploadTargetId, file)
                    }
                    
                    e.currentTarget.value = ''
                }}
            />

            {/* View Submission Modal */}
            {viewingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={() => setViewingId(null)}
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close modal"
                    />
                    {(() => {
                        const a = assignments.find((x) => x.id === viewingId) ?? null
                        if (!a) return null
                        return (
                            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{a.course}</p>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{a.title}</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setViewingId(null)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="p-6">
                                    {!a.submissionFileDataUrl ? (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            No uploaded file is attached to this submission in the demo.
                                        </div>
                                    ) : a.submissionFileType?.startsWith('image/') ? (
                                        <img
                                            src={a.submissionFileDataUrl}
                                            alt={a.submissionFileName ?? 'Submission'}
                                            className="w-full max-h-[70vh] object-contain rounded-lg border border-gray-200 dark:border-slate-800"
                                        />
                                    ) : a.submissionFileType === 'application/pdf' ? (
                                        <iframe
                                            title="Submission PDF"
                                            src={a.submissionFileDataUrl}
                                            className="w-full h-[70vh] rounded-lg border border-gray-200 dark:border-slate-800 bg-white"
                                        />
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Preview not available for this file type.
                                            </p>
                                            <a
                                                href={a.submissionFileDataUrl}
                                                download={a.submissionFileName ?? 'submission'}
                                                className="inline-flex px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                            >
                                                Download File
                                            </a>
                                        </div>
                                    )}

                                    {a.submissionFileName && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                                            File: <span className="font-semibold">{a.submissionFileName}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            {activeQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button type="button" onClick={() => setActiveQuizId(null)} className="absolute inset-0 bg-black/40" />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{activeQuiz.title}</h3>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">
                            {activeQuiz.questions.map((question, index) => (
                                <div key={question.id}>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-3">{index + 1}. {question.question}</p>
                                    <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <button
                                                key={option}
                                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                                                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${quizAnswers[question.id] === optionIndex
                                                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                                                    : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {quizScore !== null && (
                                <div className="rounded-lg bg-green-50 text-green-700 px-4 py-3 font-semibold">
                                    Your score: {quizScore}/{activeQuiz.questions.length}
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3">
                            <button
                                onClick={() => setActiveQuizId(null)}
                                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-700"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    const score = activeQuiz.questions.reduce(
                                        (acc, q) => acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
                                        0,
                                    )
                                    setQuizScore(score)
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg"
                            >
                                Submit Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
